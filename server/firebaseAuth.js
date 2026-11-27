import crypto from "node:crypto";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "";
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

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
  if (!FIREBASE_PROJECT_ID) {
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
  if (!payload.sub || payload.aud !== FIREBASE_PROJECT_ID) {
    throw new Error("Invalid token audience");
  }
  if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) {
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
  return {
    uid: payload.sub,
    email,
    name: payload.name || "",
    picture: payload.picture || "",
    isAdmin: Boolean(ADMIN_EMAIL && email === ADMIN_EMAIL),
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
  } catch {
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
