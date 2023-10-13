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
    prodNames: string[]
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
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        await homePage.goto()
        const selectedItem : string = `Album`
        await homePage.clickOnAProuctByName(selectedItem)
        await use(productPage);
    },

    // Define an option and provide a default value. 
    // We can later override it in the config or in the test. 
    prodNames: [[`Album`], { option: true }], 

    cartPage: async ({ page, prodNames }, use) => {
        const homePage = new HomePage(page);
        const cartPage = new CartPage(page);
        await homePage.goto()
        await homePage.clickOnAddToCartByProductNames(prodNames)
        cartPage.expectedCartItemList.push(...prodNames)
        await use(cartPage);
    },

    myAccountPage: async ({ page }, use) => {
        const myAccountPage = new MyAccountPage(page);
        await use(myAccountPage);
    }
})

export { expect } from '@playwright/test';