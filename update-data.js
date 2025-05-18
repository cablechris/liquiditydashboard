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

console.log('Starting data update process with real FRED API key...');

// Set the FRED API key as an environment variable
process.env.FRED_API_KEY = 'b097d5c8ab0518b60d627580f2b0582a';

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