import { auth } from "./firebase";

const RAW_BASE = import.meta.env.VITE_API_URL?.trim() || "";
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth.currentUser && !headers.has("Authorization")) {
    try {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch {
      // Proceed without token if unavailable
    }
  }

  const adminToken = sessionStorage.getItem("agropulse-admin-token");
  if (adminToken && !headers.has("x-admin-token")) {
    headers.set("x-admin-token", adminToken);
  }

  const res = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof payload === "object" && payload?.error
        ? payload.error
        : `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return payload;
}
