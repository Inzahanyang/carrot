/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["random.dog", "imagedelivery.net"],
  },
};

module.exports = nextConfig;
