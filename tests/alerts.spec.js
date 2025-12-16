// @ts-check
const { test, expect } = require('@playwright/test');
const { AlertsPage } = require('../pages/AlertsPage');

test.describe('Alerts Page Tests', () => {
  let alertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new AlertsPage(page);
    // Retry navigation up to 3 times in case of timeout
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        await alertsPage.navigate();
        break; // Success, exit loop
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error; // Re-throw if all attempts failed
        }
        console.log(`Navigation attempt ${attempts} failed, retrying...`);
        await page.waitForTimeout(2000); // Wait 2 seconds before retry
      }
    }
  });

  test('Should handle basic alert', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('You clicked a button');
      await dialog.accept();
    });

    await alertsPage.clickAlertButton();
  });

  test('Should handle timer alert (5 seconds)', async ({ page }) => {
    const dialogPromise = page.waitForEvent('dialog');
    await alertsPage.clickTimerAlertButton();
    const dialog = await dialogPromise;
    
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('This alert appeared after 5 seconds');
    await dialog.accept();
  });

  test('Should handle confirm alert - Accept', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Do you confirm action?');
      await dialog.accept();
    });

    await alertsPage.clickConfirmButton();
    await expect(await alertsPage.getConfirmResult()).toHaveText('You selected Ok');
  });

  test('Should handle confirm alert - Dismiss', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Do you confirm action?');
      await dialog.dismiss();
    });

    await alertsPage.clickConfirmButton();
    await expect(await alertsPage.getConfirmResult()).toHaveText('You selected Cancel');
  });

  test('Should handle prompt alert', async ({ page }) => {
    const testName = 'Test User';
    
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('Please enter your name');
      await dialog.accept(testName);
    });

    await alertsPage.clickPromptButton();
    await expect(await alertsPage.getPromptResult()).toHaveText(`You entered ${testName}`);
  });
});
