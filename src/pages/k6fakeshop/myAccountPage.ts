import type { Page, Locator } from '@playwright/test';

export class MyAccountPage {
	private readonly usernameBox: Locator;
	private readonly passwordBox: Locator;
	private readonly loginButton: Locator;
	private readonly logoutButton: Locator;

	constructor(public readonly page: Page) {
		this.usernameBox = this.page.locator('input#username');
		this.passwordBox = this.page.locator('input#password');
		this.loginButton = this.page.locator('button[name="login"]');
		this.logoutButton = this.page.locator('a.logout');
	}

	async goto() {
		await this.page.goto('http://ecommerce.test.k6.io/my-account');
	}

	async login(username: string, password: string) {
		await this.usernameBox.fill(username);
		await this.passwordBox.fill(password);
		await this.loginButton.click();
	}

	async logout() {
		await this.logoutButton.click();
	}
}
