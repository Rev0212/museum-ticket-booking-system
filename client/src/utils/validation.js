/**
 * Credit card validation utilities
 */

/**
 * Validates a credit card number using Luhn algorithm
 * @param {string} cardNumber - The credit card number to validate
 * @returns {boolean} - Whether the card number is valid
 */
export const validateCardNumber = (cardNumber) => {
  // Remove any non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  // Check if length is valid (most cards are between 13-19 digits)
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }
  
  // Luhn algorithm (mod 10 check)
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Validates a credit card expiry date
 * @param {string} expiryDate - The expiry date in MM/YY format
 * @returns {boolean} - Whether the expiry date is valid and not expired
 */
export const validateExpiryDate = (expiryDate) => {
  // Check format (MM/YY)
  if (!/^\d{1,2}\/\d{2}$/.test(expiryDate)) {
    return false;
  }
  
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  
  // Get current month and year
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear() % 100; // Get last two digits of year
  
  // Parse input month and year as integers
  const expiryMonth = parseInt(month, 10);
  const expiryYear = parseInt(year, 10);
  
  // Validate month
  if (expiryMonth < 1 || expiryMonth > 12) {
    return false;
  }
  
  // Check if card is expired
  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    return false;
  }
  
  return true;
};

/**
 * Validates a UPI ID
 * @param {string} upiId - The UPI ID to validate
 * @returns {boolean} - Whether the UPI ID is valid
 */
export const validateUpiId = (upiId) => {
  // Basic UPI format: username@provider
  return /^[\w.-]+@[\w]+$/.test(upiId);
};

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email address is valid
 */
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates a phone number (10 digits)
 * @param {string} phone - The phone number to validate 
 * @returns {boolean} - Whether the phone number is valid
 */
export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''));
};

/**
 * Checks if a value is a valid date
 * @param {any} date - The value to check
 * @returns {boolean} - Whether the value is a valid date
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  // If it's already a Date object
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }
  
  // If it's a string or number, try to create a Date object
  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * Safely formats a date with a fallback value if the date is invalid
 * @param {any} date - The date to format
 * @param {string} format - The format string
 * @param {Date} fallback - Fallback date if the input is invalid
 * @returns {Date} - The valid date object
 */
export const ensureValidDate = (date, fallback = new Date()) => {
  if (isValidDate(date)) {
    return date instanceof Date ? date : new Date(date);
  }
  return fallback;
};

/**
 * Converts a string date to a Date object with validation
 * @param {string} dateString - The date string to parse
 * @returns {Date|null} - The parsed Date object or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
};