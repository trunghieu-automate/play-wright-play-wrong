import type { Page, Locator } from '@playwright/test';

export class ProductPage {
	readonly prodSku : Locator
	readonly prodPrice : Locator
	readonly prodShortDesc : Locator
	readonly prodTag : Locator
	constructor(public readonly page: Page) {
		this.prodPrice = this.page.locator(`xpath=//p[@class="price"]`)
		this.prodShortDesc = this.page.locator(`xpath=//div[contains(@class, "short-description")]//p`)
		this.prodSku = this.page.locator(`xpath=//span[@class="sku"]`)
		this.prodTag = this.page.locator(`xpath=//span[@class="posted_in"]`)
	}
}
