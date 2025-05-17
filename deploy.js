const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting deployment process...');

// Ensure we're in the right directory
const webDir = path.join(__dirname, 'web');
if (!fs.existsSync(webDir)) {
  console.error('web directory not found!');
  process.exit(1);
}

// Create temporary .env file with environment variables
const envFile = path.join(webDir, '.env.local');
const envContent = `
REDIS_URL=redis://default:7juo4GJt3KdsAZ14CoxdGEi2ZMxDcpnP@redis-14809.c74.us-east-1-4.ec2.redns.redis-cloud.com:14809
UPDATE_SECRET=a0f9e15e94a695909b55a647a69f4077
FRED_API_KEY=cb5383ab035e688ed2b059c39a9cf0c7
`;

console.log('Creating environment file...');
fs.writeFileSync(envFile, envContent.trim());

try {
  // Run the deployment in the web directory
  console.log('Running vercel deployment...');
  execSync('cd web && vercel --prod', { stdio: 'inherit' });
  console.log('Deployment command completed');
} catch (error) {
  console.error('Deployment failed:', error);
} finally {
  // Clean up
  if (fs.existsSync(envFile)) {
    console.log('Cleaning up temporary files...');
    fs.unlinkSync(envFile);
  }
}

console.log('Deployment process finished'); 