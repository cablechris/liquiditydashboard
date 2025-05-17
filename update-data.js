/**
 * Update Data Script
 * This script fetches real Federal Reserve data from FRED and updates the dashboard
 */
const { updateAllSeries } = require('./web/lib/fetch-fred-data');

// Set the FRED API key as an environment variable
process.env.FRED_API_KEY = 'b097d5c8ab0518b60d627580f2b0582a';

console.log('Starting data update process with real FRED API key...');

updateAllSeries()
  .then((results) => {
    console.log('Data update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Data update failed:', error);
    process.exit(1);
  }); 