/**
 * Legacy File Cleanup Script
 * 
 * This script removes redundant or deprecated files from the codebase
 * after implementing our streamlined approach.
 */

const fs = require('fs');
const path = require('path');

// Files that are now redundant
const REDUNDANT_FILES = [
  // Old update scripts replaced by unified versions
  'update-all-data.ps1',
  'update-data.js',
  'schedule-data-update.ps1',
  'update-dashboard-data.bat',
  
  // Documentation files consolidated into SETUP.md
  'task-scheduler-setup.md',
  'VERCEL_KV_SETUP.md',
  
  // Legacy Python scripts no longer used
  'etl/local_etl.py',
  'debug_etl.py',
  'test_etl.py',
  'Makefile'
];

// Backup directory to move files to instead of deleting
const BACKUP_DIR = path.join(__dirname, 'legacy-backup');

// Helper function to ensure a directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Helper function to move a file to backup directory
function backupFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return false;
    }
    
    // Create backup directory if it doesn't exist
    ensureDirectoryExists(BACKUP_DIR);
    
    // Create necessary subdirectories
    const dirname = path.dirname(filePath);
    if (dirname !== '.') {
      const backupSubdir = path.join(BACKUP_DIR, dirname);
      ensureDirectoryExists(backupSubdir);
    }
    
    // Create backup filename
    const backupPath = path.join(BACKUP_DIR, filePath);
    
    // Copy the file to backup location
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up: ${filePath} -> ${backupPath}`);
    
    // Delete the original file
    fs.unlinkSync(filePath);
    console.log(`Removed: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Main function to clean up legacy files
function cleanupLegacyFiles(dryRun = false) {
  console.log(`${dryRun ? 'Dry run - ' : ''}Starting legacy file cleanup process...`);
  
  let backedUp = 0;
  let failed = 0;
  
  for (const file of REDUNDANT_FILES) {
    if (dryRun) {
      if (fs.existsSync(file)) {
        console.log(`Would remove: ${file}`);
      } else {
        console.log(`Not found: ${file}`);
      }
      continue;
    }
    
    const success = backupFile(file);
    if (success) {
      backedUp++;
    } else {
      failed++;
    }
  }
  
  // Clean up any .bak files in the series directory
  const seriesDir = path.join(__dirname, 'web', 'public', 'series');
  if (fs.existsSync(seriesDir)) {
    fs.readdirSync(seriesDir).forEach(file => {
      if (file.endsWith('.bak')) {
        const filePath = path.join(seriesDir, file);
        
        if (dryRun) {
          console.log(`Would remove: ${filePath}`);
        } else {
          try {
            fs.unlinkSync(filePath);
            console.log(`Removed .bak file: ${filePath}`);
            backedUp++;
          } catch (error) {
            console.error(`Error removing file ${filePath}:`, error);
            failed++;
          }
        }
      }
    });
  }
  
  console.log(`\nCleanup complete: ${backedUp} files processed, ${failed} failed.`);
  if (!dryRun) {
    console.log(`All removed files were backed up to: ${BACKUP_DIR}`);
  }
}

// Check command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  
  if (dryRun) {
    console.log('Running in dry run mode - no files will be modified');
  }
  
  cleanupLegacyFiles(dryRun);
}

module.exports = { cleanupLegacyFiles }; 