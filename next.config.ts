import type { NextConfig } from "next";

/**
 * Cover images are served by the Django API (absolute URLs built from the
 * request host, e.g. http://localhost:8000/media/...). Derive an allowed
 * next/image remote pattern from NEXT_PUBLIC_API_URL, and always allow the
 * local dev hosts.
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
