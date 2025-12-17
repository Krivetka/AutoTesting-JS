/**
 * Navigates to a page and waits for a specific element to be visible, with retry logic.
 * 
 * @param {import('@playwright/test').Page} page - The Playwright Page object.
 * @param {Function} gotoFn - An async function that performs the navigation (e.g., () => page.goto(...)).
 * @param {string|import('@playwright/test').Locator} readySelector - A selector string or Locator to wait for to confirm page load.
 * @param {Object} options - Optional configuration.
 * @param {number} [options.maxAttempts=3] - Maximum number of retry attempts.
 * @param {number} [options.timeout=2000] - Timeout between retries in milliseconds.
 */
async function navigateWithRetry(page, gotoFn, readySelector = null, options = {}) {
  const { maxAttempts = 3, timeout = 2000 } = options;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      await gotoFn();
      
      if (readySelector) {
        if (typeof readySelector === 'string') {
          await page.waitForSelector(readySelector, { state: 'visible' });
        } else {
          await readySelector.waitFor({ state: 'visible' });
        }
      } else {
        await page.waitForLoadState('domcontentloaded');
      }
      
      break;
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      await page.waitForTimeout(timeout);
    }
  }
}

module.exports = { navigateWithRetry };

