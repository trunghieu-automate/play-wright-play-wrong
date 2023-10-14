import type { Page, Locator } from '@playwright/test';
import {expect} from '@playwright/test'

export class CartPage {
	readonly checkoutButton: Locator;
	readonly cartItems: Locator;
	expectedCartItemList : Array<string>
	readonly mainCartContainers : Locator
	readonly allCartItems : Locator
	readonly allItemNamesColumn : Locator
	readonly allItemQuantityColumn : Locator
	readonly allItemSubTotalColumn : Locator
	readonly cartTotalContainer : Locator
	readonly lastTotal : Locator
	readonly checkoutBtn : Locator

	constructor(public readonly page: Page) {
		this.expectedCartItemList = []
		this.mainCartContainers = this.page.locator(`xpath=//main//table[contains(@class,"cart")]`)
		this.allCartItems = this.page.locator(`xpath=//tbody//tr[contains(@class, "cart_item")]`)
		this.allItemNamesColumn = this.page.locator(`xpath=//tbody//tr[contains(@class, "cart_item")]//td[@class="product-name"]`)
		this.allItemQuantityColumn = this.page.locator(`xpath=//tbody//tr[contains(@class, "cart_item")]//td[@class="product-quantity"]//input`)
		this.allItemSubTotalColumn = this.page.locator(`xpath=//tbody//tr[contains(@class, "cart_item")]//td[@class="product-subtotal"]//bdi`)
		this.cartTotalContainer = this.page.locator(`xpath=//div[@class="cart_totals" or @class="cart_totals "]`)
		this.lastTotal = this.page.locator(`xpath=//td[@data-title="Total"]//bdi`)
		this.checkoutBtn = this.page.locator(`xpath=//div//a[contains(@class,"checkout-button")]`)
	}

	async goto() {
		await this.page.goto('http://ecommerce.test.k6.io/cart');
	}

	async checkout() {
		await this.checkoutButton.click();
	}

	async removeAnItemByItsName(name : string) {
		this.page.waitForSelector(`xpath=//td[@class="product-name" and contains(.,"${name}")]/parent::tr//td[@class="product-remove"]//a`).then(async(ele) => {
            await ele.click()
        })
	}

	async verifyNotificationItemRemovedIsDisplayedProperly (name : string) {
		this.page.waitForSelector(`xpath=//div[@class="woocommerce-notices-wrapper" and contains(., "“${name}” removed.")]`).then(async (locator) => {
            expect(await locator.isVisible(), `Verify notification is contains “${name}” removed.`).toBeTruthy()
        })
	}
}
