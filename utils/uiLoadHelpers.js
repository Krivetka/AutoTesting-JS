async function waitForUILoad(page, readyLocator, options = {}) {
  const { maxRetries = 3, retryDelay = 1000, locatorTimeout = 15000 } = options;

  if (page.isClosed()) {
    throw new Error('Page is already closed');
  }

  await page.waitForLoadState('load');

  try {
    await page.waitForLoadState('networkidle');
  } catch (e) {}

  if (readyLocator) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (page.isClosed()) {
          throw new Error(`Page was closed during locator wait (attempt ${attempt}/${maxRetries})`);
        }

        await readyLocator.waitFor({
          state: 'visible',
          timeout: locatorTimeout
        });
        return;
      } catch (error) {
        lastError = error;
        console.warn(`[waitForUILoad] Attempt ${attempt}/${maxRetries} failed: ${error.message}`);

        if (attempt < maxRetries) {
          console.log(`[waitForUILoad] Retrying in ${retryDelay}ms...`);
          await page.waitForTimeout(retryDelay);
        }
      }
    }

    throw new Error(`Failed to wait for locator after ${maxRetries} attempts. Last error: ${lastError.message}`);
  }
}

module.exports = { waitForUILoad };
