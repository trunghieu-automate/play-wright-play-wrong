import type { Page, Locator } from '@playwright/test';

export class HomePage {
	readonly searchBox: Locator
	readonly productItems: Locator
	readonly productList: Locator
	readonly loadingIndicator: string = `//*[contains(@class,"loading") or contains(.,"loading")]`
	readonly path: string = 'http://ecommerce.test.k6.io/'

	constructor(public page: Page) {
		this.searchBox = this.page.locator('input#search');
		this.productItems = this.page.getByTestId('product-item');
		this.productList = this.page.locator(`xpath=//ul[contains(@class,"products column")]//li`)
	}

	async goto() {
		await this.page.goto('http://ecommerce.test.k6.io/', { timeout: 60000, waitUntil: "load" });
	}

	async search(text: string) {
		await this.searchBox.fill(text);
		await this.searchBox.press('Enter');
	}

	async addToCart(text: string) {
		const product = this.productItems.filter({ hasText: text });
		await product.getByText('Add to cart').click();
	}

	async removeAllFromCart() {
		await this.page.click('a.cart-icon');
		while ((await this.page.locator('button.remove-from-cart').count()) > 0) {
			await this.page.locator('button.remove-from-cart').first().click();
		}
	}

	async saveAllProductInfo() {
		const prods: Array<Product> = [];
		for (const prodElement of await this.productList.all()) {
			var prodImgLink = await prodElement.locator("xpath=//a//img").getAttribute(`src`)
			var prodName = await prodElement.locator(`xpath=//h2`).textContent()
			var isProdOnSale = async (): Promise<boolean> => {
				try {
					return await prodElement.locator(`xpath=//span`).isVisible()
				} catch (e) {
					return false;
				}
			}
			var prodPrice = await prodElement.locator(`xpath=//bdi`).allTextContents()
			let prod: Product = { name: prodName, price: prodPrice, imgLink: prodImgLink, isSale: await isProdOnSale() }
			console.log(`adding product = ${JSON.stringify(prod)} to list`)
			prods.push(prod)

		}
		return JSON.parse(JSON.stringify(prods))
	}

	async clickOnAProuctByName(prodName: string | Locator) {
		const allProductsName = await this.productList.locator(`xpath=//h2`).all()
		const targetProd = allProductsName.filter(async (prod) => {
			return await prod.innerText() == prodName ? true : false
		}).at(0)
		await targetProd.click()
		await this.page.waitForURL(/product/);
	}

	async clickOnAddToCartByProductName(prodName: string | Locator) {
		var prodNameText : string
		const allProducts = await this.productList.all()
		const targetProd = allProducts.filter(async (prod) => {
			prodNameText = await prod.locator(`xpath=//h2`).innerText()
			return prodNameText == prodName ? true : false
		}).at(0)
		await targetProd.locator(`//a[@rel="nofollow"]`).click()
		await targetProd.locator(`//a[@title="View cart"]`).click()
		await this.page.waitForURL(/cart/);
	}

}
