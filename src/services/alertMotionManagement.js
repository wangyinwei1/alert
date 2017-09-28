import { request } from '../utils'
import {stringify} from 'qs'

// 查询配置规则列表
export async function queryActionList(params) {

  return request(`/action/queryActionConfigs${params}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}
// 删除
export async function deleteApp(id) {
  const options = {
    body: JSON.stringify({id: id}),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/action/delete', options)
}
//上传文件
export async function uploadAction(params) {
  const options = {
    body: JSON.stringify(params),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/action/uploadAction', options)
}
//完成导入
export async function importActionByIds(params) {
  const options = {
    body: JSON.stringify(params),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/action/importActionByIds', options)
}
//导入文件
export async function importFile(params) {
  const options = {
    body: JSON.stringify(params),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/action/importFile', options)
}
//编辑动作
export async function editAction(params) {
  const options = {
    body: JSON.stringify(params),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/action/edit', options)
}
//改变切换按钮的状态
export async function changeOpenedFlag(params) {
  const options = {
    body: JSON.stringify(params),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/action/changeOpenedFlag', options)
}
//判断是否同名
export async function homonymousTest(params) {
  const options = {
    body: JSON.stringify(params),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/action/uploadActionJarNameCheck', options)
}

// 查询插件列表，在规则配置页面被使用
export async function queryActionListToOpen() {
  return request(`/action/queryOpenedActionConfigs`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}
