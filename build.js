const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Liquidity Dashboard build process...');

// Check if web directory exists
if (!fs.existsSync('web')) {
  console.error('Error: web directory not found!');
  process.exit(1);
}

// Create environment configuration
console.log('Setting up environment configuration...');
const envContent = `
REDIS_URL=redis://default:7juo4GJt3KdsAZ14CoxdGEi2ZMxDcpnP@redis-14809.c74.us-east-1-4.ec2.redns.redis-cloud.com:14809
UPDATE_SECRET=a0f9e15e94a695909b55a647a69f4077
FRED_API_KEY=cb5383ab035e688ed2b059c39a9cf0c7
`;
fs.writeFileSync('web/.env.local', envContent.trim());

// Ensure the redis client implementation exists
console.log('Checking Redis client implementation...');
const redisClientPath = path.join('web', 'lib', 'redis-client.ts');
if (!fs.existsSync(path.dirname(redisClientPath))) {
  fs.mkdirSync(path.dirname(redisClientPath), { recursive: true });
}

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('cd web && npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  // Run the prebuild script
  console.log('Running prebuild...');
  execSync('cd web && node build-helpers.js', { stdio: 'inherit' });
  
  // Build the application
  console.log('Building Next.js application...');
  execSync('cd web && npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 