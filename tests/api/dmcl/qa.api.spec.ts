/**  
* This test perform fetching below api with looping its param from 1000 to 1 then save and append all result into json file
* url: https://dienmaycholon.vn/api/general/dfquestionproduct/list?cid_product=&page=1000
* sample response
{
    "status": 200,
    "message": "Danh sách hỏi đáp",
    "data": {
        "TotalItem": 10000,
        "Totalpage": 1000,
        "data": [
            {
                "id": "65405e16aa51f21a7028e842",
                "name": "Nghĩa",
                "content": "Mình còn hàng ở TPHCM không ạ? Không phải hàng trưng bày",
                "cid_product": 32290,
                "type_user": 1,
                "picture85": null,
                "picture450": null,
                "likes": 0,
                "unlikes": 0,
                "level": null,
                "total_child": 1,
                "child": [
                    {
                        "id_child": "654072e30dc4bb12ea5d7082",
                        "name": "Quản trị viên",
                        "content": "Chào bạn! Hiện khu vực HCM bên mình còn hàng mới bạn nhé Nếu cần thêm thông tin gì bạn vui lòng liên hệ số điện thoại 19002628 để được hỗ trợ nhanh nhất nhé Thân chào!",
                        "cid_product": 32290,
                        "type_user": 3,
                        "picture85": null,
                        "picture450": null,
                        "likes": 0,
                        "unlikes": 0,
                        "level": 0,
                        "showTime": "12 phút trước"
                    }
                ],
                "showTime": "2 giờ trước"
            }
        ]
    }
}

**/

import { test, request } from "@playwright/test"
import { writeObjectToJSONFile } from "src/utils/jsonUtil";


test.describe(`@dmcl-api @apiTest`, async () => {
    test(`@smoke sample request`, async () => {
        // create an API context
        const context = await request.newContext({
            ignoreHTTPSErrors: true,
            extraHTTPHeaders: {
                Cookie: `WEBDMCL2022=web04`,
                Connection: `keep-alive`,
            }
        });
        const pageNo = `3`
        // send sample Get request and write data object to file
        await context.get(`https://dienmaycholon.vn/api/general/dfquestionproduct/list?cid_product=&page=${pageNo}}`, {
            timeout: 0
        }).then(async (response) => {
            if (response.status() == 200) {
                const bodyJson = await response.json()
                const dataList = bodyJson.data.data
                writeObjectToJSONFile(dataList, `datas/dataPage3.json`)
            }
        })
    })

    test(`@100-requests send 100 request consecutively then write to a json file`, async ({}) => {
        // create an API context
        const context = await request.newContext({
            ignoreHTTPSErrors: true,
            extraHTTPHeaders: {
                Cookie: `WEBDMCL2022=web04`,
                Connection: `keep-alive`,
            }
        });
        const result = []
        for (let i = 1; i <= 100; i++) {
            let startTime = Date.now()
            console.log(`request start @${startTime}`)
            await context.get(`https://dienmaycholon.vn/api/general/dfquestionproduct/list?cid_product=&page=${i}}`, {
            }).then(async (response) => {
                let endTime = Date.now()
                console.log(`Successfull request on param page: ${i} end @${endTime}, duration: ${endTime - startTime} ms`)
                if (response.status() == 200) {
                    const bodyJson = await response.json()
                    const dataList = bodyJson.data.data
                    result.push(dataList)
                }
            })
        }
        writeObjectToJSONFile(result, `datas/dataPage3.json`)
    })
})