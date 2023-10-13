import { ProductListSchema } from "src/constrains/k6fakeshop"
import { test as k6Test, expect } from "src/fixtures/k6-test"
import { validateJson } from "src/utils/jsonSchemaUtil"
import { readJSONFileAsObject, writeObjectToJSONFile } from "src/utils/jsonUtil"

k6Test.describe('Suite: @k6fakeshop', () => {
    k6Test(`@TC01 - Verify that the home page loads correctly and displays the products`, async ({ homePage }) => {
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
    })

    k6Test(`@TC02 - Verify that the user can add a product to the cart and view the cart details.`, async ({ cartPage }) => {
        const selectedItemList: Array<string> = cartPage.expectedCartItemList

        // expect the cart contains only 1 items
        expect(await (cartPage.allCartItems).all(), "Verify there is only 1 item in the cart").toHaveLength(1)

        // Expect the cart modal to open and display the product details, such as name, price, quantity, and subtotal.
        expect(await (cartPage.allItemNamesColumn).innerText(), "Verify item have proper name").toContain(selectedItemList.at(0))
        expect(await (cartPage.allItemQuantityColumn).getAttribute(`value`), "Verify item's quantity is proper").toContain(`1`)
        expect(await (cartPage.allItemSubTotalColumn.innerText()), "item has proper subtotal").toContain(`15.00`)

        //Expect the cart modal to also display the total amount and a checkout button
        expect(cartPage.cartTotalContainer, "Verify cart total containers displayed properly").toBeVisible()
        expect((await cartPage.lastTotal.innerText()), "Verify cart total amount is proper").toContain(`15.00`)
        expect(cartPage.checkoutBtn, "Veirify checkout btn is displayed properly").toBeVisible()
    })

    k6Test(`@TC05 - Verify that the user can browser single product details.`, async ({ productPage }) => {
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

    k6Test.use({ prodNames: [`Polo`, `Album`] })
    k6Test.only(`@TC03 - Verify that the user can remove a product from the cart and update the cart details.`, async ({ cartPage }) => {
        
    })

})