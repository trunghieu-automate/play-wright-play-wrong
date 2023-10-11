import type { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly searchBox: Locator;
  readonly productItems: Locator;
  readonly path: string
  readonly productList : Locator

  constructor(public readonly page: Page) {
    this.path = 'http://ecommerce.test.k6.io/'
    this.searchBox = this.page.locator('input#search');
    this.productItems = this.page.getByTestId('product-item');
    this.productList = this.page.locator(`xpath=//ul[contains(@class,"products column")]//li`)
  }

  async goto() {
    await this.page.goto('http://ecommerce.test.k6.io/', {timeout: 60000, waitUntil: "load"});
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
}
