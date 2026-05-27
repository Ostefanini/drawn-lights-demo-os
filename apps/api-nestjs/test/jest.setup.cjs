// Global configuration for integration tests
// Loads test environment variables

const { config } = require('dotenv');
const { resolve } = require('path');

// Set NODE_ENV to test to prevent ConfigModule from loading .env again
process.env.NODE_ENV = 'test';

// Load .env.test from workspace root (2 levels up from api-nestjs)
const envPath = resolve(process.cwd(), '../../.env.test');
config({ path: envPath, quiet: true });

// If .env.test doesn't exist, load default .env from workspace root
if (!process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
  config({ path: resolve(process.cwd(), '../../.env'), quiet: true });
}

// Ensure a database URL is defined
if (!process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
  console.warn(
    '⚠️  Warning: Neither TEST_DATABASE_URL nor DATABASE_URL is set. Tests may fail.',
  );
}
