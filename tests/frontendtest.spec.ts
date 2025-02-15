// import { test, expect } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';

test('Order flow', async ({ page }) => {

  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      {
        "id": 1,
        "title": "Veggie",
        "image": "pizza1.png",
        "price": 0.0038,
        "description": "A garden of delight"
      },
      {
        "id": 2,
        "title": "Pepperoni",
        "image": "pizza2.png",
        "price": 0.0042,
        "description": "Spicy treat"
      },
      {
        "id": 3,
        "title": "Margarita",
        "image": "pizza3.png",
        "price": 0.0042,
        "description": "Essential classic"
      },
      {
        "id": 4,
        "title": "Crusty",
        "image": "pizza4.png",
        "price": 0.0028,
        "description": "A dry mouthed favorite"
      },
      {
        "id": 5,
        "title": "Charred Leopard",
        "image": "pizza5.png",
        "price": 0.0099,
        "description": "For those with a darker side"
      }
    ]
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        "id": 1,
        "name": "pizzaPocket",
        "stores": [
          {
            "id": 1,
            "name": "SLC"
          }
        ]
      }
    ]
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
    const loginRes = {
      "user": {
        "id": 1,
        "name": "常用名字",
        "email": "a@jwt.com",
        "roles": [
          {
            "role": "admin"
          }
        ]
      },
      "token": "heyheyhey"
    }
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      "items": [
        {
          "menuId": 1,
          "description": "Veggie",
          "price": 0.0038
        },
        {
          "menuId": 2,
          "description": "Pepperoni",
          "price": 0.0042
        },
        {
          "menuId": 3,
          "description": "Margarita",
          "price": 0.0042
        }
      ],
      "storeId": "1",
      "franchiseId": 1
    };
    const orderRes = {
      "order": {
        "items": [
          {
            "menuId": 1,
            "description": "Veggie",
            "price": 0.0038
          },
          {
            "menuId": 2,
            "description": "Pepperoni",
            "price": 0.0042
          },
          {
            "menuId": 3,
            "description": "Margarita",
            "price": 0.0042
          }
        ],
        "storeId": "1",
        "franchiseId": 1,
        "id": 18
      },
      "jwt": "hahahaha"
    }
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.route('*/**/api/order/verify', async (route) => {
    const verifyReq = {
      "jwt": "hahahaha"
    };
    const verifyRes = {
      "message": "valid",
      "payload": {
        "vendor": {
          "id": "rencherg",
          "name": "big Grant Rencher"
        },
        "diner": {
          "id": 1,
          "name": "常用名字",
          "email": "a@jwt.com"
        },
        "order": {
          "items": [
            {
              "menuId": 1,
              "description": "Veggie",
              "price": 0.0038
            },
            {
              "menuId": 2,
              "description": "Pepperoni",
              "price": 0.0042
            },
            {
              "menuId": 3,
              "description": "Margarita",
              "price": 0.0042
            }
          ],
          "storeId": "1",
          "franchiseId": 1,
          "id": 16
        }
      }
    }
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(verifyReq);
    await route.fulfill({ json: verifyRes });
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await page.getByRole('link', { name: 'Image Description Margarita' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Pay now' }).click();
  await page.getByRole('button', { name: 'Verify' }).click();

  await expect(page.getByText('JWT Pizza - valid')).toBeVisible();

});

test('Logout', async ({ page }) => {

  await page.route('*/**/api/auth', async (route) => {
    const request = route.request();

    expect(route.request().method()).toMatch(/PUT|DELETE/);
    
    if (request.method() === 'PUT') {
      const loginReq = { email: 'a@jwt.com', password: 'admin' };
      const loginRes = {
        "user": {
          "id": 1,
          "name": "常用名字",
          "email": "a@jwt.com",
          "roles": [
            {
              "role": "admin"
            }
          ]
        },
        "token": "heyheyhey"
      }
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } 
    
    else if (request.method() === 'DELETE') {
  
      const logoutRes = {
        "message": "logout successful"
      }
  
      await route.fulfill({ json: logoutRes });
    } 
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Logout')).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();

  await expect(page.getByText('Login')).toBeVisible();

});

test('History', async ({ page }) => {

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByText('It gained popularity')).toBeVisible();

});

test('Register', async ({ page }) => {

  await page.route('*/**/api/auth', async (route) => {
    const registerReq = {
      "name": "Chiang Kai-Shek",
      "email": "c@jwt.com",
      "password": "kai"
    }
    const registerRes = {
      "user": {
        "name": "Chiang Kai-Shek",
        "email": "c@jwt.com",
        "roles": [
          {
            "role": "diner"
          }
        ],
        "id": 589
      },
      "token": "realleaderofchina"
    }
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(registerReq);
    await route.fulfill({ json: registerRes });
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('Chiang Kai-Shek');
  await page.getByRole('textbox', { name: 'Email address' }).fill('c@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('kai');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByText('Logout')).toBeVisible();

});

test('Store', async ({ page }) => {

  let addedStore = false;

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
    const loginRes = {
      "user": {
        "id": 1,
        "name": "常用名字",
        "email": "a@jwt.com",
        "roles": [
          {
            "role": "admin"
          }
        ]
      },
      "token": "heyheyhey"
    }
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise/1/store', async (route) => {
    const storeReq = {
      "id": "",
      "name": "FreeTaiwan"
    };
    const storeRes = {
      "id": 179,
      "franchiseId": 1,
      "name": "FreeTaiwan"
    }
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(storeReq);
    addedStore = true;
    await route.fulfill({ json: storeRes });
  });

  await page.route('*/**/api/franchise/1', async (route) => {
    const storeRes = [
      {
        "id": 1,
        "name": "09cl5n6k58pizza",
        "admins": [
          {
            "id": 1,
            "name": "常用名字",
            "email": "a@jwt.com"
          }
        ],
        "stores": []
      }
    ]

    const storeResUpdated = [
      {
        "id": 1,
        "name": "09cl5n6k58pizza",
        "admins": [
          {
            "id": 1,
            "name": "常用名字",
            "email": "a@jwt.com"
          }
        ],
        "stores": [
          {
            "id": 142,
            "name": "FreeTaiwan",
            "totalRevenue": 0
          }
        ]
      }
    ]

    const returnRes = addedStore ? storeResUpdated : storeRes;

    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: returnRes });
  });

  await page.goto('http://localhost:5173/');
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('If you are already a franchisee,')).toBeVisible();
  await page.getByRole('link', { name: 'login', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('FreeTaiwan');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Everything you need to run an JWT Pizza franchise.')).toBeVisible();

});

test('About', async ({ page }) => {

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByText('The secret sauce')).toBeVisible();

});

test('Franchise', async ({ page }) => {

  let franchiseCreated = false;

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
    const loginRes = {
      "user": {
        "id": 1,
        "name": "常用名字",
        "email": "a@jwt.com",
        "roles": [
          {
            "role": "admin"
          }
        ]
      },
      "token": "heyheyhey"
    }
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const request = route.request();

    expect(route.request().method()).toMatch(/GET|POST/);
    
    if (request.method() === 'GET') {
      const createdRes = [
        {
          "id": 1,
          "name": "bigboy",
          "admins": [
            {
              "id": 1,
              "name": "pizza franchisee",
              "email": "f@jwt.com"
            }
          ],
          "stores": []
        }
      ];
      
      const getRes = franchiseCreated ? createdRes : [];
      await route.fulfill({ json: getRes });
    } 
    
    else if (request.method() === 'POST') {
      const createReq = {
        "stores": [],
        "id": "",
        "name": "bigboy",
        "admins": [
          {
            "email": "f@jwt.com"
          }
        ]
      };
  
      const createRes = {
        "stores": [],
        "id": 1,
        "name": "bigboy",
        "admins": [
          {
            "email": "f@jwt.com",
            "id": 9,
            "name": "pizza franchisee"
          }
        ]
      };
  
      expect(request.postDataJSON()).toMatchObject(createReq);
      franchiseCreated = true;
      await route.fulfill({ json: createRes });
    } 
  });
  
  await page.route('*/**/api/franchise/1', async (route) => {
    const deleteRes = {
      "message": "franchise deleted"
    }
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: deleteRes });
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('bigboy');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('row', { name: 'bigboy pizza franchisee Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
  
});
