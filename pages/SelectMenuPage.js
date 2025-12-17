class SelectMenuPage {
  constructor(page) {
    this.page = page;
    this.selectValueDropdown = page.locator('#withOptGroup');
    this.selectOneDropdown = page.locator('#selectOne');
    this.oldStyleSelectMenu = page.locator('#oldSelectMenu');
    this.multiselectLabel = page.getByText('Multiselect drop down');
    this.multiselectContainer = this.multiselectLabel.locator('xpath=following::div[contains(@class, "-container")]').first();
    this.multiSelectMenu = page.locator('[class*="-menu"]');
  }

  async navigate() {
    await this.page.goto('https://demoqa.com/select-menu', {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });
  }

  async selectValue(optionText) {
    await this.selectValueDropdown.click();
    const option = this.page.getByText(optionText, { exact: true });
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async selectOne(optionText) {
    await this.selectOneDropdown.click();
    await this.page.getByText(optionText, { exact: true }).click();
  }

  async selectOldStyle(optionText) {
    await this.oldStyleSelectMenu.selectOption({ label: optionText });
  }

  async selectMulti(options) {
    await this.multiselectContainer.click();

    for (const option of options) {
      await this.multiSelectMenu.locator('[class*="-option"]').getByText(option, { exact: true }).click();
    }

    await this.page.keyboard.press('Escape');
  }
}

module.exports = { SelectMenuPage };
