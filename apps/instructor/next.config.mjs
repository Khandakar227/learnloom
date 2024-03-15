/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/utils"],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com"
      },
      {
        protocol: "https",
        hostname: "utfs.io"
      }
    ]
  }
};

export default nextConfig;