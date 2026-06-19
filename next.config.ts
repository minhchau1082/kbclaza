import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index.html',
        permanent: true,
      },
      {
        source: '/login.html',
        destination: '/login',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
