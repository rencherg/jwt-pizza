// import { test, expect } from '@playwright/test';
// import { test, expect } from 'playwright-test-coverage';

// test('Admin', async ({ page }) => {

//     await page.goto('http://localhost:5173/');
//     await page.getByRole('link', { name: 'Login' }).click();
//     await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
//     await page.getByRole('textbox', { name: 'Password' }).fill('admin');
//     await page.getByRole('button', { name: 'Login' }).click();
//     await page.getByRole('link', { name: 'Admin' }).click();
//     await page.getByRole('button', { name: 'Add Franchise' }).click();
//     await page.getByRole('textbox', { name: 'franchise name' }).click();
//     await page.getByRole('textbox', { name: 'franchise name' }).fill('bigboy');
//     await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
//     await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f@jwt.com');
//     await page.getByRole('button', { name: 'Create' }).click();
//     await page.getByRole('row', { name: 'bigboy 常用名字 Close' }).getByRole('button').click();
//     await page.getByRole('button', { name: 'Close' }).click();
    
//   });