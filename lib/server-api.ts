/** Base URL of the Django API for server-side (route handler) calls. */
export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export const ADMIN_COOKIE = "admin_token";
