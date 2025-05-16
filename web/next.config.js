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

  // Configure path aliases explicitly
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
}

module.exports = nextConfig 