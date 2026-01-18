const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://demoqa.com';

function generateRandomUser() {
  const timestamp = Date.now();
  return {
    userName: `testUser_${timestamp}`,
    password: `Test@${timestamp}!Aa`
  };
}

test.describe('DemoQA BookStore API + UI Tests', () => {
  let user;
  let token;
  let userId;
  let selectedBooks = [];

  test.describe.configure({ mode: 'serial' });

  test('Create new user via API', async ({ request }) => {
    user = generateRandomUser();

    const response = await request.post(`${BASE_URL}/Account/v1/User`, {
      data: {
        userName: user.userName,
        password: user.password
      }
    });

    expect(response.status()).toBe(201);
    
    const body = await response.json();
    expect(body.userID).toBeTruthy();
    expect(body.username).toBe(user.userName);
    
    userId = body.userID;
  });

  test('Authenticate user and get token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/Account/v1/GenerateToken`, {
      data: {
        userName: user.userName,
        password: user.password
      }
    });

    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(body.status).toBe('Success');
    expect(body.result).toBe('User authorized successfully.');
    
    token = body.token;
  });

  test('Add books to user collection', async ({ request }) => {
    const booksResponse = await request.get(`${BASE_URL}/BookStore/v1/Books`);
    expect(booksResponse.status()).toBe(200);
    
    const booksData = await booksResponse.json();
    expect(booksData.books.length).toBeGreaterThan(0);
    
    selectedBooks = booksData.books.slice(0, 2);

    const addBooksResponse = await request.post(`${BASE_URL}/BookStore/v1/Books`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        userId: userId,
        collectionOfIsbns: selectedBooks.map(book => ({ isbn: book.isbn }))
      }
    });

    expect(addBooksResponse.status()).toBe(201);
    
    const addedBooks = await addBooksResponse.json();
    expect(addedBooks.books.length).toBe(2);
  });

  test('Login via UI and validate book collection', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('#userName', user.userName);
    await page.fill('#password', user.password);
    await page.click('#login');

    await expect(page.locator('#userName-value')).toHaveText(user.userName, { timeout: 15000 });

    await page.goto(`${BASE_URL}/profile`);
    
    for (const book of selectedBooks) {
      const bookLink = page.locator(`a:has-text("${book.title}")`);
      await expect(bookLink).toBeVisible({ timeout: 10000 });
    }
  });

  test('Delete book via API', async ({ request }) => {
    const authResponse = await request.post(`${BASE_URL}/Account/v1/GenerateToken`, {
      data: {
        userName: user.userName,
        password: user.password
      }
    });
    const authBody = await authResponse.json();
    token = authBody.token;

    const bookToDelete = selectedBooks[0];
    
    const deleteResponse = await request.delete(`${BASE_URL}/BookStore/v1/Book`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        isbn: bookToDelete.isbn,
        userId: userId
      }
    });

    expect(deleteResponse.status()).toBe(204);

    const userResponse = await request.get(`${BASE_URL}/Account/v1/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(userResponse.status()).toBe(200);
    const userData = await userResponse.json();
    
    const deletedBookInCollection = userData.books.find(b => b.isbn === bookToDelete.isbn);
    expect(deletedBookInCollection).toBeUndefined();
  });

  test('Verify the deletion via UI', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('#userName', user.userName);
    await page.fill('#password', user.password);
    await page.click('#login');

    await expect(page.locator('#userName-value')).toHaveText(user.userName, { timeout: 15000 });

    await page.goto(`${BASE_URL}/profile`);

    const deletedBook = selectedBooks[0];
    const deletedBookLink = page.locator(`a:has-text("${deletedBook.title}")`);
    await expect(deletedBookLink).not.toBeVisible({ timeout: 10000 });

    const remainingBook = selectedBooks[1];
    const remainingBookLink = page.locator(`a:has-text("${remainingBook.title}")`);
    await expect(remainingBookLink).toBeVisible({ timeout: 10000 });
  });
});
