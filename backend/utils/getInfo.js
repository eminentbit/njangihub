import axios from "axios";
import { UAParser } from "ua-parser-js";

/**
 * Fetch geo IP info once per session.
 * Stores result in req.session.geoInfo.
 * @param {Request} req - Express request object
 * @returns {Promise<Object|null>}
 */
export const getInfo = async (req) => {
  if (req.session?.geoInfo) {
    console.log("📦 Returning cached geo info from session");
    return req.session.geoInfo;
  }

  try {
    const res = await axios.get("https://ipapi.co/json", {
      timeout: 3000, // prevent hanging
    });

    req.session.geoInfo = res.data;
    console.log("🌍 Fetched geo info and saved to session");

    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch geo info:", err.message);

    // Fallback with only IP
    const fallback = {
      ip:
        req.headers["x-forwarded-for"] ||
        req.connection?.remoteAddress ||
        "unknown",
    };
    console.log("⚠️ Using fallback geo info:", fallback);

    return fallback;
  }
};

/**
 * Returns the browser name based on user agent.
 * @param {string} userAgent
 * @returns {string}
 */
export function getBrowserType(userAgent) {
  const parser = new UAParser(userAgent);
  return parser.getBrowser().name || "Unknown Browser";
}

/**
 * Returns the device OS name based on user agent.
 * @param {string} userAgent
 * @returns {string}
 */
export function getDeviceName(userAgent) {
  const parser = new UAParser(userAgent);
  return parser.getOS().name || "Unknown Device";
}
