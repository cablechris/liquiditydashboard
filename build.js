const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Print information about the environment
console.log('Current directory:', process.cwd());
console.log('Directories:', fs.readdirSync('.').filter(f => fs.statSync(f).isDirectory()));
console.log('Files:', fs.readdirSync('.').filter(f => fs.statSync(f).isFile()));

// Check if web directory exists
if (!fs.existsSync('web')) {
  console.error('Error: web directory not found!');
  process.exit(1);
}

// Display all files in the web directory
console.log('Web directory contents:', fs.readdirSync('web'));

// Check if package.json exists in web directory
if (!fs.existsSync('web/package.json')) {
  console.error('Error: web/package.json not found!');
  process.exit(1);
}

// Create .env.local file with necessary environment variables
console.log('Creating environment file...');
const envContent = `
REDIS_URL=redis://default:7juo4GJt3KdsAZ14CoxdGEi2ZMxDcpnP@redis-14809.c74.us-east-1-4.ec2.redns.redis-cloud.com:14809
UPDATE_SECRET=a0f9e15e94a695909b55a647a69f4077
FRED_API_KEY=cb5383ab035e688ed2b059c39a9cf0c7
`;
fs.writeFileSync('web/.env.local', envContent.trim());

// Copy directory recursively
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // Install core CSS dependencies globally to ensure they're available
  console.log('Installing core CSS dependencies globally...');
  execSync('npm install -g autoprefixer postcss tailwindcss', { stdio: 'inherit' });
  
  // Install dependencies in the root package 
  console.log('Installing root dependencies...');
  execSync('npm install redis@4.6.13 autoprefixer postcss tailwindcss', { stdio: 'inherit' });
  
  // Run the build command in web directory with proper installation
  console.log('Installing web dependencies...');
  execSync('cd web && npm install --include=dev', { stdio: 'inherit' });
  
  // Ensure CSS processing packages are installed in web directory
  console.log('Installing CSS dependencies in web directory...');
  execSync('cd web && npm install --save-dev autoprefixer@^10.4.16 postcss@^8.4.32 tailwindcss@^3.4.0', { stdio: 'inherit' });
  
  // Force install redis in web directory
  console.log('Ensuring redis package is installed...');
  execSync('cd web && npm install redis@4.6.13 --save', { stdio: 'inherit' });
  
  // Create empty mock modules for client-side
  console.log('Creating browser-compatible shims...');
  const shimDir = path.join('web', 'node_modules', 'redis', 'dist', 'lib', 'client');
  if (!fs.existsSync(shimDir)) {
    fs.mkdirSync(shimDir, { recursive: true });
  }
  
  // Copy node_modules from root to web if needed
  console.log('Ensuring all dependencies are available...');
  const copyNeededModules = ['autoprefixer', 'postcss', 'tailwindcss'];
  copyNeededModules.forEach(mod => {
    const sourceDir = path.join('node_modules', mod);
    const targetDir = path.join('web', 'node_modules', mod);
    if (fs.existsSync(sourceDir) && !fs.existsSync(targetDir)) {
      console.log(`Copying ${mod} from root to web...`);
      copyDirRecursive(sourceDir, targetDir);
    }
  });
  
  console.log('Building Next.js app...');
  execSync('cd web && npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 