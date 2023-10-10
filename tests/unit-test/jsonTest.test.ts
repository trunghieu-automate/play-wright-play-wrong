import { describe, expect, it } from '@jest/globals';
import { readJSONFileAsObject } from 'src/utils/jsonUtil';

describe('Json method tests', () => {
    it('read json file as objetct test', () => {
        readJSONFileAsObject("../testcases/testcases.json").then((obj) => {
            console.log(obj)
            console.log(typeof(obj))
            const record = {"url" : "abcd"}
            expect(obj).toBeInstanceOf(typeof(record))
        })
    });
});