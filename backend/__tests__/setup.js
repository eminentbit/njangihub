// Test setup file - runs before all tests
import { config } from 'dotenv';

// Load environment variables for tests
config();

// Mock Redis clients to avoid connection attempts during tests
jest.mock('../redisClient.js', () => ({
  createRedisClient: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    quit: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  })),
  createSessionRedisClient: jest.fn(async () => ({
    on: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    quit: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })),
}));

// Mock BullMQ queues
jest.mock('../bullMQ/queues/emailQueue.js', () => ({
  default: {
    add: jest.fn(),
    close: jest.fn(),
  },
}));

jest.mock('../bullMQ/queues/dbQueue.js', () => ({
  default: {
    add: jest.fn(),
    close: jest.fn(),
  },
}));

// Suppress console output during tests (optional)
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
