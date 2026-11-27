import crypto from "node:crypto";

export function getFirebaseProjectId() {
  return (process.env.FIREBASE_PROJECT_ID || "").trim();
}

export function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}

export function getAdminPasscode() {
  return String(process.env.ADMIN_PASSCODE || "").trim();
}

function getPinSigningSecret() {
  return `${getAdminPasscode()}:${getFirebaseProjectId()}:${getAdminEmail()}`;
}

export function verifyAdminPasscodeInput(code) {
  const expected = getAdminPasscode();
  const actual = String(code || "").trim();
  if (!expected || !actual) return false;
  const a = Buffer.from(actual, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createAdminPinToken(uid) {
  const exp = Date.now() + 2 * 60 * 60 * 1000;
  const payload = `${uid}.${exp}`;
  const sig = crypto
    .createHmac("sha256", getPinSigningSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminPinToken(token, uid) {
  if (!token || !uid || !getAdminPasscode()) return false;
  const parts = String(token).split(".");
  if (parts.length !== 3) return false;
  const [tokenUid, expStr, sig] = parts;
  if (tokenUid !== uid) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp <= Date.now()) return false;

  const expectedSig = crypto
    .createHmac("sha256", getPinSigningSecret())
    .update(`${tokenUid}.${expStr}`)
    .digest("hex");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expectedSig, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function hasValidAdminUnlock(req) {
  if (!req.authUser?.isAdmin) return false;
  const token = req.headers["x-admin-token"];
  return verifyAdminPinToken(token, req.authUser.uid);
}

const CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let cachedCerts = null;
let certsExpiresAt = 0;

async function getPublicCerts() {
  const now = Date.now();
  if (cachedCerts && now < certsExpiresAt) {
    return cachedCerts;
  }

  const res = await fetch(CERTS_URL);
  if (!res.ok) {
    throw new Error("Unable to fetch Firebase public keys");
  }

  const cacheControl = res.headers.get("cache-control") || "";
  const match = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeSec = match ? Number(match[1]) : 3600;

  cachedCerts = await res.json();
  certsExpiresAt = now + maxAgeSec * 1000;
  return cachedCerts;
}

function decodeBase64Url(str) {
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, "base64");
}

export async function verifyFirebaseIdToken(token) {
  const projectId = getFirebaseProjectId();
  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is not configured");
  }

  const parts = String(token || "").split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [headerB64, payloadB64, sigB64] = parts;
  const header = JSON.parse(decodeBase64Url(headerB64).toString("utf8"));
  const payload = JSON.parse(decodeBase64Url(payloadB64).toString("utf8"));

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Invalid token algorithm");
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (!payload.sub || payload.aud !== projectId) {
    throw new Error("Invalid token audience");
  }
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new Error("Invalid token issuer");
  }
  if (!payload.exp || payload.exp <= nowSec) {
    throw new Error("Token expired");
  }

  const certs = await getPublicCerts();
  const cert = certs[header.kid];
  if (!cert) {
    throw new Error("Signing certificate not found");
  }

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`${headerB64}.${payloadB64}`);
  verifier.end();

  const signature = decodeBase64Url(sigB64);
  if (!verifier.verify(cert, signature)) {
    throw new Error("Invalid token signature");
  }

  const email = String(payload.email || "").toLowerCase();
  const adminEmail = getAdminEmail();
  const isVerifiedEmail = payload.email_verified === true;
  return {
    uid: payload.sub,
    email,
    emailVerified: isVerifiedEmail,
    name: payload.name || "",
    picture: payload.picture || "",
    isAdmin: Boolean(isVerifiedEmail && adminEmail && email === adminEmail),
  };
}

export async function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    req.authUser = null;
    return next();
  }

  const token = header.slice(7).trim();
  if (!token) {
    req.authUser = null;
    return next();
  }

  try {
    req.authUser = await verifyFirebaseIdToken(token);
  } catch (err) {
    console.warn("Auth token verification failed:", err.message);
    req.authUser = null;
  }
  next();
}

export function requireAuth(req, _res, next) {
  if (!req.authUser) {
    const err = new Error("Avval tizimga kiring");
    err.status = 401;
    throw err;
  }
  next();
}

export function requireAdmin(req, _res, next) {
  if (!req.authUser) {
    const err = new Error("Avval tizimga kiring");
    err.status = 401;
    throw err;
  }
  if (!req.authUser.isAdmin) {
    const err = new Error("Faqat admin uchun ruxsat etilgan");
    err.status = 403;
    throw err;
  }
  next();
}

export function requireAdminUnlocked(req, _res, next) {
  requireAdmin(req, _res, () => {});
  if (!hasValidAdminUnlock(req)) {
    const err = new Error("Admin kodi talab qilinadi");
    err.status = 403;
    throw err;
  }
  next();
}
