/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
      { protocol: 'https', hostname: 'i.imgur.com' },
    ],
  },
  async rewrites() {
    const isDev = process.env.NODE_ENV !== 'production';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://social-cinebee.onrender.com';
    
    if (isDev) {
      return [
        { source: '/api/:path*', destination: 'http://localhost:5000/api/:path*' },
        { source: '/socket.io/:path*', destination: 'http://localhost:5000/socket.io/:path*' },
      ];
    }

    return [
      { source: '/api/:path*', destination: `${apiUrl}/api/:path*` },
      { source: '/socket.io/:path*', destination: `${apiUrl}/socket.io/:path*` },
    ];
  },
};

module.exports = nextConfig;
