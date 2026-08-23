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
      { source: '/api/auth/:path*', destination: `${API_URL}/api/auth/:path*` },
      { source: '/api/chat/:path*', destination: `${API_URL}/api/chat/:path*` },
      { source: '/api/comments/:path*', destination: `${API_URL}/api/comments/:path*` },
      { source: '/api/social/:path*', destination: `${API_URL}/api/social/:path*` },
      { source: '/api/library/:path*', destination: `${API_URL}/api/library/:path*` },
      { source: '/api/notifications/:path*', destination: `${API_URL}/api/notifications/:path*` },
      { source: '/api/admin/:path*', destination: `${API_URL}/api/admin/:path*` },
      { source: '/api/ai/:path*', destination: `${API_URL}/api/ai/:path*` },
      { source: '/api/profile-comments/:path*', destination: `${API_URL}/api/profile-comments/:path*` },
      { source: '/api/upload/:path*', destination: `${API_URL}/api/upload/:path*` },
      { source: '/socket.io/:path*', destination: `${API_URL}/socket.io/:path*` },
      { source: '/uploads/:path*', destination: `${API_URL}/uploads/:path*` },
    ];
  },
};

module.exports = nextConfig;
