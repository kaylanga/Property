/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper transpilation for server components
  experimental: {
    // Enable improved server component handling
    serverComponentsExternalPackages: [],
    // Add helpful error messages for diagnostics
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Disable React Compiler (if you're experiencing issues)
    // swcMinify: false
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // Fix Link component resolution issues
  webpack: (config, { dev, isServer }) => {
    // Enhance module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },
};
module.exports = nextConfig;
