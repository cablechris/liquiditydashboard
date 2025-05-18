/**
 * Universal Data Cleanup Script
 * Removes future-dated entries from all data files
 */
const fs = require('fs');
const path = require('path');
const dateUtils = require('./get-reference-date');

// Data files to process
const DATA_FILES = [
  { path: 'move.json', label: 'MOVE index' },
  { path: 'srf.json', label: 'SRF' },
  { path: 'bill-share.json', label: 'Treasury bill share' }
];

// Main cleanup function
async function cleanupFutureDates() {
  console.log('Starting data cleanup process...');
  
  // Get reference date from reliable external source
  const refDate = await dateUtils.getReferenceDateParts();
  console.log(`Using reference date: ${refDate.year}-${refDate.month}-${refDate.day}`);
  
  let totalRemoved = 0;
  
  // Process each data file
  for (const dataFile of DATA_FILES) {
    const filePath = path.join(__dirname, '..', 'public', 'series', dataFile.path);
    console.log(`\nProcessing ${dataFile.label} data (${filePath})...`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath} - skipping`);
      continue;
    }
    
    try {
      // Read data
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const seriesData = JSON.parse(fileContent);
      console.log(`Loaded ${seriesData.length} ${dataFile.label} data points`);
      
      // Filter out future dates
      const filteredData = [];
      const removedEntries = [];
      
      seriesData.forEach(item => {
        const dateStr = item.date.split('T')[0]; // Get YYYY-MM-DD part
        const dateParts = dateStr.split('-');
        
        const itemYear = parseInt(dateParts[0], 10);
        const itemMonth = parseInt(dateParts[1], 10);
        
        let keepEntry = true;
        
        // Check year first
        if (itemYear > refDate.year) {
          keepEntry = false;
        } 
        // If same year, check month
        else if (itemYear === refDate.year && itemMonth > refDate.month) {
          keepEntry = false;
        }
        
        if (keepEntry) {
          filteredData.push(item);
        } else {
          removedEntries.push(item);
        }
      });
      
      // Count by year
      const countByYear = {};
      removedEntries.forEach(item => {
        const year = item.date.split('-')[0];
        countByYear[year] = (countByYear[year] || 0) + 1;
      });
      
      // Check how many entries were removed
      const removedCount = seriesData.length - filteredData.length;
      totalRemoved += removedCount;
      
      if (removedCount > 0) {
        console.log(`Removed ${removedCount} future-dated entries from ${dataFile.label} data`);
        console.log('Removed entries by year:');
        Object.keys(countByYear).sort().forEach(year => {
          console.log(`  ${year}: ${countByYear[year]} entries`);
        });
        
        // Backup original file
        const backupPath = filePath + '.bak';
        fs.writeFileSync(backupPath, JSON.stringify(seriesData, null, 2));
        console.log(`Original data backed up to ${backupPath}`);
        
        // Write filtered data
        fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2));
        console.log(`Updated ${dataFile.label} data with ${filteredData.length} valid entries`);
      } else {
        console.log(`No future-dated entries found in ${dataFile.label} data`);
      }
    } catch (error) {
      console.error(`Error processing ${dataFile.label} data:`, error);
    }
  }
  
  console.log(`\nCleanup complete! Removed ${totalRemoved} future-dated entries in total.`);
  return totalRemoved;
}

// If run directly
if (require.main === module) {
  cleanupFutureDates()
    .then(totalRemoved => {
      if (totalRemoved > 0) {
        console.log('Data cleanup completed with changes');
      } else {
        console.log('Data cleanup completed with no changes needed');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('Error in cleanup process:', error);
      process.exit(1);
    });
}

module.exports = { cleanupFutureDates }; 