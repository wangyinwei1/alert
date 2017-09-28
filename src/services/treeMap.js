import { request } from '../utils'

// 获取视图列表
export async function getAllView() {
  return request(`/treeMap/getAllView`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

// 获取视图详情
export async function getViewById(id) {
  return request(`/treeMap/getView`, {
    method: 'get',
    body: { id },
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

// 新增空白视图
export async function saveView({ name, icon }) {
  return request(`/treeMap/saveView`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, icon })
  });
}

// 更新视图
export async function updateView({ id, name, icon, tagIds }) {
  return request(`/treeMap/updateView`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body:  JSON.stringify({ id, name, icon, tagIds })
  });
}

// 删除视图
export async function deleteView({ id }) {
  return request(`/treeMap/deleteView`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { id }
  });
}