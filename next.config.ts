import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

// Dev only: phones on the same network open the dev server by this machine's
// LAN address, and Next blocks dev scripts (so nothing hydrates) for hosts it
// wasn't started with.
const lanAddresses = Object.values(networkInterfaces())
  .flatMap((nets) => nets ?? [])
  .filter((net) => net.family === "IPv4" && !net.internal)
  .map((net) => net.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: lanAddresses,
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920, 2560],
  },
  experimental: {
    // A warm build once shipped a stale globals.css (an old colour token) from
    // .next/cache/turbopack. Cold builds of this site take seconds, so build
    // without the persistent cache rather than risk stale production styles.
    turbopackFileSystemCacheForBuild: false,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        // Only our own stylesheets: next/font's generated CSS must not be re-processed.
        condition: { not: "foreign" },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
