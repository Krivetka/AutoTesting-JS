/**
 * Waits for the UI to be fully loaded and stable.
 * This includes waiting for load states and optionally a specific element.
 * 
 * @param {import('@playwright/test').Page} page - The Playwright Page object.
 * @param {import('@playwright/test').Locator} [readyLocator] - Optional locator to wait for.
 */
async function waitForUILoad(page, readyLocator = null) {
  // Wait for basic DOM content
  await page.waitForLoadState('domcontentloaded');
  
  // Attempt to wait for network idle to ensure scripts/styles are loaded
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch (e) {
    // Continue if network idle times out (common with ads/analytics)
    console.log('Network idle wait timed out, proceeding with tests...');
  }

  // If a specific locator is provided, wait for it to be visible
  if (readyLocator) {
    await readyLocator.waitFor({ state: 'visible', timeout: 10000 });
  }
}

module.exports = { waitForUILoad };

