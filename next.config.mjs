/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["assets.tina.io", "img.youtube.com"],
  },
  async redirects() {
    return [
      {
        source: "/blog/recording-work-item-snagit",
        destination: "/docs/recording-work-item-snagit",
        permanent: true,
      },
      {
        source: "/blog/recording-work-item-and-tips",
        destination: "/docs/recording-work-item-and-tips",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
};

export default nextConfig;
