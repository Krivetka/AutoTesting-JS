class SelectMenuPage {
  constructor(page) {
    this.page = page;
    this.selectValueDropdown = page.locator('#withOptGroup');
    this.selectOneDropdown = page.locator('#selectOne');
    this.oldStyleSelectMenu = page.locator('#oldSelectMenu');
  }

  async navigate() {
    await this.page.goto('https://demoqa.com/select-menu', {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });
  }

  async selectValue(optionText) {
    await this.selectValueDropdown.click();
    await this.page.getByText(optionText, { exact: true }).click();
  }

  async selectOne(optionText) {
    await this.selectOneDropdown.click();
    await this.page.getByText(optionText, { exact: true }).click();
  }

  async selectOldStyle(optionText) {
    await this.oldStyleSelectMenu.selectOption({ label: optionText });
  }

  async selectMulti(options) {
    const label = this.page.getByText('Multiselect drop down');
    const container = label.locator('xpath=following::*[contains(@class, "css-")]').first();
    await container.click();

    for (const option of options) {
      await this.page.locator('.css-26l3qy-menu').getByText(option, { exact: true }).click();
    }

    await this.page.keyboard.press('Escape');
  }
}

module.exports = { SelectMenuPage };
