// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// Parse viewport from environment variables or use undefined to let project defaults/device descriptors handle it
const viewport = process.env.VIEWPORT_WIDTH && process.env.VIEWPORT_HEIGHT
  ? { width: parseInt(process.env.VIEWPORT_WIDTH, 10), height: parseInt(process.env.VIEWPORT_HEIGHT, 10) }
  : undefined;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60000, 
  expect: {
    timeout: 10000, 
  },
  workers: 2, 
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },
  grep: process.env.runThis ? new RegExp(process.env.runThis, 'i') : undefined,
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        ...(viewport && { viewport }) 
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        ...(viewport && { viewport }) 
      },
    },
  ],
});
