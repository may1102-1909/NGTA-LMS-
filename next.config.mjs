/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  async redirects() {
    return [
      {
        source: "/live",
        destination: "/courses",
        permanent: false,
      },
      {
        source: "/live-classes",
        destination: "/courses",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
