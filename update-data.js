/**
 * Daily FRED Data Update Script
 * 
 * This script fetches the latest Federal Reserve data from FRED API
 * 
 * To set up as a scheduled task in Windows:
 * 1. Open Task Scheduler
 * 2. Create Basic Task
 * 3. Name it "Fed Dashboard Data Update"
 * 4. Set trigger to Daily
 * 5. Set action to "Start a program"
 * 6. Program/script: node
 * 7. Add arguments: update-data.js
 * 8. Set working directory to this project folder
 */

console.log('Starting data update process...');

// You must set the FRED_API_KEY environment variable before running this script
// For example: FRED_API_KEY=your_api_key node update-data.js
if (!process.env.FRED_API_KEY) {
  console.error('Error: FRED API key is not set!');
  console.error('Please set the FRED_API_KEY environment variable before running this script.');
  console.error('For example: FRED_API_KEY=your_api_key node update-data.js');
  process.exit(1);
}

// Import the FRED data fetcher module
const fredDataFetcher = require('./web/lib/fetch-fred-data');

// Run the update and handle the result
fredDataFetcher.updateAllSeries()
  .then(results => {
    console.log('Data update completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Data update failed:', error);
    process.exit(1);
  }); 