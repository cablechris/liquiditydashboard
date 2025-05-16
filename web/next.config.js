/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Output as a standalone app
  output: 'standalone',
  
  // Enable TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Handle trailing slashes
  trailingSlash: false,

  // Set the base path if deploying to a subdirectory
  // basePath: '',

  // Configure path aliases explicitly
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },

  // Disable source maps in production
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig 