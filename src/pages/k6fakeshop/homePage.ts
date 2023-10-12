import type { Page, Locator } from '@playwright/test';
import { ProductSchema } from 'src/constrains/k6fakeshop';
import { validateJson } from 'src/utils/jsonSchemaUtil';

export class HomePage {
	readonly searchBox: Locator;
	readonly productItems: Locator;
	readonly path: string
	readonly productList: Locator

	constructor(public readonly page: Page) {
		this.path = 'http://ecommerce.test.k6.io/'
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
}
