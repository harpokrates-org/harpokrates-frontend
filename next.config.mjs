/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  //reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
      },
      {
        protocol: 'https',
        hostname: '**.staticflickr.com',
      },
    ],
  }
};

export default nextConfig;
