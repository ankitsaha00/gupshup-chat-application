import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh", // Allows any subdomain of ufs.sh
      },
      {
        protocol: "https",
        hostname: "utfs.io", // Allows utfs.io as well
      }
    ]
  }
  /* config options here */
};

export default nextConfig;
