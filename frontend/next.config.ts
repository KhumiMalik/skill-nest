import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Remote image hosts that next/image may optimise. Images are fetched by the Next.js
 * server, so the browser only ever loads them from our own origin (`img-src 'self'`).
 */
const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
  // Placeholder images used by the mock API. Remove once real images are served by the backend.
  { protocol: "https", hostname: "placehold.co", pathname: "/**" },
];
if (process.env.API_BASE_URL) {
  const api = new URL(process.env.API_BASE_URL);
  remotePatterns.push({
    protocol: api.protocol === "http:" ? "http" : "https",
    hostname: api.hostname,
    pathname: "/**",
  });
}

/**
 * Static Content Security Policy (see docs/architecture.md, "Security").
 * Nonces would force every page to render per request, which defeats static
 * rendering and caching, so we use a strict static policy instead. Next.js injects
 * small inline bootstrap scripts, which is why script-src needs 'unsafe-inline'.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.openstreetmap.org",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  images: { remotePatterns },
  sassOptions: {
    // Bootstrap's partials import each other by bare name (e.g. "variables-dark"), so its folder is a load path too.
    loadPaths: [path.join(process.cwd(), "node_modules"), path.join(process.cwd(), "node_modules/bootstrap/scss")],
    // Bootstrap 5.3 still uses Sass @import and global functions; hide its deprecation noise.
    quietDeps: true,
    silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
