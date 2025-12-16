// @ts-check

class TextBoxPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.userNameInput = page.locator('#userName');
    this.userEmailInput = page.locator('#userEmail');
    this.currentAddressInput = page.locator('#currentAddress');
    this.permanentAddressInput = page.locator('#permanentAddress');
    this.submitButton = page.locator('#submit');
    this.outputArea = page.locator('#output');
  }

  async navigate() {
    await this.page.goto('https://demoqa.com/text-box');
  }

  async fillForm(fullName, email, currentAddress, permanentAddress) {
    await this.userNameInput.fill(fullName);
    await this.userEmailInput.fill(email);
    await this.currentAddressInput.fill(currentAddress);
    await this.permanentAddressInput.fill(permanentAddress);
  }

  async submit() {
    await this.submitButton.click();
  }

  async getOutput() {
    return this.outputArea;
  }
}

module.exports = { TextBoxPage };

