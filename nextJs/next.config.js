/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'example.com', 'www.google.com'],
  },
  async rewrites() {
    return [
      {
        source: '/contact-us',
        destination: '/support',
      },
    ];
  },
};

module.exports = nextConfig;
