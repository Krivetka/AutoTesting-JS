exports.AlertsPage = class AlertsPage {
  constructor(page) {
    this.page = page;
    this.alertButton = page.locator('#alertButton');
    this.timerAlertButton = page.locator('#timerAlertButton');
    this.confirmButton = page.locator('#confirmButton');
    this.confirmResult = page.locator('#confirmResult');
    this.promptButton = page.locator('#promtButton');
    this.promptResult = page.locator('#promptResult');
  }

  async navigate() {
    await this.page.goto('https://demoqa.com/alerts', {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });
  }

  async clickAlertButton() {
    await this.alertButton.click();
  }

  async clickTimerAlertButton() {
    await this.timerAlertButton.click();
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }

  async clickPromptButton() {
    await this.promptButton.click();
  }

  async getConfirmResult() {
    return this.confirmResult;
  }

  async getPromptResult() {
    return this.promptResult;
  }
};

