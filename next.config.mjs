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
      {
        source: "/coure",
        destination: "/courses",
        permanent: false,
      },
      {
        source: "/coure/:path*",
        destination: "/courses/:path*",
        permanent: false,
      },
      {
        source: "/coures",
        destination: "/courses",
        permanent: false,
      },
      {
        source: "/coures/:path*",
        destination: "/courses/:path*",
        permanent: false,
      },
      {
        source: "/course",
        destination: "/courses",
        permanent: false,
      },
      {
        source: "/course/:path*",
        destination: "/courses/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
