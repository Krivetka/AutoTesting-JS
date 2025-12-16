const { test, expect } = require('@playwright/test');
const { SelectMenuPage } = require('../pages/SelectMenuPage');

test.describe('Select Menu Tests', () => {
  let selectMenuPage;

  test.beforeEach(async ({ page }) => {
    selectMenuPage = new SelectMenuPage(page);
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        await selectMenuPage.navigate();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);
        break;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  });

  test('Should handle all select menus correctly', async () => {
    await selectMenuPage.selectValue('Group 2, option 1');
    await expect(selectMenuPage.selectValueDropdown).toContainText('Group 2, option 1');

    await selectMenuPage.selectOne('Other');
    await expect(selectMenuPage.selectOneDropdown).toContainText('Other');

    await selectMenuPage.selectOldStyle('Green');
    const selectedText = await selectMenuPage.oldStyleSelectMenu.evaluate(sel => sel.options[sel.selectedIndex].text);
    expect(selectedText).toBe('Green');

    await selectMenuPage.selectMulti(['Black', 'Blue']);
  });
});
