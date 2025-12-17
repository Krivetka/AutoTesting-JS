class ToolTipsPage {
  constructor(page) {
    this.page = page;
    this.toolTipButton = page.locator('#toolTipButton');
    this.toolTipTextField = page.locator('#toolTipTextField');
    this.contraryLink = page.getByRole('link', { name: 'Contrary', exact: true });
    this.sectionLink = page.getByRole('link', { name: '1.10.32', exact: true });
    this.lastHoveredElement = null;
  }

  async navigate() {
    await this.page.goto('https://demoqa.com/tool-tips', {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });
  }

  async hoverButton() {
    await this.toolTipButton.scrollIntoViewIfNeeded();
    await this.toolTipButton.hover();
    this.lastHoveredElement = this.toolTipButton;
  }

  async hoverTextField() {
    await this.toolTipTextField.scrollIntoViewIfNeeded();
    await this.toolTipTextField.hover();
    await this.toolTipTextField.focus();
    this.lastHoveredElement = this.toolTipTextField;
  }

  async hoverContraryLink() {
    await this.contraryLink.scrollIntoViewIfNeeded();
    await this.contraryLink.hover();
    this.lastHoveredElement = this.contraryLink;
  }

  async hoverSectionLink() {
    await this.sectionLink.scrollIntoViewIfNeeded();
    await this.sectionLink.hover();
    this.lastHoveredElement = this.sectionLink;
  }

  async getToolTipText() {
    await this.page.waitForTimeout(700);

    const tooltipText = await this.getTooltipViaDescribedBy();
    if (tooltipText) {
      return tooltipText;
    }

    const fallbackTooltip = this.page.locator('.tooltip-inner');
    try {
      await fallbackTooltip.waitFor({ state: 'visible', timeout: 2000 });
      return await fallbackTooltip.textContent();
    } catch (e) {
      // Ignore and throw specific error below
    }

    throw new Error('Tooltip not found with any selector');
  }

  async getTooltipViaDescribedBy() {
    if (!this.lastHoveredElement) {
      return null;
    }

    let tooltipId = null;
    for (let i = 0; i < 5; i++) {
      tooltipId = await this.lastHoveredElement.getAttribute('aria-describedby');
      if (tooltipId) break;
      await this.page.waitForTimeout(200);
    }

    if (!tooltipId) {
      return null;
    }

    const tooltip = this.page.locator(`#${tooltipId} .tooltip-inner, #${tooltipId}`);
    try {
      await tooltip.first().waitFor({ state: 'visible', timeout: 3000 });
      const text = await tooltip.first().textContent();
      return text && text.trim() ? text.trim() : null;
    } catch (e) {
      return null;
    }
  }
}

module.exports = { ToolTipsPage };
