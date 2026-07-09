/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  // Suppress noisy hydration warnings from third-party browser extensions
  reactStrictMode: true,
};

module.exports = nextConfig;
