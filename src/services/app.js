import { request } from '../utils'
import {stringify} from 'qs'

export async function getUserInformation() {
  return request(`/dataService/getUserInfo`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 获取所有用户信息
export async function getUsers(params) {
  return request(`/common/getUsers?${stringify(params)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 更具id数组获取用户列表
export async function getUsersByIds({ userIds }) {
  return request('/common/getUsersByUserIds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { userIds }
  })
}

// web notification
export async function getWebNotification(params) {
  return request(`/common/getWebNotification?${stringify(params)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}