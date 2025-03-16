const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('next-bundle-analyzer')({ enabled: true })
  : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ['@auth0/nextjs-auth0']
  },
  images: {
    domains: ['nextjs.org', 'cdn.auth0.com']
  },
  reactStrictMode: true,
  transpilePackages: ['@heroicons/react'],
};

module.exports = withBundleAnalyzer(nextConfig); 