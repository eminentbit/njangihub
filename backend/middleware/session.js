import session from "express-session";
import connectRedis from "connect-redis";
import { createSessionRedisClient } from "../redisClient.js";

const RedisStore = connectRedis(session);

// Initialize Redis client asynchronously
let sessionMiddleware;
let redisClientPromise = createSessionRedisClient();

redisClientPromise.then((redisClient) => {
  sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    name: "njangi_session",
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // must have HTTPS in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  });
}).catch((err) => {
  console.error('Failed to initialize session Redis client:', err);
  process.exit(1);
});

// Export a middleware wrapper that waits for initialization
export default async (req, res, next) => {
  if (!sessionMiddleware) {
    await redisClientPromise;
  }
  return sessionMiddleware(req, res, next);
};
