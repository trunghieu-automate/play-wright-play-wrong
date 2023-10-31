import type { Page } from "@playwright/test"
import { writeObjectToJSONFile } from "src/utils/jsonUtil"
import BasePage from "../basePage";

export class News24hPage extends BasePage {
	readonly newsLoc: string = `xpath=//div[contains(@class,"list-news-subfolder")]//article[@data-offset]//span[@class="time-count"]//span//ancestor::article`
	constructor(public readonly page: Page) {
		super(page)
	}
	async goto() {
		await this.page.goto('https://vnexpress.net/tin-tuc-24h', { timeout: 60000 });
	}

	async saveCurrentPosts() {
		await this.page.waitForSelector(this.newsLoc, {state: "visible"})
		const result = {
			"news": await Promise.all((await this.page.locator(this.newsLoc).all()).map(async (ele) => {
				return {
					"postedTime": await ele.locator(`//span[@datetime]`).getAttribute(`datetime` ?? ""),
					"title": await ele.locator(`//h3//a`).getAttribute(`title`) ?? "" ,
					"shortDescription": await ele.locator(`//p//a`).textContent() ?? "",
					"img": await this.isLocatorPresent(ele.locator(`//picture//img`)) ? ele.locator(`//picture//img`).getAttribute(`src`) : ""
				}
			}))
		}
		writeObjectToJSONFile(result, `datas/news-vnexpress.json`)
	}
}