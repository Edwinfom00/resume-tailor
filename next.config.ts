import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["lightningcss", "@tailwindcss/postcss", "@tailwindcss/node"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
