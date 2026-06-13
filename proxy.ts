import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "admin_token";

/**
 * Gate the dashboard: without the admin session cookie every /dashboard route
 * redirects to the login page; with it, the login page redirects on to the
 * dashboard. (Cookie validity is enforced by the API on each request.)
 *
 * Next 16's "proxy" convention — the renamed successor to middleware.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = req.cookies.has(COOKIE);
  const isLogin = pathname === "/dashboard/login";

  if (!authed && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/login";
    return NextResponse.redirect(url);
  }
  if (authed && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
