import { request } from '../utils'
import {stringify} from 'qs'

// 查询配置规则列表
export async function queryRulesList(params) {
  return request(`/rule/lsRuleIsShow?${stringify(params)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 更改状态
export async function changeRuleStatus(params) {
  return request(`/rule/cgEnable?ruleId=${params}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 删除
export async function deleteRule(params) {
  return request(`/rule/rmRuleById?ruleId=${params}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 获取用户列表
export async function getField(params) {
  return request(`/rule/filterValue`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 单条查询
export async function viewRule(params) {
  return request(`/rule/gtRuleById?ruleId=${params}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 创建规则
export async function createRule(params) {
  return request(`/rule/svRule`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
  })
}

// 获取工单
export async function getWos(params) {
  return request(`/dataService/wos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    if(response.data && response.data.error) {
      return { result: false, message: response.data.error.message };
    } else {
      return response;
    }
  })
  // return Promise.resolve({
  //   result: true,
  //   data: {"error":{"code":"500","message":"availableModelVOs Error"},"data":null}
  // }).then((response) => {
  //   if(response.data && response.data.error) {
  //     return { result: false, message: response.data.error.message };
  //   }
  // })
}

// 获取工单映射配置
export async function getshowITSMParam(params) {
  return request(`/rule/showITSMParam?modelId=${params.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

// 获取插件的配置
export async function getshowPluginParam(params) {
  return request(`/rule/getUIComponentById?id=${params.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

// 获取维度
export async function queryAttributes(params) {
  return request(`/rule/lsMatchField`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 获取资源类型
export async function getClasscode() {
  return request(`/rule/lsClassCode`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

export async function querySource() {
    return request(`/rule/lsSource`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

// 获取插件类型
export async function getPlugins() {
    return request(`/rule/getActionNameList`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

// 获取lsRelationId
export async function getlsRelationId() {
    return request(`/rule/lsRelationType`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

// 获取消费图列表
export async function getlsChartByTenantId() {
    return request(`/rule/lsChartByTenantId`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

// 获取消费图节点列表
export async function getlsCiByChartId(chartId) {
    return request(`/rule/lsCiByChartId?chartId=${chartId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
