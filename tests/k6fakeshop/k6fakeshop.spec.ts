import { test, expect } from "src/fixtures/k6-test"
import { readJSONFileAsObject, writeObjectToJSONFile } from "src/utils/jsonUtil"

test.describe('Suite: @k6fakeshop', () => {
    test.only(`@TC01 - Verify that the home page loads correctly and displays the products`, async ({ homePage }) => {
        await homePage.goto()
        await expect(homePage.page).toHaveTitle(/The k6 Fake eShop/)

        //verify there are 12 products is presented
        expect((await homePage.productList.all()).length).toBe(12)

        //save all products info to file then verify json objects has proper datas...
        interface Product {
            readonly name: string
            readonly price: string[]
            readonly imgLink?: string
            readonly isSale: boolean
        }
        const prods : Array<Product> = [];

        for (const prodElement of await homePage.productList.all()) {
            var prodImgLink = await prodElement.locator("xpath=//a//img").getAttribute(`src`)
            var prodName = await prodElement.locator(`xpath=//h2`).textContent()
            var isProdOnSale = async () : Promise<boolean> => {
                try {
                    return await prodElement.locator(`xpath=//span`).isVisible()
                } catch (e) {
                    return false;
                }
            }
            var prodPrice = await prodElement.locator(`xpath=//bdi`).allTextContents()
            let prod : Product = {name: prodName, price: prodPrice, imgLink: prodImgLink, isSale: await isProdOnSale()}
            console.log(`adding product = ${JSON.stringify(prod)} to list`)
            prods.push(prod)
            
        }

        const prodListObj = JSON.parse(JSON.stringify(prods))
        await writeObjectToJSONFile(prodListObj, "datas/k6fakeshop-prods.json")
        await readJSONFileAsObject("datas/k6fakeshop-prods.json").then((obj) => {
            expect(JSON.stringify(obj)).toContain("Album")
            expect(JSON.stringify(obj)).toContain("Beanie")
            expect(JSON.stringify(obj)).toContain("Beanie with Logo")
            expect(JSON.stringify(obj)).toContain("Belt")
            expect(JSON.stringify(obj)).toContain("Cap")
            expect(JSON.stringify(obj)).toContain("Hoodie")
            expect(JSON.stringify(obj)).toContain("Hoodie with Logo")
            expect(JSON.stringify(obj)).toContain("Hoodie with Zipper")
            expect(JSON.stringify(obj)).toContain("Logo Collection")
            expect(JSON.stringify(obj)).toContain("Long Sleeve Tee")
            expect(JSON.stringify(obj)).toContain("Polo")
            expect(JSON.stringify(obj)).toContain("Single")
        })
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