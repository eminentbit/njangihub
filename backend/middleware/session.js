import session from "express-session";
import connectRedis from "connect-redis";
import { createRedisClient } from "../redisClient.js";

const RedisStore = connectRedis(session);

// Use ioredis for sessions (connect-redis v6 requires ioredis, not node-redis v4)
const redisClient = createRedisClient();

const sessionMiddleware = session({
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

export default sessionMiddleware;
