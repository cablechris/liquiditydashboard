/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as a standalone app
  output: 'standalone',
  
  // Enable TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Handle trailing slashes
  trailingSlash: false,
}

module.exports = nextConfig 