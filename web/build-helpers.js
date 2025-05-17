/**
 * Build helpers for Vercel deployment
 * This script ensures all required files are in the right place before build
 */
const fs = require('fs');
const path = require('path');

// Check if lib files exist and are in the correct location
function checkAndFixLibFiles() {
  console.log('🔍 Checking lib files...');
  
  const libDir = path.join(__dirname, 'lib');
  if (!fs.existsSync(libDir)) {
    console.log('📁 Creating lib directory...');
    fs.mkdirSync(libDir, { recursive: true });
  }
  
  // Define the required lib files and their content
  const libFiles = {
    'format.ts': `/**
 * Format a number to compact representation (K, M, B, T)
 */
export function fmt(n: number): string {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + ' T';
  if (n >= 1e9)  return (n / 1e9 ).toFixed(1) + ' B';
  if (n >= 1e6)  return (n / 1e6 ).toFixed(1) + ' M';
  return n.toLocaleString();
}

/**
 * Format a number as currency with $ prefix
 */
export const fmt$ = (n: number) => '$' + fmt(n);`,
    
    'palette.ts': `// Define accent colors for each metric
export const ACCENT:{[k:string]:string} = {
  on_rrp:   '#2962ff',
  reserves: '#2962ff',
  move:     '#2962ff',
  srf:      '#2962ff',
  funding:  '#2962ff',
};`
  };
  
  // Create or update the lib files
  Object.entries(libFiles).forEach(([filename, content]) => {
    const filePath = path.join(libDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`✏️ Creating ${filename}...`);
      fs.writeFileSync(filePath, content);
    }
  });
  
  console.log('✅ Lib files are ready');
}

// Check if public data files exist
function checkPublicDataFiles() {
  console.log('🔍 Checking public data files...');
  
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    console.log('📁 Creating public directory...');
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const seriesDir = path.join(publicDir, 'series');
  if (!fs.existsSync(seriesDir)) {
    console.log('📁 Creating series directory...');
    fs.mkdirSync(seriesDir, { recursive: true });
  }
  
  // Create sample dashboard.json if it doesn't exist
  const dashboardPath = path.join(publicDir, 'dashboard.json');
  if (!fs.existsSync(dashboardPath)) {
    console.log('✏️ Creating sample dashboard.json...');
    const sampleDashboard = {
      date: new Date().toISOString().split('T')[0],
      on_rrp: 500000,
      reserves: 3500000,
      move: 120,
      srf: 5000,
      bill_share: 0.5,
      tail_bp: 2,
      status: {
        on_rrp: "green",
        reserves: "green",
        move: "green",
        srf: "green",
        tail: "green"
      }
    };
    fs.writeFileSync(dashboardPath, JSON.stringify(sampleDashboard, null, 2));
  }
  
  // Create sample series files if they don't exist
  const seriesFiles = ['on_rrp', 'reserves', 'move', 'srf', 'funding', 'bill_share', 'tail_bp'];
  seriesFiles.forEach(series => {
    const seriesPath = path.join(seriesDir, `${series}.json`);
    if (!fs.existsSync(seriesPath)) {
      console.log(`✏️ Creating sample ${series}.json...`);
      
      // Generate 730 days (2 years) of sample data
      const data = [];
      const today = new Date();
      for (let i = 730; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Generate a sample value based on the series type
        let value;
        switch (series) {
          case 'on_rrp':
            value = Math.max(50000, 2000000 - (i * 2500));
            break;
          case 'reserves':
            value = 3500000 + (Math.sin(i / 60) * 200000);
            break;
          case 'move':
            value = 120 + (Math.sin(i / 40) * 15);
            break;
          case 'srf':
            value = 5000 + (Math.random() * 5000);
            break;
          case 'funding':
            value = 50 + (Math.sin(i / 50) * 10);
            break;
          case 'bill_share':
            value = 0.5 + (Math.sin(i / 80) * 0.1);
            break;
          case 'tail_bp':
            value = 2 + (Math.sin(i / 70) * 1);
            break;
          default:
            value = 100 + (Math.sin(i / 60) * 20);
        }
        
        data.push({ date: dateStr, value });
      }
      
      fs.writeFileSync(seriesPath, JSON.stringify(data, null, 2));
    }
  });
  
  console.log('✅ Public data files are ready');
}

// Run the checks
try {
  checkAndFixLibFiles();
  checkPublicDataFiles();
  console.log('🚀 All required files are ready for build');
} catch (error) {
  console.error('❌ Error during build preparation:', error);
  process.exit(1);
} 