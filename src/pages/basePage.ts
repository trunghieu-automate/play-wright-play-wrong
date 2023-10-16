import type { Page, Locator } from "@playwright/test"
class BasePage {
    constructor(public readonly page: Page) {
    }

    async isSelectorPresent(selector: string): Promise<boolean> {
        const element = await this.page.$(selector)
        return element != null
    }

    async isLocatorPresent(locator: Locator): Promise<boolean> {
        const isVisible: boolean = await locator.isVisible({ timeout: 500 })
        return isVisible
    }

    async isLocatorPresentWithTimeOut(locator: Locator, timeout: number): Promise<boolean> {
        const isVisible: boolean = await locator.isVisible({ timeout: timeout })
        return isVisible
    }
}


export default BasePage