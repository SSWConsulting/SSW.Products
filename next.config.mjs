/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["assets.tina.io", "img.youtube.com"],
  },
  // The blog opengraph-image route reads banners/author photos from public/ via
  // fs at runtime; dynamic paths aren't statically traced, so without this the
  // files are missing from the serverless bundle and the image renders black
  outputFileTracingIncludes: {
    "/**/opengraph-image": [
      "./public/*/Blogs/**/*",
      "./public/*/Devs/**/*",
      "./public/default-images/**/*",
    ],
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
      {
        source: "/docs/recording-work-item-smartphone",
        destination: "/docs/recording-on-mobile",
        permanent: true,
      },
      {
        source: "/docs/setting-up-other-recording-tools",
        destination: "/docs/third-party-tools-setup",
        permanent: true,
      },
      // An old copy of the YakShaver introduction that showed up as a duplicate
      // search result - the doc was retired, so send its readers to the live one
      {
        source: "/docs/how-to-use-yakshaver",
        destination: "/docs/introduction",
        permanent: true,
      },
      {
        source: "/zh/docs/how-to-use-yakshaver",
        destination: "/zh/docs/introduction",
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
