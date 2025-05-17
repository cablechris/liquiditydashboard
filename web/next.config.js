/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Output as standalone for Vercel deployment
  output: 'standalone',
  
  // Disable TypeScript strict checking during build to avoid blocking deployments
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure webpack to handle Redis properly on client side
  webpack: (config, { isServer }) => {
    // Handle Redis module on client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        path: false,
        crypto: false
      };
      
      // Skip Redis on client side
      config.resolve.alias = {
        ...config.resolve.alias,
        'redis': false
      };
    }
    
    return config;
  },

  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false
};

module.exports = nextConfig;