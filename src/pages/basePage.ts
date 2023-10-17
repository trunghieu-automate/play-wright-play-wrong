import type { Page, Locator } from "@playwright/test"
import { readJSONFileAsObject } from "src/utils/jsonUtil"
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

    async readDatasFile(filePath : string, key : string) {
        const datas = await readJSONFileAsObject(filePath)
        return datas[key]
    }
}

export default BasePage