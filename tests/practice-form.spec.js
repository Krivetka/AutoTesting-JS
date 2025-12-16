// @ts-check
const { test, expect } = require('@playwright/test');
const { PracticeFormPage } = require('../pages/PracticeFormPage');

const randomString = (length) => Math.random().toString(36).substring(2, 2 + length);
const randomPhone = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

const datasets = [
  {
    firstName: `John${randomString(4)}`,
    lastName: `Doe${randomString(4)}`,
    email: `john${randomString(4)}@example.com`,
    mobile: randomPhone(),
    gender: 'Male',
    subject: 'Maths',
    hobby: 'Sports',
    address: `123 Test St ${randomString(5)}`,
    state: 'NCR',
    city: 'Delhi'
  },
  {
    firstName: `Jane${randomString(4)}`,
    lastName: `Smith${randomString(4)}`,
    email: `jane${randomString(4)}@test.com`,
    mobile: randomPhone(),
    gender: 'Female',
    subject: 'English',
    hobby: 'Reading',
    address: `456 Another St ${randomString(5)}`,
    state: 'Uttar Pradesh',
    city: 'Agra'
  }
];

test.describe('Practice Form Tests', () => {
  let practiceFormPage;

  test.beforeEach(async ({ page }) => {
    practiceFormPage = new PracticeFormPage(page);
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        await practiceFormPage.navigate();
        break; 
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error; 
        }
        console.log(`Navigation attempt ${attempts} failed, retrying...`);
        await page.waitForTimeout(2000); 
      }
    }
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

        // Close the modal to prevent it from interfering with subsequent tests
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
