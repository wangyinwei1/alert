import { request, packURL } from '../utils'
import { stringify } from 'qs'
import queryLastTimeline from '../../mock/queryLastTimeline.json'
import queryLastTimeline2 from '../../mock/queryLastTimeline2.json'
import buckets from '../../mock/buckets.json'

export async function queryAlertListTime(data) {
  const options = {
    body: JSON.stringify(data),
    method: 'post'
  }
  return request('/incident/queryLastTimeline', options)
}

// 查询告警柱状图
export async function queryAlertBar(data) {
  const options = {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post'
  }

  return request('/incident/buckets', options)
  // return Promise.resolve({
  //   result: true,
  //   data: buckets
  // })
}

// 查询告警列表(未分组)
export async function queryAlertList(data) {
  const options = {
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'post'
  }
  return request('/incident/queryLastTimeline', options)
  // return Promise.resolve({
  //   result: true,
  //   data: data.status === "0" ? queryLastTimeline : queryLastTimeline2
  // })
}

// 查询子告警
export async function queryChild(param) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }

  return request(`/incident/query/childs?${stringify(param)}`, options)
}

// 告警统计
export async function queryLevelStatistic({ begin, end, status, tags }) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ begin, end, status, tags })
  }

  return request(`/incident/tempIncidentListCount`, options);
}
