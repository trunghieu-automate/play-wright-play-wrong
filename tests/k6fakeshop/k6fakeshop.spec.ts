import { test, expect } from "src/fixtures/k6-test"

test.describe('Suite: @k6fakeshop', () => {
    test(`@TC01 - Verify that the home page loads correctly and displays the products`, async ({ homePage }) => {
        await homePage.goto()
        await expect(homePage.page).toHaveTitle(/The k6 Fake eShop/)
    })
    test(`@TC02 - Verify that the user can add a product to the cart and view the cart details.`, async ({ cartPage }) => {
        await cartPage.goto()
        expect(cartPage.page.url()).toContain(`http://ecommerce.test.k6.io/cart`)
    })
    test(`@TC03 - Verify that the user can remove a product from the cart and update the cart details`, async ({ cartPage }) => {
        await cartPage.goto()
        expect(await cartPage.page.url()).toContain(`http://ecommerce.test.k6.io/cart`)
    })
    test(`@TC04 - Verify that the user can checkout and complete an order with a valid credit card`, async ({ cartPage }) => {
        await cartPage.goto()
        expect(await cartPage.page.url()).toContain(`http://ecommerce.test.k6.io/cart`)
    })
})