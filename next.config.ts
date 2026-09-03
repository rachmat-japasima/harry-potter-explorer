import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The 25 populated character portraits are served from imagekit.
    unoptimized: true,
  },
  output: "export",
};

export default nextConfig;
