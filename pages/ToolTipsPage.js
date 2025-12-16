// @ts-check
const { expect } = require('@playwright/test');

class ToolTipsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.toolTipButton = page.locator('#toolTipButton');
    this.toolTipTextField = page.locator('#toolTipTextField');
    this.contraryLink = page.getByText('Contrary');
    this.sectionLink = page.getByText('1.10.32');
  }

  async navigate() {
    await this.page.goto('https://demoqa.com/tool-tips');
  }

  async hoverButton() {
    await this.toolTipButton.hover();
  }

  async hoverTextField() {
    await this.toolTipTextField.hover();
  }

  async hoverContraryLink() {
    await this.contraryLink.hover();
  }

  async hoverSectionLink() {
    await this.sectionLink.hover();
  }

  async getToolTipText() {
    await this.page.waitForTimeout(1000);

    const tooltipSelectors = [
      '.tooltip-inner',
      '[role="tooltip"]',
      '.tooltip',
      '.tooltip.show .tooltip-inner'
    ];

    for (const selector of tooltipSelectors) {
      try {
        const tooltip = this.page.locator(selector);
        await expect(tooltip).toBeVisible({ timeout: 2000 });
        return await tooltip.textContent();
      } catch (e) {
        continue;
      }
    }

    const anyTooltip = this.page.locator('[class*="tooltip"]').or(this.page.locator('[role="tooltip"]'));
    await expect(anyTooltip).toBeVisible({ timeout: 2000 });
    return await anyTooltip.textContent();
  }
}

module.exports = { ToolTipsPage };

