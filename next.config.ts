import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      domains: [
        "files.edgestore.dev"
      ]
    },

    reactStrictMode: false,
    
};

export default nextConfig;
