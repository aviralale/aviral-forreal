import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, API_BASE } from "@/lib/server-api";

/**
 * Authenticated proxy to the Django admin API. The dashboard calls
 * /api/admin/<...> same-origin; this handler attaches the token from the
 * httpOnly cookie and forwards the request (JSON or multipart) to Django. The
 * token never reaches client JS, and CORS never enters the picture.
 */
async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await ctx.params;
  const target = `${API_BASE}/api/admin/${path.join("/")}/${req.nextUrl.search}`;

  const headers: Record<string, string> = { Authorization: `Token ${token}` };
  const init: RequestInit = { method: req.method, headers, cache: "no-store" };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const contentType = req.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;
    init.body = await req.arrayBuffer();
  }

  const res = await fetch(target, init);

  // 204/304 must not carry a body — constructing a Response with one throws.
  const noBody = res.status === 204 || res.status === 304;
  const body = noBody ? null : await res.arrayBuffer();
  const responseHeaders = new Headers();
  const contentType = res.headers.get("content-type");
  if (contentType && !noBody) responseHeaders.set("content-type", contentType);

  return new NextResponse(body, { status: res.status, headers: responseHeaders });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
