import {test as newsTest} from "src/fixtures/vnexpress24"

newsTest.describe(`@Vnexpress - get news`, () => {
    newsTest(`@GetNews`, async ({news24hPage}) => {
        await news24hPage.goto()
        await news24hPage.saveCurrentPosts()
    })
})
