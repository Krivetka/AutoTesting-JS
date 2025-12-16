// @ts-check
const { test, expect } = require('@playwright/test');
const { ToolTipsPage } = require('../pages/ToolTipsPage');

test.describe('Tool Tips Tests', () => {
  let toolTipsPage;

  test.beforeEach(async ({ page }) => {
    toolTipsPage = new ToolTipsPage(page);
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        await toolTipsPage.navigate();
        break; 
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error; 
        }
        console.log(`Navigation attempt ${attempts} failed, retrying...`);
        await page.waitForTimeout(2000); 
      }
    }
  });

  test('Should display correct tooltip for Button', async () => {
    await toolTipsPage.hoverButton();
    const text = await toolTipsPage.getToolTipText();
    expect(text).toBe('You hovered over the Button');
  });

  test('Should display correct tooltip for Text Field', async () => {
    await toolTipsPage.hoverTextField();
    const text = await toolTipsPage.getToolTipText();
    expect(text).toBe('You hovered over the text field');
  });

  test('Should display correct tooltip for Contrary link', async () => {
    await toolTipsPage.hoverContraryLink();
    const text = await toolTipsPage.getToolTipText();
    expect(text).toBe('You hovered over the Contrary');
  });

  test('Should display correct tooltip for Section link', async () => {
    await toolTipsPage.hoverSectionLink();
    const text = await toolTipsPage.getToolTipText();
    expect(text).toBe('You hovered over the 1.10.32');
  });
});



