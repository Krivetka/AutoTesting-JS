const { test, expect } = require('@playwright/test');
const { PracticeFormPage } = require('../pages/PracticeFormPage');
const { generateDataset } = require('../utils/dataFactory');
const { navigateWithRetry } = require('../utils/testHelpers');
const { waitForUILoad } = require('../utils/uiLoadHelpers');

const datasets = Array.from({ length: 5 }, generateDataset);

test.describe('Practice Form Tests', () => {
  let practiceFormPage;

  test.beforeEach(async ({ page }) => {
    practiceFormPage = new PracticeFormPage(page);
    
    await navigateWithRetry(page, async () => {
      await practiceFormPage.navigate();
      try {
        const modalVisible = await practiceFormPage.successModal.isVisible({ timeout: 1000 });
        if (modalVisible) {
          await practiceFormPage.closeModal();
        }
      } catch (error) {
        // Ignore errors during modal check
      }
    });

    await waitForUILoad(page, practiceFormPage.firstNameInput);
  });

  test.describe('Parameterized form submissions', () => {
    datasets.forEach((data, index) => {
      test(`Dataset ${index + 1}`, async ({ page }) => {
        await practiceFormPage.fillPersonalDetails(
          data.firstName,
          data.lastName,
          data.email,
          data.mobile
        );
        await practiceFormPage.selectGender(data.gender);
        await practiceFormPage.selectSubject(data.subject);
        await practiceFormPage.selectHobby(data.hobby);
        await practiceFormPage.fillAddress(data.address, data.state, data.city);

        await practiceFormPage.submit();

        await expect(practiceFormPage.successModal).toBeVisible();
        await expect(practiceFormPage.modalTitle).toHaveText('Thanks for submitting the form');

        const modalText = await practiceFormPage.successModal.innerText();
        expect(modalText).toContain(`${data.firstName} ${data.lastName}`);
        expect(modalText).toContain(data.email);
        expect(modalText).toContain(data.gender);
        expect(modalText).toContain(data.mobile);
        expect(modalText).toContain(data.subject);
        expect(modalText).toContain(data.hobby);
        expect(modalText).toContain(data.address);
        expect(modalText).toContain(`${data.state} ${data.city}`);

        await practiceFormPage.closeModal();
      });
    });
  });

  test('Should fail to submit with empty mandatory fields', async ({ page }) => {
    await practiceFormPage.submit();
    await expect(practiceFormPage.successModal).not.toBeVisible();

    const form = page.locator('#userForm');
    await expect(form).toHaveClass(/was-validated/);
    
    const firstName = practiceFormPage.firstNameInput;
    const isFirstNameInvalid = await firstName.evaluate((e) => !e.checkValidity());
    expect(isFirstNameInvalid).toBe(true);
  });

  test('Should fail to submit with invalid email format', async ({ page }) => {
    await practiceFormPage.fillPersonalDetails('John', 'Doe', 'invalid-email', '1234567890');
    await practiceFormPage.selectGender('Male');
    await practiceFormPage.submit();
    await expect(practiceFormPage.successModal).not.toBeVisible();
    const isEmailInvalid = await practiceFormPage.emailInput.evaluate((e) => !e.checkValidity());
    expect(isEmailInvalid).toBe(true);
  });
});
