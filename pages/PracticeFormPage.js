// @ts-check

class PracticeFormPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
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
    this.hobbiesSportsLabel = page.locator('label[for="hobbies-checkbox-1"]');
    this.hobbiesReadingLabel = page.locator('label[for="hobbies-checkbox-2"]');
    this.hobbiesMusicLabel = page.locator('label[for="hobbies-checkbox-3"]');
    this.currentAddressInput = page.locator('#currentAddress');
    this.stateDropdown = page.locator('#state');
    this.cityDropdown = page.locator('#city');
    this.submitButton = page.locator('#submit');
    this.successModal = page.locator('.modal-content');
    this.modalTitle = page.locator('#example-modal-sizes-title-lg');
  }

  async navigate() {
    await this.page.goto('https://demoqa.com/automation-practice-form', {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });
  }

  async fillPersonalDetails(firstName, lastName, email, mobile) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.mobileInput.fill(mobile);
  }

  async selectGender(gender) {
    if (gender === 'Male') await this.genderMaleLabel.click();
    else if (gender === 'Female') await this.genderFemaleLabel.click();
    else await this.genderOtherLabel.click();
  }

  async selectSubject(subject) {
    await this.subjectsInput.click();
    await this.subjectsInput.fill(subject);
    await this.page.waitForTimeout(500); 
    const option = this.page.locator('.subjects-auto-complete__option').filter({ hasText: subject });

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
  }

  async selectHobby(hobby) {
    if (hobby === 'Sports') await this.hobbiesSportsLabel.click();
    else if (hobby === 'Reading') await this.hobbiesReadingLabel.click();
    else if (hobby === 'Music') await this.hobbiesMusicLabel.click();
  }

  async fillAddress(address, state, city) {
    await this.currentAddressInput.fill(address);
    
    if (state) {
        await this.stateDropdown.click();
        await this.page.getByText(state, { exact: true }).click();
    }
    
    if (city) {
        await this.cityDropdown.click();
        await this.page.getByText(city, { exact: true }).click();
    }
  }

  async submit() {
    await this.submitButton.click();
  }
}

module.exports = { PracticeFormPage };

