import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, API_BASE } from "@/lib/server-api";

export async function POST() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;

  if (token) {
    // Best-effort: invalidate the token server-side. Ignore failures.
    await fetch(`${API_BASE}/api/auth/logout/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    }).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
