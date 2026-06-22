import rateLimit from "express-rate-limit";

/**
 * Factory for building a rate limiter. Defaults match production behaviour
 * (1000 requests / minute) and can be overridden per call — handy for tests
 * and for tuning limits per environment.
 */
export const createLimiter = (options = {}) =>
  rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
    handler: (req, res) => {
      res.status(429).json({
        message: "Too many requests, please try again later.",
        success: false,
      });
    },
    ...options,
  });

const limiter = createLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(60 * 1000), 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || "1000", 10),
});

export default limiter;
