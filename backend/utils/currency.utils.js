/**
 * Currency utilities for handling multi-currency operations
 */

// Currency symbols
export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  XAF: "FCFA",
  KES: "KSh",
  GHS: "₵",
  NGN: "₦",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  JPY: "¥",
  SGD: "S$",
  NZD: "NZ$",
  INR: "₹",
  BRL: "R$",
  MXN: "$",
};

// Currency names
export const CURRENCY_NAMES = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  XAF: "Central African CFA Franc",
  KES: "Kenyan Shilling",
  GHS: "Ghanaian Cedi",
  NGN: "Nigerian Naira",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  CHF: "Swiss Franc",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  DKK: "Danish Krone",
  JPY: "Japanese Yen",
  SGD: "Singapore Dollar",
  NZD: "New Zealand Dollar",
  INR: "Indian Rupee",
  BRL: "Brazilian Real",
  MXN: "Mexican Peso",
};

// Currencies that don't use decimal places
const ZERO_DECIMAL_CURRENCIES = ["JPY", "KRW", "VND", "CLP"];

/**
 * Format amount for display with currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - ISO 4217 currency code
 * @returns {string} Formatted amount
 */
export function formatCurrency(amount, currency = "USD") {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const decimals = ZERO_DECIMAL_CURRENCIES.includes(currency) ? 0 : 2;
  
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  // For FCFA and some others, symbol goes after
  if (currency === "XAF") {
    return `${formattedAmount} ${symbol}`;
  }

  return `${symbol}${formattedAmount}`;
}

/**
 * Convert amount to smallest currency unit (cents, kobo, etc.)
 * Stripe and many payment processors require amounts in smallest unit
 * @param {number} amount - The amount in main currency unit
 * @param {string} currency - ISO 4217 currency code
 * @returns {number} Amount in smallest unit
 */
export function toSmallestUnit(amount, currency = "USD") {
  if (ZERO_DECIMAL_CURRENCIES.includes(currency)) {
    return Math.round(amount);
  }
  return Math.round(amount * 100);
}

/**
 * Convert amount from smallest currency unit to main unit
 * @param {number} amount - The amount in smallest unit
 * @param {string} currency - ISO 4217 currency code
 * @returns {number} Amount in main currency unit
 */
export function fromSmallestUnit(amount, currency = "USD") {
  if (ZERO_DECIMAL_CURRENCIES.includes(currency)) {
    return amount;
  }
  return amount / 100;
}

/**
 * Validate currency code
 * @param {string} currency - ISO 4217 currency code
 * @returns {boolean} True if valid
 */
export function isValidCurrency(currency) {
  return Boolean(currency) && Object.prototype.hasOwnProperty.call(CURRENCY_SYMBOLS, currency);
}

/**
 * Get currency details
 * @param {string} currency - ISO 4217 currency code
 * @returns {Object} Currency details
 */
export function getCurrencyDetails(currency) {
  return {
    code: currency,
    symbol: CURRENCY_SYMBOLS[currency] || currency,
    name: CURRENCY_NAMES[currency] || currency,
    hasDecimals: !ZERO_DECIMAL_CURRENCIES.includes(currency),
  };
}

/**
 * Simple currency conversion (for display purposes)
 * In production, use a real-time exchange rate API
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency) {
  // Simplified exchange rates (relative to USD)
  // In production, fetch real-time rates from an API
  const rates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    XAF: 620.0,
    KES: 129.0,
    GHS: 12.5,
    NGN: 775.0,
    CAD: 1.35,
    AUD: 1.53,
    CHF: 0.88,
    SEK: 10.5,
    NOK: 10.8,
    DKK: 6.9,
    JPY: 149.0,
    SGD: 1.34,
    NZD: 1.63,
    INR: 83.0,
    BRL: 4.95,
    MXN: 17.2,
  };

  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;

  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

export default {
  formatCurrency,
  toSmallestUnit,
  fromSmallestUnit,
  isValidCurrency,
  getCurrencyDetails,
  convertCurrency,
  CURRENCY_SYMBOLS,
  CURRENCY_NAMES,
};
