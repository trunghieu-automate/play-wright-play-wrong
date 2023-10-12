import { test as base, expect } from "@playwright/test"
import { HomePage } from "src/pages/k6fakeshop/homePage"
import { CartPage } from "src/pages/k6fakeshop/cartPage"
import { MyAccountPage } from "src/pages/k6fakeshop/myAccountPage"
import { ProductPage } from "src/pages/k6fakeshop/productPage"

// Declare the types of your fixtures.
type MyFixtures = {
    homePage: HomePage
    cartPage: CartPage
    myAccountPage: MyAccountPage
    productPage: ProductPage
}

export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        // Set up the fixture.
        const homePage = new HomePage(page);
        await homePage.goto()
        // Use the fixture value in the test.
        await use(homePage);
    },
    productPage: async ({ page }, use) => {
        // Set up the fixture.
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        await homePage.goto()
        await homePage.clickOnAProuctByName(`Album`)
        await productPage.page.waitForURL(/product/);
        // Use the fixture value in the test.
        await use(productPage);
    },
    myAccountPage: async ({ page }, use) => {
        // Set up the fixture.
        const myAccountPage = new MyAccountPage(page);
        // Use the fixture value in the test.
        await use(myAccountPage);
    }
})

export { expect } from '@playwright/test';