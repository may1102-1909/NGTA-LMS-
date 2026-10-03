/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "lh4.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh6.googleusercontent.com",
      "wfgwknuyvqxhnpghjeed.supabase.co",
      "api.dicebear.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
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
      {
        source: "/profiole",
        destination: "/profile",
        permanent: false,
      },
      {
        source: "/profiole/:path*",
        destination: "/profile/:path*",
        permanent: false,
      },
      {
        source: "/profiles",
        destination: "/profile",
        permanent: false,
      },
      {
        source: "/profiles/:path*",
        destination: "/profile/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
