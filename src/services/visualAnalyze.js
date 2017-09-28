import { request } from '../utils'

// 获取标签
export async function queryTags(params) {
  return request(`/visual/storeKeys`, {
    method: 'post',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  // return Promise.resolve({
  //   result: true,
  //   data: {"level":4,"keys":["派出所","层次","街道"]}
  // })
}


export async function queryVisual(params) {
  return request('/visual/tagValuesInfo', {
    method: 'post',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  // return Promise.resolve({
  //   result: true,
  //   data: [{"tagValue":"西湖派出所","severity":3,"values":[{"value":"动环设备","severity":3},{"value":"网络设备","severity":3},{"value":"摄像机","severity":3}]}]
  // })
}
// 获取资源列表（根据标签）
export async function queryVisualRes(params) {
  return request(`/visual/resStateInfo`, {
    method: 'post',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  // .then(response => ({
  //   ...response,
  //   data: response.data.map(item => ({
  //     ...item,
  //     resources: item.resources.map(res => ({
  //       ...res,
  //       iconUrl: 'http://10.1.50.58/cmdb/api/v3/attachments/download/593e58dbe454c73982636da1.png'
  //       // iconUrl: 'http://images.google.com/intl/en_ALL/images/logos/images_logo_lg.gif'
  //     }))
  //   }))
  // }))
}
// 根据资源ID查询属性信息
export async function queryResInfo(params) {
  return request(`/visual/resInfo`, {
    method: 'get',
    body: params
  })
}

// 根据资源获取故障列表
export async function queryAlertList(params) {
  return request(`/visual/resIncidents`, {
    method: 'get',
    body: params
  })
}

