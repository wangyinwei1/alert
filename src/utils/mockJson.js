import Mock from 'mockjs'

export default {
  /* key: url -> value: rule */
  "/treeMap/tags/isSet": "@boolean",
  "/incident/queryCondition/save": {
    "result|1": [true, false],
    "message|1": ["保存成功", "保存失败"],
    "data": {
      "id|10000-100000": 1
    },
    "regex": /\/incident\/queryCondition\/save\//
  },
  "/incident/queryCondition/getAll": {
    "data|10-30": [
      {
        "name": "@name",
        "id|+1": 100,
        "incidentHistoryParam|1-13": {
          "source": "@name",
          "severity|1": ["0", "1", "2", "3"],
          "status|1": ["0", "40", "150", "190", "255"],
          "duration|1": ["1", "2", "3", "4", "5"],
          "count|1": ["1", "2", "3", "4"],
          "isNotify|1": ["true", "false"],
          "keyWordsType|1": ["1", "2", "3", "4", "5", "6", "100"],
          "keyWords": "@name",
          "keyName|1": ["", "", "", "", "@name"],
          "ownerId": "@id",
          "begin|1502035200524-1502812800524": 1,
          "end|1502812800524-1503590400561": 1,
          "lastBegin|1502035200524-1502812800524": 1,
          "lastEnd|1502812800524-1503590400561": 1,
        }
      }
    ]
  },
  "/incident/queryCondition/remove": {
    "result|1": [true, false],
    "message|1": ["删除成功", "删除失败"],
    "regex": /\/incident\/queryCondition\/remove\//
  },
  "/applicationType/query": {
    regex: /\/applicationType\/query?/,
    template: [
      {
        "id": "58c681355b71a73b448ccec6",
        "name": "UYUN ITSM",
        "type": 1,
        "appType": "协同类",
        "uniqueCode": 1
      },
      {
        "id": "58c680df5b71a73b448ccec4",
        "name": "UYUN ChatOps",
        "type": 1,
        "appType": "协同类"
      },
      {
        "id": "58c680df5b71a73b448ccec7",
        "name": "Web Hook",
        "type": 1,
        "appType": "协同类",
        "uniqueCode": "8"
      },
    ]
  },
  // 是否有权限查询应用状态
  "/application/checkPayType": {
    "template|1": [true, false]
  },
  // 应用查询接口模拟
  "/application/query": {
    regex: /\/application\/query?/,
    "template|1-10": [
      {
        "id": "@string(5)",
        "tenant": "@string(10)",
        "status|1": [1, 0],
        "integration": "@string(10)",
        "applyType": {
          "id": "@string(10)",
          "name|1": ["UYUN ITSM", "UYUN ChatOps", "UYUN WebHook"],
          "type|1": [0, 1],
          "appType": "@name",
          "appAlias": "@cname",
        },
        "displayName": "@cname",
        "appKey": "@string(12)",
        "type|1": [0, 1],
        "buildIn|1": [0, 1],
        "createDate|1502035200524-1502812800524": 1,
        "webHook": {
          "url": "@url",
          "timeout|30-150": 1,
          "fidldMap": /(.*?):"\$\{(.*?)\}"/g
        },
        "appRules|1-5": [{
          "id": "@string(10)",
          "tenant": "@string(10)",
          "name": "@cname",
          "description": "@sentence",
          "dataSource": [1, 2, 3],
          "filterFields|1-5": [{

          }]
        }]
      }
    ]
  },
  "/application/create": {
    "template|1": [true, false]
  },
  "/application/update": {
    "template|1": [true, false]
  },
  "/application/getAppDetail": {
    regex: /\/application\/getAppDetail\//,
    "template": function (params) {
      return Mock.mock({
        "id": "@string(10)",
        "tenant": "@string(10)",
        "status|1": [1, 0],
        "integration": "@string(10)",
        "applyType": {
          "id": "@string(10)",
          "name|1": ["UYUN ITSM", "UYUN ChatOps", "Web Hook", "Web Hook", "Web Hook", "Web Hook"],
          "type|1": [0, 1],
          "appType": "@name",
          "appAlias": "@cname",
          "uniqueCode|1": ["8", "8", "8", "8", "8", "1", "2", "3", "4", "5", "6", "7", "8"],
        },
        "displayName": "@cname",
        "appKey": "@string(12)",
        "type|1": [0, 1],
        "buildIn|1": [0, 1],
        "createDate|1502035200524-1502812800524": 1,
        "webHook": {
          "url": "@url",
          "timeout|30-150": 1,
          "fieldMap": /^{(.*?):"\$\{(\d)\}"{1, 10}}$/g,
          "replyKey": "@string(5)",
          "replySuccess": "@string(2)",
          "requestMode|1": ["GET", "POST"]
        },
        "appRules|1-5": [{
          "id": "@string(10)",
          "tenant": "@string(10)",
          "name": "@cname",
          "description": "@sentence",
          "dataSource": [1, 2, 3],
          "filterFields|1-5": [{

          }]
        }]
      })
    }
  },

  // 可视化接口
  "/visual/storeKeys": {
    "template": {
      "keys|1-5": ["@cname"],
      "level|1": [0, 1, 2, 3, 4, 5]
    }
  },

  "/visual/tagValuesInfo": {
    "template|10-20": [
      {
        "tagValue": "@cname",
        "severity": 3,
        "values|1-10": [
          {
            "value": "@cname",
            "severity|1": [0, 1, 2, 3]
          }
        ]
      }
    ]
  },

  "/visual/resStateInfo": {
    "template|5": [
      {
        "tagValue": "@cname",
        "resources|10": [
          {
            "resId": "@string(10)",
            "resName": "@string(10, 200)",
            "severity|1": [0, 1, 2, 3],
            "iconUrl": "@url"
          }
        ]
      }
    ]
  },

  "/visual/resIncidents": {
    regex: /\/visual\/resIncidents\/? /,
    "template|1-5": [
      {
        "id": "@string(10)",
        "name": "告警：@cname",
        "severity|1": [0, 1, 2, 3],
        "iconUrl": "@url"
      }
    ]
  },
  "/treeMap/tags/isSet": {
    regex: /\/treeMap\/tags\/isSet/,
    "template|1": [true, true]
  },

  "/treeMap/getData": {
    "template": {
      "totalCriticalCnt|1-100": 1,
      "totalWarnCnt|1-100": 1,
      "picList": [
        {
          "path": "test",
          "children|1-5": [
            {
              "path": "test/@name",
              "name": "@cname",
              "value|1-100": 1,
              "maxSeverity|1": [-1, 0, 1, 2, 3]
            }
          ]
        }
      ]
    }
  },

  "/incident/queryHistory": {
    template: {
      "tagKeys": [],
      "properties": {},
      "hasNext|1": [true],
      "data|20-40": [{
        "alias": "@string(5)",
        "classCode": "@string(5)",
        "count|1-1000": 1,
        "description": "@sentence()",
        "entityAddr": "@address",
        "entityName": "告警-@cname",
        "firstOccurTime|1502035200524-1502812800524": 1,
        "lastOccurTime|1502035200524-1502812800524": 1,
        "lastTime|0-1200000": 1,
        "hasChild|1": [false, false, false, true],
        "id": "@id",
        "name": "@cname",
        "resObjectId": "@string(12)",
        "severity|1": [0, 1, 2, 3],
        "source": "@cname",
        "status|1": ["0", "40", "150", "190", "255"],
        "ownerName": "@cname",
        "tags": [],
      }]
    }
  },

  "/incident/queryIncidentCount": {
    template: {
      "ok|1-40": 1,
      "information|1-40": 1,
      "warning|1-40": 1,
      "critical|1-40": 1,
      "total|1-100": 1,
    }
  },

  //时间线
  "/incident/buckets": {
    "template|60": [
      {
        "time|+60000": 1497361859610,
        "count|1-10": 1,
        "granularity": 43200000,
      }
    ]
  },
  //动作列表删除一条数据
  "/action/delete": {
    "template|1-10": [
      {
        "id": "@cname",
        "tenant": "e10adc3949ba59abbe56e057f20f88dd",
        "actionName": "@cname",
        "description": "111",
        "scope": [
          1, 2
        ],
        "builtIn": false,
        "opened": true
      }
    ]
  },
  //导出文件
  "/action/exportFile": {
    "template": true
  },
  //导入文件
  "/action/importFile": {
    "template": {
      "sameNameCount": 1, //同名数量
      "count": 2, //总数量
      "list": [{
        "id": "59b10fa5adacb74b4b77f5d3",
        "tenant": "e10adc3949ba59abbe56e057f20f88dd",
        "actionName": "123",
        "description": "111",
        "scope": [
          1, 2
        ],
        "builtIn": false,
        "opened": true,
        "hasSameName": true
      },
      {
        "id": "59b111c4adacbf78a40044e4",
        "tenant": "e10adc3949ba59abbe56e057f20f88dd",
        "actionName": "1232",
        "description": "111",
        "scope": [
          1
        ],
        "builtIn": false,
        "opened": true,
        "hasSameName": false
      }]
    }
  },
  //上传动作文件
  "/action/uploadActionJar": {
    "template": true
  },
  //切换按钮
  "/action/changeOpenedFlag": {
    "template": true
  },
  //判断是否同名
  "/action/uploadActionJarNameCheck": {
    "template": true
  },
  //编辑动作
  "/action/edit": {
    "template": {
      "id": "59b111c4adacbf78a40044e4",
      "description": "dsfsfdasfs",
      "actionName": "ssss",
      "scope": [
        1,
        2
      ]
    }
  },
  //完成导入
  "/action/importActionByIds": {
    "template": {
      "failCount": 2, //失败数量
      "failedList": [ //失败信息列表
        {
          "name": "123", //名称
          "message": "服务器内部错误" //错误原因
        },
        {
          "name": "12323",
          "message": "服务器内部错误"
        }
      ],
      "successCount": 0 //成功数量
    }
  },
  //动作管理列表
  "/action/queryActionConfigs": {
    "template|1-10": [
      {
        "id": "@cname",
        "tenant": "e10adc3949ba59abbe56e057f20f88dd",
        "actionName": "@cname",
        "description": "111",
        "scope": [
          1, 2
        ],
        "builtIn": false,
        "opened": true
      }
    ]
  },

  "/incident/queryLastTimeline": {
    template: function (params) {
      console.log(params, 'queryLastTimeline'); return Mock.mock({
        template: {
          "tagKeys": [],
          "hasNext|1": [true],
          "levels": {
            "OK|1-10": 1,
            "Critical|1-10": 1,
            "Warning|1-10": 1,
            "Information|1-10": 1,
          },
          "properties": {
            "name": "告警-@string(5,10)",
            "type": "@name",
            "cols": [],
            "id": "@string(12)",
            "name": "@cname"
          },
          "datas|40": [
            {
              "alias": "@string(5)",
              "classCode": "@string(5)",
              "count|1-1000": 1,
              "description": "@sentence()",
              "entityAddr": "@address",
              "entityName": "告警-@cname",
              "firstOccurTime|1502035200524-1502812800524": 1,
              "lastOccurTime|1502035200524-1502812800524": 1,
              "lastTime|0-1200000": 1,
              "hasChild|1": [false, false, false, true],
              "id": "@id",
              "name": "@string(20)",
              "resObjectId": "@string(12)",
              "severity|1": [0, 1, 2, 3],
              "source": "@cname",
              "status|1": ["0", "40", "150", "190", "255"],
              "ownerName": "@cname",
              "tags": [],
              "hasNext|1": [true, false],
              "timeLine|1-10": [
                {
                  "occurTime|+10000000": 1497361859610,
                  "count|1-10": 1,
                  "granularity": 43200000,
                  "severity|1": [0, 1, 2, 3],
                  "description": "@sentence",
                  "name": "告警发生-@cname",
                  "source": "告警来源-@cname",
                  "incidentId|1-40": 1,
                }
              ]
            }
          ],
        }
      })
    },
  },

  "/rule/queryAttributes": {
    regex: /\/rule\/queryAttributes?/,
    "template": [
      { "group": "base", "nameZh": "告警名称", "nameUs": "alias", "type": "str" },
      { "group": "base", "nameZh": "告警等级", "nameUs": "severity", "type": "num" },
      { "group": "base", "nameZh": "告警来源", "nameUs": "source", "type": "str" },
      { "group": "base", "nameZh": "告警发生源名称", "nameUs": "entityName", "type": "str" },
      { "group": "base", "nameZh": "告警发生源地址", "nameUs": "entityAddr", "type": "str" },
      { "group": "base", "nameZh": "告警描述", "nameUs": "description", "type": "str" },
      { "group": "base", "nameZh": "标签", "nameUs": "tag", "type": "str" },
      { "group": "base", "nameZh": "发生次数", "nameUs": "count", "type": "num" },
      { "group": "base", "nameZh": "告警状态", "nameUs": "status", "type": "num" },
      { "group": "source", "nameZh": "资源ID", "nameUs": "resObjectId", "type": "str" },
      { "group": "source", "nameZh": "资源类型", "nameUs": "classCode", "type": "str" },
      { "group": "property", "nameZh": "police", "nameUs": "belong", "type": "str" },
      { "group": "property", "nameZh": "所在地", "nameUs": "location", "type": "str" },
      { "group": "property", "nameZh": "资源ID", "nameUs": "id", "type": "str" },
      { "group": "property", "nameZh": "端口ID", "nameUs": "portId", "type": "str" },
      { "group": "property", "nameZh": "CI_ID", "nameUs": "ciid", "type": "str" }
    ]
  },

  "/rule/filterValue": {
    regex: /\/rule\/filterValue?/,
    template: ["name", "alias", "severity", "source", "status", "entityName", "entityAddr", "firstOccurTime", "lastOccurTime", "closeTime", "description", "mergeKey", "resolveMessage", "closeMessage", "remark", "isNotify", "classCode", "properties", "tags", "owner"]
  },



  "/incident/getIncidentDetail/": {
    regex: /\/incident\/getIncidentDetail\//,
    template: {
      "lastTime": 2155075354,
      "firstOccurTime": 1504252131991,
      "description": "system.cpu大于80%",
      "lastOccurTime": 1504252131991,
      "source": "基础资源监控",
      "notifyList": [
      ],
      "ciUrl": "http://10.1.51.101/cmdb/config.html#/59a901fe4f8102002e50472a",
      "ownerName": "zhangsf",
      "entityName": "126.1.1.135",
      "statusName": "已关闭",
      "alias": "126.1.1.135测试告警",
      "id": "14fb4421c09849f38d7cf42e81569f77",
      "severity": 1,
      "owner": "319057efa26a4af888a54f9996a9113f",
      "entityAddr": "126.1.1.135",
      "ci": [
        {
          "code": "名称",
          "value": "动环设备270"
        },
        {
          "code": "IP地址",
          "value": "126.1.1.135"
        },
        {
          "code": "location",
          "value": "AlertTest测试"
        },
        {
          "code": "ciId",
          "value": "59a901fe4f8102002e50472a"
        }
      ],
      "isNotify": false,
      "count": 1,
      "incidentLog": [
        {
          "incidentId": "14fb4421c09849f38d7cf42e81569f77",
          "operatorId": "e10adc3949ba59abbe56e057f20f88dd",
          "operatorName": "admin",
          "operateTime": 1506407207000,
          "operateType": 250,
          "attributes": {
            "resolveType": 1,
            "message": "111"
          }
        },
        {
          "incidentId": "14fb4421c09849f38d7cf42e81569f77",
          "operatorId": "e10adc3949ba59abbe56e057f20f88dd",
          "operatorName": "admin",
          "operateTime": 1505901547000,
          "operateType": 210,
          "attributes": {
            "toUser": "zhangsf"
          }
        },
        {
          "incidentId": "14fb4421c09849f38d7cf42e81569f77",
          "operatorId": "e10adc3949ba59abbe56e057f20f88dd",
          "operatorName": "admin",
          "operateTime": 1504505769000,
          "operateType": 170,
          "attributes": {
            "resolveType": 1,
            "message": "1"
          }
        },
        {
          "incidentId": "14fb4421c09849f38d7cf42e81569f77",
          "operatorId": "e10adc3949ba59abbe56e057f20f88dd",
          "operatorName": "admin",
          "operateTime": 1504505647000,
          "operateType": 200
        },
        {
          "incidentId": "14fb4421c09849f38d7cf42e81569f77",
          "operateTime": 1504252138000,
          "operateType": 10
        }
      ],
      "orderFlowNum": null,
      "parentId": false,
      "tags": [
        {
          "tenant": "e10adc3949ba59abbe56e057f20f88dd",
          "key": "source",
          "value": "基础资源监控",
          "keyName": "来源"
        },
        {
          "tenant": "e10adc3949ba59abbe56e057f20f88dd",
          "key": "派出所",
          "value": "西湖派出所",
          "keyName": "派出所"
        },
        {
          "tenant": "e10adc3949ba59abbe56e057f20f88dd",
          "key": "街道",
          "value": "文一路",
          "keyName": "街道"
        },
        {
          "tenant": "e10adc3949ba59abbe56e057f20f88dd",
          "key": "站点",
          "value": "文一路丰谭路路口",
          "keyName": "站点"
        },
        {
          "tenant": "e10adc3949ba59abbe56e057f20f88dd",
          "key": "层次",
          "value": "动环设备",
          "keyName": "层次"
        }
      ],
      "name": "126.1.1.135测试告警",
      "properties": [
        {
          "val": "杭州",
          "code": "location",
          "name": "所在地"
        },
        {
          "val": "59a901fe4f8102002e50472a",
          "code": "ciid",
          "name": "资源ID"
        }
      ],
      "status|1": ["0", "40", "150", "190", "255"],
    }
  },

  // 模拟当前登录用户身份，默认为admin
  '/dataService/getUserInfo': {
    template: {
      "tenantId": "@string(10)",
      "userId": "@string(15)",
      "realName": "admin",
      "apiKeys": [
        "e10adc3949ba59abbe56e057f2gg88dd",
        "9cc4871e46094635a19d26557f9bb7f4"
      ],
      "root": true,
      "supervisor|1": ["1"]
    }
  },

  '/treeMap/getAllView': {
    "template|5-10": [{
      "id": "@id",
      "name": "@cname",
      "icon|1": ["yingyong", "wangluo", "shitu", "hexin", "waiwei", "anquan"],
      "tagIds|1-10": ["@string(10)"]
    }]
  },

  '/treeMap/saveView': {
    "template": {
      msg: "保存成功"
    }
  },

  // '/treeMap/updateView': {
  //   "template": {
  //     msg: "更新成功"
  //   }
  // },

  '/treeMap/deleteView': {
    "template": {
      msg: "删除成功"
    }
  },

  '/treeMap/getView': {
    "template": {
      id: '@id',
      name: '@cname',
      "icon|1": ["yingyong", "wangluo", "shitu", "hexin", "waiwei", "anquan"],
      "tags|1-10": [{
        id: '@id',
        value: '@cname',
        'key|1': ['街道', '站点', '派出所']
      }]
    }
  },
  '/treeMap/tags/allKeys': {
    "template|1-10": [
      {
        keyName: "@cname",
        'key|1': ['街道', '站点', '派出所']
      }
    ]
  },
  '/alert/queryOriginalAlert': {
    regex: /\/alert\/queryOriginalAlert/,
    "template": {
      "records|1-20": [
        {
          "occurTime|+10000000": 1497361859610,
          "id": "@id",
          "entityName": "@cname",
          "entityAddr": "@string(8)",
          "description": "@string(10)"
        }
      ]
    }
  },

  '/incident/merge': {
    "template": {
      result: true
    }
  },

  '/incident/decompose': {
    "template": {
      result: true
    }
  },

  '/incident/close': {
    "template": {
      result: true
    }
  },

  '/incident/query/childs': {
    regex: /\/incident\/query\/childs/,
    "template|1-5": [
      {
        "alias": "@string(5)",
        "classCode": "@string(5)",
        "count|1-1000": 1,
        "description": "@sentence()",
        "entityAddr": "@address",
        "entityName": "告警-@cname",
        "firstOccurTime|1502035200524-1502812800524": 1,
        "lastOccurTime|1502035200524-1502812800524": 1,
        "lastTime|0-1200000": 1,
        "hasChild|1": [false, false, false, true],
        "id": "@id",
        "name": "@cname",
        "resObjectId": "@string(12)",
        "severity|1": [0, 1, 2, 3],
        "source": "@cname",
        "status|1": ["0", "40", "150", "190", "255"],
        "ownerName": "@cname",
        "tags": [],
        "hasNext|1": [true, false],
        "timeLine|1-10": [
          {
            "occurTime|+10000000": 1497361859610,
            "count|1-10": 1,
            "granularity": 43200000,
            "severity|1": [0, 1, 2, 3],
            "description": "@sentence",
            "name": "告警发生-@cname",
            "source": "告警来源-@cname",
            "incidentId|1-40": 1,
          }
        ]
      }
    ]
  },

  '/incident/tempIncidentListCount': {
    'template': [
      {
        "count|1-100": 1,
        "severity": 0
      },
      {
        "count|1-100": 1,
        "severity": 1
      },
      {
        "count|1-100": 1,
        "severity": 2
      },
      {
        "count|1-100": 1,
        "severity": 3
      }
    ]
  },

  '/rule/svRule': {
    'template': {
      result: true
    }
  },

  '/common/getUsersByUserIds': {
    'template|1-1':
    [
      {
        "apiKeys": [
          "e10adc394fdfa56e057f20f88dd",
          "e10adc39gggadadsddddddd88dd"
        ],
        "email": "xulj@broada.com",
        "realName": "@cname",
        "root": false,
        "tenantId": "e10adc3949ba59abbe56e057f20f88dd",
        "userId": "322783deed3342d79ff9123f00b72118"
      }
    ]
  },

  '/common/getUsers': {
    regex: /\/common\/getUsers/,
    'template|1-5':
    [
      {
        "apiKeys": [
          "e10adc394fdfa56e057f20f88dd",
          "e10adc39gggadadsddddddd88dd"
        ],
        "email": "xulj@broada.com",
        "realName": "@cname",
        "root": false,
        "tenantId": "@id",
        "userId": "@id"
      }
    ]
  }
}