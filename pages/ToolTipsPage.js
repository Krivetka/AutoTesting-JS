class ToolTipsPage {
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
    await this.toolTipTextField.focus();
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
      '.fade.show.tooltip .tooltip-inner',
      '.tooltip.fade.show .tooltip-inner',
      'div.tooltip .tooltip-inner',
      '[data-bs-original-title]',
      '[aria-label]',
      '[title]',
      '.tooltip-text',
      '.tooltip-content',
      '.bs-tooltip-auto',
      '.bs-tooltip-top',
      '.bs-tooltip-bottom',
      '.bs-tooltip-left',
      '.bs-tooltip-right',
      '[data-tooltip]',
      '.hover-tooltip',
      '.tooltip.show',
      '.tooltip.fade.show'
    ];

    for (const selector of tooltipSelectors) {
      try {
        const tooltips = this.page.locator(selector);
        const count = await tooltips.count();

        for (let i = 0; i < count; i++) {
          const tooltip = tooltips.nth(i);
          if (await tooltip.isVisible({ timeout: 1000 })) {
            const text = await tooltip.textContent();
            if (text && text.trim() && (text.includes('You hovered') || text.includes('hover') || text.includes('hovered'))) {
              return text.trim();
            }
          }
        }
      } catch (e) {
        continue;
      }
    }

    try {
      const elementsWithAriaDescribedBy = this.page.locator('[aria-describedby]');
      const count = await elementsWithAriaDescribedBy.count();

      for (let i = 0; i < count; i++) {
        const element = elementsWithAriaDescribedBy.nth(i);
        const ariaDescribedBy = await element.getAttribute('aria-describedby');
        if (ariaDescribedBy) {
          const tooltip = this.page.locator(`#${ariaDescribedBy}`);
          if (await tooltip.isVisible({ timeout: 500 })) {
            const text = await tooltip.textContent();
            if (text && text.trim()) {
              return text.trim();
            }
          }
        }
      }
    } catch (e) {}

    try {
      const allVisibleElements = this.page.locator('body *:visible');
      const elements = await allVisibleElements.all();

      for (const element of elements) {
        try {
          const text = await element.textContent();
          if (text && text.trim() && (text.includes('You hovered over') || text.includes('hover'))) {
            return text.trim();
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
    }

    try {
      const potentialTooltips = this.page.locator('[class*="tooltip"], [id*="tooltip"], [data-tooltip]');
      const count = await potentialTooltips.count();

      for (let i = 0; i < count; i++) {
        const tooltip = potentialTooltips.nth(i);
        if (await tooltip.isVisible({ timeout: 500 })) {
          const text = await tooltip.textContent() || await tooltip.getAttribute('data-tooltip') || await tooltip.getAttribute('title');
          if (text && text.trim()) {
            return text.trim();
          }
        }
      }
    } catch (e) {
    }

    throw new Error('Tooltip not found with any selector');
  }
}

module.exports = { ToolTipsPage };
