import { request, packURL } from '../utils'
import querystring from 'querystring';

export async function getFormOptions() {
  // let hostUrl = 'itsm.uyun.cn';

  // if (window.location.origin.indexOf("alert") > -1) {
  //     // 域名访问
  //     hostUrl = window.location.origin.replace(/alert/, 'itsm');

  // } else {
  //     // 顶级域名/Ip访问
  //     hostUrl = window.location.origin + '/itsm'
  // }
  // console.log(hostUrl)
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

export async function getChatOpsOptions() {
  // let hostUrl = 'alert.uyundev.cn';
  // let param = {};
  // let userInfo = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'));

  // if (window.location.origin.indexOf("alert") > -1) {
  //     // 域名访问
  //     hostUrl = window.location.origin.replace(/alert/, 'chatops');
  // } else {
  //     // 顶级域名/Ip访问
  //     hostUrl = window.location.origin
  // }
  // param = {
  //     url: `${hostUrl}/chatops/api/v2/chat/teams/%s/rooms`
  // }
  // console.log(hostUrl)
  const chatopsUrl = await request(`/dataService/rooms`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (chatopsUrl.result) {
    return request(`${chatopsUrl.data.url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } else {
    return chatopsUrl
  }
}

export async function shareRoom(roomId, incidentId, roomName, param) {
  // let hostUrl = 'alert.uyundev.cn';
  // let paramWrapper = {};
  // if (window.location.origin.indexOf("alert") > -1) {
  //     // 域名访问
  //     hostUrl = window.location.origin.replace(/alert/, 'chatops');

  // } else {
  //     // 顶级域名/Ip访问
  //     hostUrl = window.location.origin
  // }
  let paramWrapper = {
    roomId: '' + roomId,
    incidentId: incidentId,
    roomName: roomName,
    body: JSON.stringify(param)
  }

  return request(`/dataService/sendChatOps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paramWrapper)
  })
}

export async function dispatchForm(param) {
  return request(`/dataService/assignWO`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param)
  })
}

export async function close(param) {
  return request(`/incident/close`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param)
  })
  // return Promise.resolve({
  //   result: true,
  //   data: {
  //     result: true
  //   }
  // })
}

export async function resolve(param) {
  return request(`/incident/resolve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param)
  })
}

export async function merge(param) {
  return request(`/incident/merge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param)
  })
  // return Promise.resolve({
  //   result: true,
  // })
}

export async function relieve(param) {
  return request(`/incident/decompose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param)
  })
}

export async function suppress(param) {
  let wrapper = {
    ...param,
    holdupTime: param.time
  }
  return request(`/rule/svHoldupRule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wrapper)
  })
}

// 修改工单流水号
export async function changeTicket(params) {
  return request(`/incident/updateFlowNo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  })
}

// 工单详情URL
export async function viewTicket(code) {
  return request(`/incident/getITSMDetailUrl?orderFlowNum=${code}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

// 手工通知
export async function notifyOperate(params) {
  return request(`/dataService/manualNotify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  })
}


export async function takeOverService({ alertIds }) {
  return request('/incident/receive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ incidentIds: alertIds })
  })
  // return new Promise((resolve, reject) => {
  //   if (isSuccess) {
  //     resolve({
  //       result: true,
  //       data: alertIds
  //     });
  //   } else {
  //     reject({
  //       result: false,
  //       data: []
  //     });
  //   }
  // })
}

export async function reassignAlert({ toWho, incidentIds }) {
  return request('/incident/shift', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ toWho, incidentIds })
  })
}

// 检查批量操作是否可执行
export async function checkOperationExecutable({ operateCode, incidentIds }) {
  // return Promise.resolve({
  //   result: false,
  //   success: [{ msg: '可以接手' }],
  //   failed: [{
  //     msg: "此故障已被他人接手",
  //     errorCode: 1,
  //     entityName: "testIncident_0",
  //     name: "entityName_0"
  //   },{
  //     msg: "此故障已关闭",
  //     errorCode: 2,
  //     entityName: "testIncident_0",
  //     name: "entityName_0"
  //   }]
  // })
  return request('/incident/verifyOperation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ operateCode, incidentIds })
  })
}
