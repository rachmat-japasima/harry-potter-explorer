import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The 25 populated character portraits are served from imagekit.
    remotePatterns: [{ protocol: "https", hostname: "ik.imagekit.io" }],
  },
  output: "export",
};

export default nextConfig;
