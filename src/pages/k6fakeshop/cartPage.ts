import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test'
import { writeObjectToJSONFile } from 'src/utils/jsonUtil';

export class CartPage {
	readonly checkoutButton: Locator;
	readonly cartItems: Locator;
	expectedCartItemList: Array<string>
	readonly mainCartContainers: Locator
	readonly allCartItems: Locator
	readonly allItemNamesColumn: Locator
	readonly allItemQuantityColumn: Locator
	readonly allItemSubTotalColumn: Locator
	readonly cartTotalContainer: Locator
	readonly lastTotal: Locator
	readonly checkoutBtn: Locator
	readonly proceedToCheckoutBtn: Locator
	readonly placeOrderBtn: Locator

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
		this.placeOrderBtn = this.page.locator(`//button[@id="place_order"]`)
		this.proceedToCheckoutBtn = this.page.locator(`xpath=//div[contains(@class,"proceed-to-checkout")]//a`)
	}

	async verifyOrderIsMadeProperly() {
		await this.page.waitForSelector(`//h1[contains(.,"Order received")]`).then(async (ele) => {
			expect(await ele.isVisible()).toBeTruthy()
		})
		// save all order information
		const getInfo = async () => {
			return {
				"order number": await this.page.locator(`//div[@class="woocommerce-order"]//li[contains(.,"Order number")]//strong`).innerText(),
				"date": await this.page.locator(`//div[@class="woocommerce-order"]//li[contains(.,"Date")]//strong`).innerText(),
				"total": await this.page.locator(`//div[@class="woocommerce-order"]//li[contains(.,"Total")]//strong`).innerText(),
				"payment method": await this.page.locator(`//div[@class="woocommerce-order"]//li[contains(.,"Payment method")]//strong`).innerText(),
				"order detail": {
					"products": await Promise.all((await this.page.locator(`//tr[contains(@class,"line-item") or contains(@class,"order_item")]`).all()).map(
						async (ele) => {
							return {
								"product_name": await ele.locator(`//a`).innerText(),
								"quantity": (await ele.locator(`//strong`).innerText()).replace(`× `, ``),
								"total": await ele.locator(`//bdi`).innerText()
							}
						}
					))
				}
			}
		}
		const currentOrderDetails = await getInfo()
		await writeObjectToJSONFile(currentOrderDetails, `datas/payment-details.json`)
	}

	async clickPlaceOrderBtn() {
		await this.placeOrderBtn.click()
	}
	async fillAllRequiredFields() {
		await this.billingInputByLabel(`First name`, `Sonoda`)
		await this.billingInputByLabel(`Last name`, `Yoshii`)
		await this.selectBillingDDInputByLabel(`Country / Region`, `Japan`)
		await this.billingInputByLabel(`Street address`, `Erika`)
		await this.billingInputByLabel(`ZIP`, `1001000`)
		await this.selectBillingDDInputByLabel(`Prefecture`, `Tokyo`)
		await this.billingInputByLabel(`Town / City`, `Miyakemura`)
		await this.billingInputByLabel(`Phone`, `0999000999`)
		await this.billingInputByLabel(`Email address`, `iwanttobuy@yopmail.com`)
	}

	async billingInputByLabel(labelName: string, keyToSend: string) {
		await this.page.locator(`//label[contains(.,"${labelName}")]//following-sibling::span//input`).fill(keyToSend, { force: true })
	}

	async selectBillingDDInputByLabel(labelName: string, keyToSend: string) {
		await this.page.locator(`//label[contains(.,"${labelName}")]//following-sibling::span//span[@role="combobox"]`).click()
		await this.page.locator(`//span[contains(@class,"search--dropdown")]//input`).fill(keyToSend).then(async () => { await this.page.keyboard.press(`Enter`) })
	}

	async clickCheckoutBtn() {
		await this.proceedToCheckoutBtn.click()
	}

	async verifyPageIsDisplayedProperly(endPoint: string) {
		await this.page.waitForURL(`http://ecommerce.test.k6.io/${endPoint}/`)
		expect(await this.page.title()).toContain(`Checkout – The k6 Fake eShop`)
	}

	async goto() {
		await this.page.goto('http://ecommerce.test.k6.io/cart');
	}

	async checkout() {
		await this.checkoutButton.click();
	}

	async removeAnItemByItsName(name: string) {
		await this.page.waitForSelector(`xpath=//td[@class="product-name" and contains(.,"${name}")]/parent::tr//td[@class="product-remove"]//a`).then(async (ele) => {
			await ele.click()
		})
	}

	async verifyNotificationItemRemovedIsDisplayedProperly(name: string) {
		await this.page.waitForSelector(`xpath=//div[@class="woocommerce-notices-wrapper" and contains(., "“${name}” removed.")]`).then(async (locator) => {
			expect(await locator.isVisible(), `Verify notification is contains “${name}” removed.`).toBeTruthy()
		})
	}

	async getTotal(): Promise<Total> {
		const total = {
			subTotal: async () => { return await this.page.locator(`xpath=//tr[@class="cart-subtotal"]//bdi`).innerText() },
			total: async () => { return await this.page.locator(`xpath=//tr[@class="order-total"]//bdi`).innerText() }
		}
		return total
	}

	async verifyNumberOfItemInCartIsProper(expectedNo: number) {
		expect(await (this.allCartItems).all(), "Verify there is only 1 item in the cart").toHaveLength(expectedNo)
	}

	async verifyTotalSessionIsDisplayedProperly() {
		expect(this.cartTotalContainer, "Verify cart total containers displayed properly").toBeVisible()
	}

	async verifyBeforeAndAfterRemovalIsEqual(totalBefore: Total, totalAfter: Total) {
		expect(totalAfter.total, `Verify total is different after item removal action`).not.toContain(totalBefore.total)
	}
}
