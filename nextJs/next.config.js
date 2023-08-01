/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "example.com", "www.google.com"],
  },
};

module.exports = nextConfig;
