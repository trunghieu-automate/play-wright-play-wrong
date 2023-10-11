import type { Page, Locator } from '@playwright/test';

export class CartPage {
  private readonly checkoutButton: Locator;
  private readonly cartItems: Locator;

  constructor(public readonly page: Page) {
    this.checkoutButton = this.page.locator('button#checkout');
    this.cartItems = this.page.getByTestId('cart-item');
  }

  async goto() {
    await this.page.goto('http://ecommerce.test.k6.io/cart');
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async remove(text: string) {
    const cartItem = this.cartItems.filter({ hasText: text });
    await cartItem.getByText('Remove').click();
  }

  async removeAll() {
    while ((await this.cartItems.count()) > 0) {
      await this.cartItems.getByText('Remove').first().click();
    }
  }
}
