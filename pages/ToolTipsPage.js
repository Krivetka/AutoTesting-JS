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
    await this.page.goto('https://demoqa.com/tool-tips', {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });
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
    await this.page.waitForTimeout(2000);

    const tooltipSelectors = [
      '.tooltip-inner',
      '[role="tooltip"]',
      '.tooltip .tooltip-inner',
      '.tooltip.show .tooltip-inner',
      '.tooltip',
      '[data-bs-toggle="tooltip"]',
      '[aria-describedby]',
      '.fade.show.tooltip',
      '.tooltip.fade.show',
      'div.tooltip',
      'div[class*="tooltip"]',
      '[data-original-title]'
    ];

    for (const selector of tooltipSelectors) {
      try {
        const tooltip = this.page.locator(selector);
        if (await tooltip.count() > 0) {
          await expect(tooltip).toBeVisible({ timeout: 3000 });
          const text = await tooltip.textContent();
          if (text && text.trim()) {
            return text.trim();
          }
        }
      } catch (e) {
        continue;
      }
    }

    try {
      const allElements = this.page.locator('body *');
      const elements = await allElements.all();
      for (const element of elements) {
        try {
          const text = await element.textContent();
          const isVisible = await element.isVisible();
          if (isVisible && text && (text.includes('You hovered over') || text.includes('hover'))) {
            return text.trim();
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      // Ignore errors in fallback search
    }

    throw new Error('Tooltip not found with any selector');
  }
}

module.exports = { ToolTipsPage };

