import { ProductListSchema } from "src/constrains/k6fakeshop"
import { test, expect } from "src/fixtures/k6-test"
import { validateJson } from "src/utils/jsonSchemaUtil"
import { readJSONFileAsObject, writeObjectToJSONFile } from "src/utils/jsonUtil"

test.describe('Suite: @k6fakeshop', () => {
    test(`@TC01 - Verify that the home page loads correctly and displays the products`, async ({ homePage }) => {
        await expect(homePage.page).toHaveTitle(/The k6 Fake eShop/)

        //verify there are 12 products is presented
        expect((await homePage.productList.all()).length).toBe(12)

        //save all products info to file then verify json objects has proper datas...
        const prods = await homePage.saveAllProductInfo()
        await writeObjectToJSONFile(prods, "datas/k6fakeshop-prods.json")
        await readJSONFileAsObject("datas/k6fakeshop-prods.json").then(async (obj) => {
            console.log(`String of after reading obj:  ${JSON.stringify(obj)}`)
            expect(await validateJson(JSON.parse(JSON.stringify(obj)), ProductListSchema)).toBe(true)
        })
    });

    test(`@TC05 - Verify that the user can browser single product details.`, async ({ productPage }) => {
        // Expect to be redirected to a product page
        expect(productPage.page.url()).toContain("ecommerce.test.k6.io/product/");

        //verify there are only 1 product is presented
        expect((await productPage.page.locator(`xpath=//h1`).all()).length).toBe(1)

        //Expect the product details with name, price, description, SKU, category are displayed properly
        await productPage.prodPrice.innerText().then(async (str) => { expect(str).toContain(`15.00`) })
        await productPage.prodShortDesc.innerText().then(async (str) => { expect(str).toContain(`This is a simple, virtual product.`) })
        await productPage.prodSku.innerText().then(async (str) => { expect(str).toContain(`woo-album`) })
        await productPage.prodTag.innerText().then(async (str) => { expect(str).toContain(`Music`) })
    })

    test.only(`@TC02 - Verify that the user can add a product to the cart and view the cart details.`, async ({ cartPage }) => {
        await cartPage.goto()
        /*   
                "Navigate to the home page .",
                "Click on the add to cart button of the first product.",
                "Expect a toast message to appear with the text 'Product added to cart'.",
                "Click on the cart icon in the header.",
                "Expect the cart modal to open and display the product details, such as name, price, quantity, and subtotal.",
                "Expect the cart modal to also display the total amount and a checkout button." 
        */

    })
})