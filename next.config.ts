/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rvmxxlwnrlbbfihhblmy.supabase.co',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
