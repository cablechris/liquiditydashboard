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

try {
  // Install dependencies in the root package first
  console.log('Installing root dependencies...');
  execSync('npm install redis@4.6.13', { stdio: 'inherit' });
  
  // Run the build command in web directory
  console.log('Installing web dependencies...');
  execSync('cd web && npm install --include=dev', { stdio: 'inherit' });
  
  // Force install redis in web directory
  console.log('Ensuring redis package is installed...');
  execSync('cd web && npm install redis@4.6.13 --save', { stdio: 'inherit' });
  
  // Validate redis can be imported
  console.log('Validating redis installation...');
  execSync('cd web && node -e "require(\'redis\')"', { stdio: 'inherit' });
  
  console.log('Building Next.js app...');
  execSync('cd web && npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 