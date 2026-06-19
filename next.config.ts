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
  async rewrites() {
    return [
      {
        source: '/landingpage/:path*',
        destination: '/landingpage/:path*/index.html',
      },
      {
        source: '/kbclaza/landingpage/:path*',
        destination: '/kbclaza/landingpage/:path*/index.html',
      }
    ];
  },
};

export default nextConfig;
