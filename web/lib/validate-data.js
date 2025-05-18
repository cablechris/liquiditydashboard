/**
 * Data Validation Script
 * Ensures all dashboard data is accurate and consistent
 */
const fs = require('fs');
const path = require('path');
const dateUtils = require('./get-reference-date');

// Validation functions
async function validateMoveData() {
  console.log('Validating MOVE index data...');
  
  const filePath = path.join(__dirname, '..', 'public', 'series', 'move.json');
  if (!fs.existsSync(filePath)) {
    console.error('ERROR: MOVE data file not found');
    return false;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Found ${data.length} MOVE data points`);
    
    // Get reference date from reliable source
    const refDate = await dateUtils.getReferenceDateParts();
    console.log(`Using reference date: ${refDate.year}-${refDate.month}-${refDate.day}`);
    
    let hasFutureDates = false;
    let hasInvalidValues = false;
    let hasInvalidFormat = false;
    
    data.forEach(item => {
      // Check required fields
      if (!item.date || !('value' in item)) {
        console.error(`ERROR: Missing required fields in data point: ${JSON.stringify(item)}`);
        hasInvalidFormat = true;
        return;
      }
      
      // Check date format
      if (typeof item.date !== 'string' || !item.date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        console.error(`ERROR: Invalid date format: ${item.date}`);
        hasInvalidFormat = true;
        return;
      }
      
      // Check dates
      const dateParts = item.date.split('T')[0].split('-');
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      
      if (year > refDate.year || (year === refDate.year && month > refDate.month)) {
        console.error(`ERROR: Future date found: ${item.date}, value: ${item.value}`);
        hasFutureDates = true;
      }
      
      // Check values in expected range for MOVE index (typically 40-280)
      if (item.value < 30 || item.value > 300) {
        console.error(`ERROR: MOVE value out of expected range: ${item.value} for date ${item.date}`);
        hasInvalidValues = true;
      }
    });
    
    // Check order (should be chronological)
    for (let i = 1; i < data.length; i++) {
      const prevDate = new Date(data[i-1].date);
      const currDate = new Date(data[i].date);
      
      if (prevDate > currDate) {
        console.error(`ERROR: Data not in chronological order at index ${i}: ${data[i-1].date} > ${data[i].date}`);
        hasInvalidFormat = true;
      }
    }
    
    if (hasFutureDates) {
      console.error('ERROR: Future dates found in MOVE data');
    }
    
    if (hasInvalidValues) {
      console.error('ERROR: Invalid values found in MOVE data');
    }
    
    if (hasInvalidFormat) {
      console.error('ERROR: Format issues found in MOVE data');
    }
    
    return !hasFutureDates && !hasInvalidValues && !hasInvalidFormat;
  } catch (error) {
    console.error('ERROR: Failed to parse MOVE data:', error);
    return false;
  }
}

async function validateSRFData() {
  console.log('Validating SRF data...');
  
  const filePath = path.join(__dirname, '..', 'public', 'series', 'srf.json');
  if (!fs.existsSync(filePath)) {
    console.error('ERROR: SRF data file not found');
    return false;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Found ${data.length} SRF data points`);
    
    // Get reference date from reliable source
    const refDate = await dateUtils.getReferenceDateParts();
    
    let hasFutureDates = false;
    let hasInvalidValues = false;
    let hasInvalidFormat = false;
    
    data.forEach(item => {
      // Check required fields
      if (!item.date || !('value' in item)) {
        console.error(`ERROR: Missing required fields in SRF data point: ${JSON.stringify(item)}`);
        hasInvalidFormat = true;
        return;
      }
      
      // Check date format
      if (typeof item.date !== 'string' || !item.date.match(/^\d{4}-\d{2}-\d{2}/)) {
        console.error(`ERROR: Invalid date format in SRF data: ${item.date}`);
        hasInvalidFormat = true;
        return;
      }
      
      // Check dates
      const dateParts = item.date.split('T')[0].split('-');
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      
      if (year > refDate.year || (year === refDate.year && month > refDate.month)) {
        console.error(`ERROR: Future date found in SRF data: ${item.date}, value: ${item.value}`);
        hasFutureDates = true;
      }
      
      // Check values (SRF values should be >= 0)
      if (item.value < 0) {
        console.error(`ERROR: Invalid SRF value: ${item.value} for date ${item.date}`);
        hasInvalidValues = true;
      }
    });
    
    return !hasFutureDates && !hasInvalidValues && !hasInvalidFormat;
  } catch (error) {
    console.error('ERROR: Failed to parse SRF data:', error);
    return false;
  }
}

function validateTreasuryFundingData() {
  console.log('Validating Treasury funding data...');
  
  const filePath = path.join(__dirname, '..', 'public', 'series', 'bill-share.json');
  if (!fs.existsSync(filePath)) {
    console.error('ERROR: Treasury funding data file not found');
    return false;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Found ${data.length} Treasury funding data points`);
    
    // Bill share should be between 0 and 100 (percentage)
    let hasInvalidValues = false;
    
    data.forEach(item => {
      if (item.value < 0 || item.value > 100) {
        console.error(`ERROR: Invalid bill share value: ${item.value} for date ${item.date}`);
        hasInvalidValues = true;
      }
    });
    
    return !hasInvalidValues;
  } catch (error) {
    console.error('ERROR: Failed to parse Treasury funding data:', error);
    return false;
  }
}

async function validateAllData() {
  let isValid = true;
  
  if (!await validateMoveData()) {
    isValid = false;
    console.error('MOVE index data validation failed');
  } else {
    console.log('MOVE index data validation passed ✓');
  }
  
  if (!await validateSRFData()) {
    isValid = false;
    console.error('SRF data validation failed');
  } else {
    console.log('SRF data validation passed ✓');
  }
  
  if (!validateTreasuryFundingData()) {
    isValid = false;
    console.error('Treasury funding data validation failed');
  } else {
    console.log('Treasury funding data validation passed ✓');
  }
  
  return isValid;
}

// If run directly
if (require.main === module) {
  console.log('Running data validation...');
  
  validateAllData().then(isValid => {
    if (isValid) {
      console.log('All data validation passed ✓');
      process.exit(0);
    } else {
      console.error('Data validation failed ✗');
      process.exit(1);
    }
  }).catch(error => {
    console.error('Validation error:', error);
    process.exit(1);
  });
}

module.exports = { validateAllData, validateMoveData, validateSRFData, validateTreasuryFundingData }; 