const { test, expect } = require('@playwright/test');
const { SelectMenuPage } = require('../pages/SelectMenuPage');
const { navigateWithRetry } = require('../utils/testHelpers');

test.describe('Select Menu Tests', () => {
  let selectMenuPage;

  test.beforeEach(async ({ page }) => {
    selectMenuPage = new SelectMenuPage(page);
    await navigateWithRetry(page, () => selectMenuPage.navigate(), selectMenuPage.selectValueDropdown);
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
