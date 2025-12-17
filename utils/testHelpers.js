async function navigateWithRetry(page, gotoFn, readySelector = null, options = {}) {
  const { maxAttempts = 3, timeout = 2000 } = options;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      if (page.isClosed()) {
        throw new Error(`Page was closed before navigation attempt ${attempts + 1}`);
      }

      await gotoFn();

      if (readySelector) {
        if (typeof readySelector === 'string') {
          await page.waitForSelector(readySelector, { state: 'visible', timeout: 15000 });
        } else {
          await readySelector.waitFor({ state: 'visible', timeout: 15000 });
        }
      } else {
        await page.waitForLoadState('load');
      }

      break;
    } catch (error) {
      attempts++;
      console.warn(`[navigateWithRetry] Attempt ${attempts}/${maxAttempts} failed: ${error.message}`);

      if (attempts >= maxAttempts) {
        throw new Error(`Navigation failed after ${maxAttempts} attempts. Last error: ${error.message}`);
      }

      await page.waitForTimeout(timeout);
    }
  }
}

module.exports = { navigateWithRetry };

