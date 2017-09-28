import { request } from '../utils'

export async function queryDetail(alertId) {

    return request(`/incident/getIncidentDetail/${alertId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    // return Promise.resolve({
    //     result: true,
    //     data: {
    //         "severity": 0, "lastTime": 735119, "firstOccurTime": 1497003420941, "entityAddr": "181.1.1.2", "isNotify": false, "count": 1, "description": "是否能派单", "lastOccurTime": 1497003420941, "source": "alertTest", "notifyList": [], "itsmDetailUrl": "http://10.1.60.111/itsm/#/detail/cf1014b41de44ca29f5bafcf56e7cd79", "ciUrl": "http://10.1.60.111/cmdb/config.html#/593a3d303249864f2a9f253c", "orderFlowNum": "INCI17060900001", "parentId": false, 
    //         "tags": [{ "tenant": "e10adc3949ba59abbe56e057f20f88dd", "key": "severity", "keyName": "等级", "value": "0", "tags": [{ "tenant": "e10adc3949ba59abbe56e057f20f88dd", "key": "severity", "value": "0", "keyName": "等级" }] }, { "tenant": "e10adc3949ba59abbe56e057f20f88dd", "key": "status", "keyName": "状态", "value": "150", "tags": [{ "tenant": "e10adc3949ba59abbe56e057f20f88dd", "key": "status", "value": "150", "keyName": "状态" }] }, { "tenant": "e10adc3949ba59abbe56e057f20f88dd", "key": "source", "keyName": "来源", "value": "alertTest", "tags": [{ "tenant": "e10adc3949ba59abbe56e057f20f88dd", "key": "source", "value": "alertTest", "keyName": "来源" }] }, { "tenant": "e10adc3949ba59abbe56e057f20f88dd", "key": "标签", "keyName": "标签", "value": "IP丰富xx", "tags": [{ "tenant": "e10adc3949ba59abbe56e057f20f88dd", "key": "标签", "value": "IP丰富xx", "keyName": "标签" }] }], "entityName": "派发工单测试", "name": "派发工单测试", "alias": "派发工单测试", "id": "c09026e262034e3c9d0ca8611866e62a", 
    //         "properties": [{ "val": "杭州", "code": "location", "name": "所在地" }], 
    //         "status": 150,
    //         "ci": "http://baidu.com",
    //         "ciId": 132312,
    //         "ciDetail": [
    //             {code: "名称", value: 'bnd-1'},
    //             {code: "网络域", value: "默认域"},
    //             {code: "IP地址", value: "10.1.1.1"},
    //             {code: "厂商", value: "H3C"},
    //             {code: "品牌", value: ""},
    //             {code: "型号", value: "S5500-28C-SI"},
    //             {code: "序列号", value: ""},
    //             {code: "SNMP参数", value: ""},
    //             {code: "系统版本", value: "5.20"}
    //         ],
    //         "incidentLog": [
    //             {
    //             "incidentId": "d5fb15885065452284afbc77d20ecd9b",
    //             "operatorId": "e10adc3949ba59abbe56e057f20f88dd",
    //             "operatorName": "admin",
    //             "operateTime": 1496305431000,
    //             "operateType": 110,
    //             "attributes": {
    //                 "roomId": "592f738af39343704f943659",
    //                 "roomName": "general"
    //             }
    //             },
    //             {
    //                 "incidentId": "d5fb15885065452284afbc77d20ecd9b",
    //                 "operatorId": "-1",
    //                 "operatorName": "管理员",
    //                 "operateTime": 14962985380,
    //                 "operateType": 250,
    //                 "attributes": {
    //                     "new_value": 255
    //                 }
    //             },
    //             {
    //                 "incidentId": "d5fb15885065452284afbc77d20ecd9b",
    //                 "operatorId": "-1",
    //                 "operatorName": "管理员",
    //                 "operateTime": 14962985380,
    //                 "operateType": 130,
    //                 "attributes": {
    //                     "flowNo": "12131231231231xxxx"
    //                 }
    //             },
    //             {
    //                 "incidentId": "d5fb15885065452284afbc77d20ecd9b",
    //                 "operatorId": "-1",
    //                 "operatorName": "管理员",
    //                 "operateTime": 14962985380,
    //                 "operateType": 90,
    //                 "attributes": {
    //                     "recipient": "甲乙丙丁"
    //                 }
    //             },
    //             {
    //             "incidentId": "d5fb15885065452284afbc77d20ecd9b",
    //             "operatorId": "-1",
    //             "operateTime": 14958671490,
    //             "operateType": 10
    //             }
                
    //         ]
    //     }
    // })
}