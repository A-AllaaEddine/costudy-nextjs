/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'example.com', 'www.google.com'],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
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
