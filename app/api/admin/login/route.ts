import { NextResponse } from "next/server";
import { ADMIN_COOKIE, API_BASE } from "@/lib/server-api";

export async function POST(req: Request) {
  let username = "";
  let password = "";
  try {
    ({ username, password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const res = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    const message =
      res.status === 403
        ? "This account is not allowed to sign in."
        : "Incorrect username or password.";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const data = (await res.json()) as { token: string; username: string };
  const response = NextResponse.json({ username: data.username });
  response.cookies.set(ADMIN_COOKIE, data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}
