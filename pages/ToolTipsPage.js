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
    await this.toolTipButton.hover();
    this.lastHoveredElement = this.toolTipButton;
  }

  async hoverTextField() {
    await this.toolTipTextField.hover();
    await this.toolTipTextField.focus();
    this.lastHoveredElement = this.toolTipTextField;
  }

  async hoverContraryLink() {
    await this.contraryLink.hover();
    this.lastHoveredElement = this.contraryLink;
  }

  async hoverSectionLink() {
    await this.sectionLink.hover();
    this.lastHoveredElement = this.sectionLink;
  }

  async getToolTipText() {
    const tooltipText = await this.getTooltipViaDescribedBy();
    if (tooltipText) {
      return tooltipText;
    }

    throw new Error('Tooltip not found with any selector');
  }

  async getTooltipViaDescribedBy() {
    if (!this.lastHoveredElement) {
      return null;
    }

    // Poll aria-describedby so we don't rely on arbitrary timeouts; CI/headless can be slower
    let tooltipId = null;
    for (let i = 0; i < 10; i++) {
      tooltipId = await this.lastHoveredElement.getAttribute('aria-describedby');
      if (tooltipId) break;
      await this.page.waitForTimeout(500);
    }

    if (!tooltipId) {
      return null;
    }

    const tooltip = this.page.locator(`#${tooltipId} .tooltip-inner, #${tooltipId}`);
    await tooltip.first().waitFor({ state: 'visible', timeout: 5000 });
    const text = await tooltip.first().textContent();
    return text && text.trim() ? text.trim() : null;
  }
}

module.exports = { ToolTipsPage };
