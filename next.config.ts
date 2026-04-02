import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // next/image requires a loader for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
