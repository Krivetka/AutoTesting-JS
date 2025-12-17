const { test, expect } = require('@playwright/test');
const { TextBoxPage } = require('../pages/TextBoxPage');
const { navigateWithRetry } = require('../utils/testHelpers');

test.describe('Text Box Tests', () => {
  let textBoxPage;

  test.beforeEach(async ({ page }) => {
    textBoxPage = new TextBoxPage(page);
    await navigateWithRetry(page, () => textBoxPage.navigate(), textBoxPage.userNameInput);
  });

  test('Should submit form with valid random data', async () => {
    const randomId = Math.random().toString(36).substring(7);
    const fullName = `User ${randomId}`;
    const email = `user${randomId}@example.com`;
    const currentAddress = `Current Address ${randomId}`;
    const permanentAddress = `Permanent Address ${randomId}`;

    await textBoxPage.fillForm(fullName, email, currentAddress, permanentAddress);
    await textBoxPage.submit();

    const output = await textBoxPage.getOutput();
    await expect(output).toBeVisible();
    await expect(output).toContainText(`Name:${fullName}`);
    await expect(output).toContainText(`Email:${email}`);
    await expect(output).toContainText(`Current Address :${currentAddress}`);
    await expect(output).toContainText(`Permananet Address :${permanentAddress}`);
  });

  test('Should fail validation with invalid email', async ({ page }) => {
    const fullName = 'Test User';
    const invalidEmail = 'invalid-email-format';
    
    await textBoxPage.fillForm(fullName, invalidEmail, 'Address 1', 'Address 2');
    await textBoxPage.submit();
    await expect(textBoxPage.userEmailInput).toHaveClass(/field-error/);
    const output = await textBoxPage.getOutput();
  });

  test('Should fail to submit with empty mandatory fields', async ({ page }) => {
    await textBoxPage.submit();
    const output = await textBoxPage.getOutput();
    const outputText = await output.textContent();
    expect(outputText).toBe('');
  });
});
