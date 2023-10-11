import { test as base, expect } from "@playwright/test"
import { HomePage } from "src/pages/k6fakeshop/homePage"
import { CartPage } from "src/pages/k6fakeshop/cartPage"
import { MyAccountPage } from "src/pages/k6fakeshop/myAccountPage"

// Declare the types of your fixtures.
type MyFixtures = {
    homePage: HomePage
    cartPage: CartPage
    myAccountPage: MyAccountPage
}

export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        // Set up the fixture.
        const homePage = new HomePage(page);
        // Use the fixture value in the test.
        await use(homePage);
    },
    cartPage: async ({ page }, use) => {
        // Set up the fixture.
        const cartPage = new CartPage(page);
        // Use the fixture value in the test.
        await use(cartPage);
    },
    myAccountPage: async ({ page }, use) => {
        // Set up the fixture.
        const myAccountPage = new MyAccountPage(page);
        // Use the fixture value in the test.
        await use(myAccountPage);
    }
})

export { expect } from '@playwright/test';