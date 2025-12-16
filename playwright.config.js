const { defineConfig, devices } = require('@playwright/test');

const viewport = process.env.VIEWPORT_WIDTH && process.env.VIEWPORT_HEIGHT
  ? { width: parseInt(process.env.VIEWPORT_WIDTH, 10), height: parseInt(process.env.VIEWPORT_HEIGHT, 10) }
  : undefined;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 200000,
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
