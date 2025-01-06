/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['assets.tina.io'],
  },
  async redirects()
  {
    return [
      {
        source: '/blog/recording-work-item-snagit',
        destination: '/docs/recording-work-item-snagit',
        permanent: true,
      },
      {
        source: '/blog/recording-work-item-and-tips',
        destination: '/docs/recording-work-item-and-tips',
        permanent: true,
      }
    ];
  }
};

export default nextConfig;
