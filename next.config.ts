import type { NextConfig } from "next";

// Keep production builds in a separate directory so a running dev server's
// .next output is never replaced by `npm run build`.
const nextConfig = (phase: string): NextConfig => ({
  reactStrictMode: true,
  // Playwright and local checks use 127.0.0.1; allow that dev origin explicitly.
  allowedDevOrigins: ["127.0.0.1"],
  // The parent folder also has a lockfile; keep tracing scoped to this app.
  outputFileTracingRoot: process.cwd(),
  distDir:
    phase === "phase-production-build" || phase === "phase-production-server"
      ? ".next-build"
      : ".next",
});

export default nextConfig;
