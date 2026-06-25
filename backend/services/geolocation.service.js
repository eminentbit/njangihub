import axios from "axios";
import { createRedisClient } from "../redisClient.js";

const redis = createRedisClient();

// Currency mappings by country code
const COUNTRY_CURRENCY_MAP = {
  // Cameroon - FCFA
  CM: { currency: "XAF", paymentMethod: "mobile_money", provider: "campay" },

  // Major African countries with mobile money
  KE: { currency: "KES", paymentMethod: "mobile_money", provider: "mpesa" },
  GH: { currency: "GHS", paymentMethod: "mobile_money", provider: "mtn" },
  NG: { currency: "NGN", paymentMethod: "mobile_money", provider: "paystack" },

  // International - Credit Cards (Stripe)
  US: { currency: "USD", paymentMethod: "card", provider: "stripe" },
  GB: { currency: "GBP", paymentMethod: "card", provider: "stripe" },
  CA: { currency: "CAD", paymentMethod: "card", provider: "stripe" },
  AU: { currency: "AUD", paymentMethod: "card", provider: "stripe" },
  FR: { currency: "EUR", paymentMethod: "card", provider: "stripe" },
  DE: { currency: "EUR", paymentMethod: "card", provider: "stripe" },
  IT: { currency: "EUR", paymentMethod: "card", provider: "stripe" },
  ES: { currency: "EUR", paymentMethod: "card", provider: "stripe" },
  NL: { currency: "EUR", paymentMethod: "card", provider: "stripe" },
  BE: { currency: "EUR", paymentMethod: "card", provider: "stripe" },
  CH: { currency: "CHF", paymentMethod: "card", provider: "stripe" },
  SE: { currency: "SEK", paymentMethod: "card", provider: "stripe" },
  NO: { currency: "NOK", paymentMethod: "card", provider: "stripe" },
  DK: { currency: "DKK", paymentMethod: "card", provider: "stripe" },
  JP: { currency: "JPY", paymentMethod: "card", provider: "stripe" },
  SG: { currency: "SGD", paymentMethod: "card", provider: "stripe" },
  NZ: { currency: "NZD", paymentMethod: "card", provider: "stripe" },
  IN: { currency: "INR", paymentMethod: "card", provider: "stripe" },
  BR: { currency: "BRL", paymentMethod: "card", provider: "stripe" },
  MX: { currency: "MXN", paymentMethod: "card", provider: "stripe" },
};

// Default to international
const DEFAULT_CONFIG = {
  currency: "USD",
  paymentMethod: "card",
  provider: "stripe",
};

/**
 * Get user's location from IP address
 * @param {string} ipAddress - User's IP address
 * @returns {Promise<Object>} Location data with country, currency, payment method
 */
export async function getLocationFromIP(ipAddress) {
  // Skip localhost/private IPs
  if (
    !ipAddress ||
    ipAddress === "::1" ||
    ipAddress.startsWith("127.") ||
    ipAddress.startsWith("192.168.")
  ) {
    console.log("Local IP detected, using default config");
    return {
      country: "US",
      countryName: "United States",
      ...DEFAULT_CONFIG,
    };
  }

  // Check cache first (24 hour TTL)
  const cacheKey = `geolocation:${ipAddress}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`✅ Geolocation cache hit for ${ipAddress}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error("Redis cache read error:", err.message);
  }

  try {
    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`, {
      timeout: 5000,
      headers: {
        "User-Agent": "NjangiHub/1.0",
      },
    });

    const { country_code, country_name, error } = response.data;

    if (error) {
      console.warn(`ipapi.co error: ${error}`);
      return {
        country: "US",
        countryName: "United States",
        ...DEFAULT_CONFIG,
      };
    }

    const config = COUNTRY_CURRENCY_MAP[country_code] || DEFAULT_CONFIG;
    const result = {
      country: country_code,
      countryName: country_name,
      ...config,
    };

    // Cache for 24 hours
    try {
      await redis.set(cacheKey, JSON.stringify(result), "EX", 86400);
      console.log(`✅ Cached geolocation for ${ipAddress}`);
    } catch (err) {
      console.error("Redis cache write error:", err.message);
    }

    return result;
  } catch (error) {
    console.error("Geolocation API error:", error.message);

    // Fallback to default
    return {
      country: "US",
      countryName: "United States",
      ...DEFAULT_CONFIG,
    };
  }
}

/**
 * Get client IP from request
 * Handles proxies and various headers
 */
export function getClientIP(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return (
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip
  );
}

/**
 * Middleware to detect and attach location to request
 */
export async function locationDetectionMiddleware(req, res, next) {
  try {
    const ip = getClientIP(req);
    const location = await getLocationFromIP(ip);
    req.userLocation = location;
    console.log(
      `📍 Detected location: ${location.countryName} (${location.country}) - ${location.currency}`,
    );
    next();
  } catch (error) {
    console.error("Location detection middleware error:", error);
    // Attach default and continue
    req.userLocation = {
      country: "US",
      countryName: "United States",
      ...DEFAULT_CONFIG,
    };
    next();
  }
}

export default {
  getLocationFromIP,
  getClientIP,
  locationDetectionMiddleware,
};
