/**
 * Unified Dashboard Update Script
 * 
 * This script centralizes all data update functionality for the Liquidity Dashboard.
 * It fetches the latest financial data from all sources and validates it.
 * 
 * Usage:
 *   node update-dashboard.js
 */

const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Configuration
const LOG_DIR = path.join(__dirname, 'web', 'logs');
const LOG_FILE = path.join(LOG_DIR, `update-${new Date().toISOString().split('T')[0]}.log`);

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Create log stream
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

// Helper function to log messages
function log(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}`;
  console.log(formattedMessage);
  logStream.write(formattedMessage + '\n');
}

// Helper function to run a Node.js script with arguments
async function runScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const scriptLabel = args.length > 0 ? `${scriptPath} ${args.join(' ')}` : scriptPath;
    log(`Running ${scriptLabel}...`);
    
    const script = spawn('node', [scriptPath, ...args], {
      cwd: path.join(__dirname, 'web'),
      stdio: 'pipe'
    });
    
    // Capture output
    script.stdout.on('data', (data) => {
      log(`[${scriptLabel}] ${data.toString().trim()}`);
    });
    
    script.stderr.on('data', (data) => {
      log(`[${scriptLabel}] ERROR: ${data.toString().trim()}`);
    });
    
    script.on('close', (code) => {
      if (code === 0) {
        log(`${scriptLabel} completed successfully`);
        resolve();
      } else {
        log(`${scriptLabel} failed with exit code ${code}`);
        resolve(); // Continue with other scripts even if one fails
      }
    });
  });
}

// Main update function
async function updateDashboard() {
  log('Starting Liquidity Dashboard update process');
  
  try {
    // 0. Backup existing data files first
    await runScript('lib/data-backup.js');
    
    // 1. Clean up any old .bak files
    await runScript('lib/data-backup.js', ['clean']);
    
    // 2. Update MOVE index data
    await runScript('lib/import-historical-move-data.js');
    await runScript('lib/fetch-move-data.js');
    
    // 3. Update SRF data
    await runScript('lib/fetch-srf-data.js');
    
    // 4. Update Treasury funding data
    await runScript('lib/fetch-bill-share-data.js');
    
    // 5. Clean up any future-dated entries
    await runScript('lib/cleanup-future-dates.js');
    
    // 6. Validate all data for integrity
    await runScript('lib/validate-data.js');
    
    log('Dashboard update process completed successfully');
  } catch (error) {
    log(`Error during update process: ${error.message}`);
    process.exit(1);
  } finally {
    logStream.end();
  }
}

// Run the update process
updateDashboard(); 