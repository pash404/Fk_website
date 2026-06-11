/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      { source: '/seller', destination: '/seller/dashboard', permanent: false },
    ];
  },
};

module.exports = nextConfig;
