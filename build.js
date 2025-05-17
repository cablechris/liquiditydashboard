const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Print information about the environment
console.log('Current directory:', process.cwd());
console.log('Directories:', fs.readdirSync('.').filter(f => fs.statSync(f).isDirectory()));
console.log('Files:', fs.readdirSync('.').filter(f => fs.statSync(f).isFile()));
console.log('Web directory contents:', fs.readdirSync('web'));

// Create .env.local file with necessary environment variables
console.log('Creating environment file...');
const envContent = `
REDIS_URL=redis://default:7juo4GJt3KdsAZ14CoxdGEi2ZMxDcpnP@redis-14809.c74.us-east-1-4.ec2.redns.redis-cloud.com:14809
UPDATE_SECRET=a0f9e15e94a695909b55a647a69f4077
FRED_API_KEY=cb5383ab035e688ed2b059c39a9cf0c7
`;
fs.writeFileSync('web/.env.local', envContent.trim());

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('cd web && npm install --no-fund', { stdio: 'inherit' });
  
  // Build the Next.js application
  console.log('Building Next.js app...');
  execSync('cd web && npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 