/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Output as a standalone app
  output: 'standalone',
  
  // Enable TypeScript strict mode but ignore build errors
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Handle trailing slashes
  trailingSlash: false,

  // Set the base path if deploying to a subdirectory
  // basePath: '',

  // Configure webpack to handle Redis properly
  webpack: (config, { isServer }) => {
    // Add proper aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    
    // Handle Redis module on server-side only
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false
      };
    }
    
    return config;
  },

  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Silence Redis errors in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
};

module.exports = nextConfig; 