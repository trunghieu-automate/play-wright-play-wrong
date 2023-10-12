import type { Page, Locator } from '@playwright/test';

export class HomePage {
	readonly searchBox: Locator
	readonly productItems: Locator
	readonly productList: Locator

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
		const targetProd = allProductsName.filter(async (prodByName) => {
			return await prodByName.innerText() == prodName ? true : false
		}).at(0)
		await targetProd.click()
		await this.page.waitForURL(/product/);
	}

	async clickOnAddToCartByProductName(prodName: string | Locator) {
		const allProducts = await this.productList.all()
		const targetProd = allProducts.filter(async (prodByName) => {
			const prodName: string = await prodByName.locator(`xpath=//h1`).innerText()
			return prodName == prodName ? true : false
		}).at(0)
		await targetProd.locator(`//a[@rel="nofollow"]`).click()
		const locatorExp = `//*[contains(@class,"loading") or contains(.,"loading")]`
		/* const element = await this.page.waitForSelector(locatorExp, { timeout: 1000 })
		// If the element is found, wait until it is hidden or removed from the DOM
		if (element) {
			try {
				await this.page.waitForSelector(locatorExp, { timeout: 10000, state: "hidden" })
			} catch (error) {
				console.log(`element with locator: ${locatorExp} is still displayed`)
			}
		} */

		await targetProd.locator(`//a[@title="View cart"]`).click()
		await this.page.waitForURL(/cart/);
	}
	/* 
		async clickOnARandomProduct() {
			const noOfProds : number =  (await this.productItems.locator(`xpath=//h2`).all()).length;
			const randomNum : number = _.random(0, noOfProds-1);
			await (await this.productItems.locator(`xpath=//h2`).all()).at(randomNum).click()
		} */
}
