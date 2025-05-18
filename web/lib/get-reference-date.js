/**
 * Reference Date Utility
 * Gets the current date from multiple reliable sources
 * to ensure accurate date validation regardless of system clock
 */
const axios = require('axios');

/**
 * Gets the current date from multiple reliable sources
 * @returns {Promise<Date>} A Promise resolving to the current date
 */
async function getCurrentDate() {
  try {
    // Try to get time from WorldTimeAPI
    const response = await axios.get('http://worldtimeapi.org/api/timezone/Etc/UTC');
    if (response.data && response.data.datetime) {
      console.log('Using WorldTimeAPI date:', response.data.datetime);
      return new Date(response.data.datetime);
    }
  } catch (error) {
    console.log('WorldTimeAPI failed, trying alternative source');
  }

  try {
    // Fallback to another API
    const response = await axios.get('https://timeapi.io/api/Time/current/zone?timeZone=UTC');
    if (response.data && response.data.dateTime) {
      console.log('Using TimeAPI date:', response.data.dateTime);
      return new Date(response.data.dateTime);
    }
  } catch (error) {
    console.log('TimeAPI failed, falling back to config date');
  }
  
  // If all APIs fail, use the reference date from config
  return getReferenceDate();
}

/**
 * Gets the reference date from configuration
 * This is used as a fallback when external APIs fail
 * @returns {Date} The reference date
 */
function getReferenceDate() {
  // This is our reference date if we can't get real-time data
  // Current as of May 2025
  return new Date(2025, 4, 18); // Month is 0-indexed (0-11)
}

/**
 * Gets the reference year and month for validation
 * @returns {Object} Object with year and month properties
 */
async function getReferenceDateParts() {
  const date = await getCurrentDate();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // Convert to 1-indexed month (1-12)
    day: date.getDate()
  };
}

module.exports = {
  getCurrentDate,
  getReferenceDate,
  getReferenceDateParts
}; 