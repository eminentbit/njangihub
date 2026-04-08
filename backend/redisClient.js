// redisClient.js
import Redis from "ioredis";
import { createClient } from 'redis';
import { config } from "dotenv";
config();

/**
 * Creates an ioredis client for BullMQ (queues and workers)
 * BullMQ requires ioredis and doesn't support node-redis
 */
export const createRedisClient = () => {
  const client = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME || 'default',
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  client.on('connect', () => {
    console.log('✅ Redis (ioredis) connected successfully');
  });

  client.on('error', (err) => {
    console.error('❌ Redis (ioredis) connection error:', err.message);
  });

  return client;
};

/**
 * Creates a node-redis client for sessions and general caching
 * connect-redis requires node-redis v4
 */
export const createSessionRedisClient = async () => {
  const client = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  });

  client.on('error', (err) => {
    console.error('❌ Redis (node-redis) client error:', err.message);
  });

  client.on('connect', () => {
    console.log('✅ Redis (node-redis) connected successfully');
  });

  await client.connect();
  return client;
};



