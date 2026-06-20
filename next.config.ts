import type { NextConfig } from "next";

// Set BUILD_TARGET=capacitor for APK builds (static export, no API routes).
// Normal builds (server mode) support Gemini API routes.
const isCapacitorBuild = process.env.BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  ...(isCapacitorBuild ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
