import { test, expect } from "@playwright/test"
import { convertToMap, readJSONFileAsObject, writeObjectToJSONFile } from "src/utils/jsonUtil";

test.describe(`suite: json manipulation`, () => {
    test(`test: read json file as fully json object`, async ({ page }) => {
        await page.goto('https://playwright.dev/');
        // Expect can read Json file as a Record Object
        await readJSONFileAsObject(`testcases/k6fakeshop/testcases.json`).then((obj) => {
            console.log(obj)
            expect(obj).not.toBeUndefined()
        })
    })

    test(`test: read json file then convert to a map object`, async ({ page }) => {
        await page.goto('https://playwright.dev/');
        // Expect can read Json file as a Record Object
        await readJSONFileAsObject(`testcases/k6fakeshop/testcases.json`).then((obj) => {
            const map = convertToMap(obj)
            expect(typeof map).toBe(typeof new Map<any, any>)
        })
    })

    test(`test: collect a page meta-data then write to a json file`, async ({ page }) => {
        await page.goto('https://bing.com/');
        class MetaData {
            property: string
            content: string
            constructor(property: string, content: string) {
                this.content = content
                this.property = property
            }
        }
        const metaDatas : Array<Record<any, any>> = []
        for (const ele of await page.$$(`xpath=//head//meta[@property and @content]`)){
            var prop = await ele.getAttribute(`property`)
            var cont = await ele.getAttribute(`content`)
            var metaObject: MetaData = new MetaData(prop, cont)
            metaDatas.push(metaObject)
        }
        const convertedObj = await JSON.parse(JSON.stringify(metaDatas))
        console.log("Converted array to json object: " + convertedObj)
        await writeObjectToJSONFile(convertedObj, "bing-metadatas.json")
        await readJSONFileAsObject("bing-metadatas.json").then((obj) => {
            console.log(obj)
            expect(obj).not.toBeUndefined()
        })
    })
})