import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blush-rational-bass-781.mypinata.cloud',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**'
      }
    ]
  }
};

export default nextConfig;
