import { request } from '../utils'

export async function querySource() {
    return request(`/incident/querySourceTags`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function queryProperty() {
    return request(`/incident/getPropertiesDistinct`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function queryAlertList(params) {
    return request(`/incident/queryHistory`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
}

export async function queryCount(params) {
    return request(`/incident/queryIncidentCount`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
}

// 搜索查询条件
export async function queryFilters(params) {
  return request('/incident/queryCondition/getAll', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 保存查询条件
export async function saveFilter(filter, name) {
  return request('/incident/queryCondition/save/' + name, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filter)
  })
}

// 删除查询条件
export async function deleteFilter(id) {
  return request('/incident/queryCondition/remove/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function queryCloumns() {
    return request(`/incident/queryExtendedTag`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function queryAlertOrigin({ pagination: {pageNo, pageSize} = {}, sorter: {sortKey, sortType} = {}, alertId, searchParam={}} ) {
    let searchParamStr = "";
    Object.keys(searchParam).map((key) => { searchParam[key] && (searchParamStr += "&" + key + "=" + searchParam[key]) })
    return request(`/alert/queryOriginalAlert/` + alertId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: 'pageNo=' + pageNo + "&pageSize=" + pageSize + "&sortKey=" + sortKey + "&sortType=" + sortType + searchParamStr
    })
    // return Promise.resolve({
    //     result: true,
    //     data: {
    //         "pageNo": pageNo,
    //         "pageSize": 20,
    //         "totalPage": 1,
    //         "total": 100,
    //         "records": [{
    //             "id": "ad7a0c06e39144329158f5687b927945",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b9279451",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b9279452",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b92794523",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b92794524",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b92794525",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b92794526",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b92794527",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b92794528",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b92794529",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b9279452",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b927945210",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b927945211",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         },{
    //             "id": "ad7a0c06e39144329158f5687b927945212",
    //             "tenant": "e10adc3949ba59abbe56e057f20f88dd",
    //             "incidentId": "0df31065d0904ab0aef10ca8e4affc82",
    //             "severity": 1,
    //             "name": "邮件通知",
    //             "alias": "邮件通知",
    //             "source": "alertTest",
    //             "description": "是否能邮件通知",
    //             "occurTime": 1497605059572,
    //             "entityName": "邮件通知",
    //             "entityAddr": "1.1.1.2",
    //             "properties": [{
    //                 "val": "杭州",
    //                 "code": "location",
    //                 "name": "所在地"
    //             }],
    //             "mergeKey": "entity_name",
    //             "identifyKey": "",
    //             "appKey": "4rtgw1vf7iwkmw69a9tbbt1uiqho96wy"
    //         }]
    //     }
    // })
}
