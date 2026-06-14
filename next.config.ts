import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ship a minimal self-contained server for the Docker runtime image.
  output: "standalone",
  // Keep the native better-sqlite3 binary external (loaded from node_modules, not bundled).
  serverExternalPackages: ["better-sqlite3"],
  // Ship the SQL migrations into the standalone server so startup migrations work.
  outputFileTracingIncludes: {
    "**": ["./drizzle/**/*"],
  },
};

export default nextConfig;
