/** @type {import('next').NextConfig} */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://social-cinebee.onrender.com';

const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'avatarfiles.alphacoders.com' },
    ],
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_URL}/api/:path*` },
      { source: '/socket.io/:path*', destination: `${API_URL}/socket.io/:path*` },
      { source: '/uploads/:path*', destination: `${API_URL}/uploads/:path*` },
    ];
  },
};

module.exports = nextConfig;
