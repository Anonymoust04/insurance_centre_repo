import type { NextConfig } from "next";
import path from "path";

// Set BUILD_TARGET=capacitor for APK builds (static export, no API routes).
// Normal builds (server mode) support Gemini API routes.
const isCapacitorBuild = process.env.BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  ...(isCapacitorBuild ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    // Persist Turbopack's compiled module graph to disk so pages don't need
    // a slow cold-start on every `npm run dev` restart.
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
