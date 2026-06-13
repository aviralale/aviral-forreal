import type { NextConfig } from "next";

/**
 * Cover images come from one of two places:
 *  - dev / local: the Django API serves them at <API_URL>/media/...
 *  - production: a Cloudflare R2 bucket on its own public host
 *    (NEXT_PUBLIC_MEDIA_URL, e.g. https://media.example.com/covers/...).
 * Allow the local dev hosts plus a pattern derived from each env var so
 * next/image will optimise them.
 */
const remotePatterns: NonNullable<
  NextConfig["images"]
>["remotePatterns"] = [
  { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
  { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (apiUrl) {
  try {
    const { protocol, hostname, port } = new URL(apiUrl);
    remotePatterns.push({
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      port: port || undefined,
      pathname: "/media/**",
    });
  } catch {
    // Ignore malformed NEXT_PUBLIC_API_URL — local patterns still apply.
  }
}

// R2 (or any CDN) public media host. Files live at the bucket root, so allow
// any path on that host.
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
if (mediaUrl) {
  try {
    const { protocol, hostname, port } = new URL(mediaUrl);
    remotePatterns.push({
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      port: port || undefined,
      pathname: "/**",
    });
  } catch {
    // Ignore malformed NEXT_PUBLIC_MEDIA_URL.
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    // Next 16 blocks the image optimizer from fetching upstreams that resolve
    // to private/loopback IPs (SSRF protection). In dev the Django API is on
    // localhost, so allow it there only — production serves media from a public
    // host and must keep this off.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
