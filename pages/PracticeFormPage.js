class PracticeFormPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.genderMaleLabel = page.locator('label[for="gender-radio-1"]');
    this.genderFemaleLabel = page.locator('label[for="gender-radio-2"]');
    this.genderOtherLabel = page.locator('label[for="gender-radio-3"]');
    this.mobileInput = page.locator('#userNumber');
    this.dobInput = page.locator('#dateOfBirthInput');
    this.subjectsInput = page.locator('#subjectsInput');
    this.subjectOption = page.locator('.subjects-auto-complete__option');
    this.hobbiesSportsLabel = page.locator('label[for="hobbies-checkbox-1"]');
    this.hobbiesReadingLabel = page.locator('label[for="hobbies-checkbox-2"]');
    this.hobbiesMusicLabel = page.locator('label[for="hobbies-checkbox-3"]');
    this.currentAddressInput = page.locator('#currentAddress');
    this.stateDropdown = page.locator('#state');
    this.cityDropdown = page.locator('#city');
    this.submitButton = page.locator('#submit');
    this.successModal = page.locator('.modal-content');
    this.modalTitle = page.locator('#example-modal-sizes-title-lg');
    this.modalCloseButton = page.locator('.modal-content .close');
    this.genericCloseButton = page.locator('.modal-content .close, #closeLargeModal');
    this.dropdownOption = page.locator('div[id^="react-select"][class*="-option"]');
  }

  async navigate() {
    await this.page.goto('https://demoqa.com/automation-practice-form', {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });
    await this.removeOverlays();
  }

  async fillPersonalDetails(firstName, lastName, email, mobile) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.mobileInput.fill(mobile);
  }

  async selectGender(gender) {
    const locators = {
      'Male': this.genderMaleLabel,
      'Female': this.genderFemaleLabel,
    };
    const locator = locators[gender] || this.genderOtherLabel;

    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async selectSubject(subject) {
    await this.subjectsInput.click();
    await this.subjectsInput.fill(subject);
    await this.page.waitForTimeout(500); 
    const option = this.subjectOption.filter({ hasText: subject });

    try {
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click({ timeout: 1000 });
    } catch (error) {
      try {
        await option.click({ force: true, timeout: 1000 });
      } catch (secondError) {
        await this.subjectsInput.press('ArrowDown');
        await this.subjectsInput.press('Enter');
      }
    }
    await this.page.waitForFunction((subj) => {
        const selected = document.querySelector('.subjects-auto-complete__multi-value__label');
        return selected && selected.textContent === subj;
    }, subject, { timeout: 2000 }).catch(() => {});
  }

  async selectHobby(hobby) {
    await this.removeOverlays();

    const modalVisible = await this.successModal.isVisible().catch(() => false);
    if (modalVisible) {
      await this.closeModal();
      await this.removeOverlays();
    }

    const hobbyMap = {
      'Sports': this.hobbiesSportsLabel,
      'Reading': this.hobbiesReadingLabel,
      'Music': this.hobbiesMusicLabel,
    };

    if (hobbyMap[hobby]) {
      await hobbyMap[hobby].click();
    }
  }

  async fillAddress(address, state, city) {
    await this.currentAddressInput.fill(address);
    
    if (state) {
        await this.stateDropdown.click();
        const stateOption = this.dropdownOption.filter({ hasText: state });
        await stateOption.first().waitFor({ state: 'visible' });
        await stateOption.first().click();
    }
    
    if (city) {
        await this.cityDropdown.click();
        const cityOption = this.dropdownOption.filter({ hasText: city });
        await cityOption.first().waitFor({ state: 'visible' });
        await cityOption.first().click();
    }
  }

  async submit() {
    await this.removeOverlays();
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click({ force: true });
  }

  async closeModal() {
    try {
      await this.successModal.waitFor({ state: 'visible', timeout: 2000 });
    } catch (e) {
      return;
    }

    try {
      if (await this.modalCloseButton.isVisible({ timeout: 1000 })) {
        await this.modalCloseButton.click();
      } else {
        if (await this.genericCloseButton.first().isVisible({ timeout: 1000 })) {
          await this.genericCloseButton.first().click();
        }
      }
      await this.successModal.waitFor({ state: 'hidden', timeout: 2000 });
      return;
    } catch (error) {
      console.warn(`[PracticeFormPage] Failed to close modal via button: ${error.message}`);
    }

    if (await this.successModal.isVisible()) {
      try {
        await this.page.keyboard.press('Escape');
        await this.successModal.waitFor({ state: 'hidden', timeout: 2000 });
        return;
      } catch (error) {
        console.warn(`[PracticeFormPage] Failed to close modal via Escape key: ${error.message}`);
      }
    }

    if (await this.successModal.isVisible()) {
      console.warn('[PracticeFormPage] Modal still visible. Forcing removal via DOM manipulation.');
      await this.removeOverlays();
    }
  }

  async removeOverlays() {
    await this.page.evaluate(() => {
      document.body.classList.remove('modal-open');
      document.querySelectorAll([
        '.modal-backdrop',
        '.modal.show',
        '#fixedban',
        '#Ad.Plus-Anchor',
        '#adplus-anchor',
        '[id^="google_ads_iframe"]'
      ].join(',')).forEach(el => el.remove());
    });
  }
}

module.exports = { PracticeFormPage };
