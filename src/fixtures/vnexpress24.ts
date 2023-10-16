import { test as base, expect } from "@playwright/test"
import { News24hPage } from "src/pages/vnexpress24h/News24hPage";

type VnexpressFixtures = {
    news24hPage: News24hPage
}

export const test = base.extend<VnexpressFixtures>(
    {
        news24hPage: async ({ page }, use) => {
            // Set up the fixture.
            const news24hPage = new News24hPage(page);
            await news24hPage.goto()
            // Use the fixture value in the test.
            await use(news24hPage);
        }
    }
)

export { expect } from '@playwright/test';