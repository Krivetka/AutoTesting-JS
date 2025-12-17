async function waitForUILoad(page, readyLocator) {
  await page.waitForLoadState('load');
  
  try {
    await page.waitForLoadState('networkidle');
  } catch (e) {}

  if (readyLocator) {
    await readyLocator.waitFor({ state: 'visible' });
  }
}

module.exports = { waitForUILoad };
