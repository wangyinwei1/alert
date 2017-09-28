import { request, packURL } from '../utils'
import {stringify} from 'qs'

export async function isSetUserTags() {
    return request(`/treeMap/tags/isSet`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    // return Promise.resolve({
    //   result: true,
    //   data: true
    // })
}

export async function getTagsByUser() {
    return request(`/treeMap/tags/chosen`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function setUserTags(tagObject) {
    return request(`/treeMap/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagObject)
    })
}

// 查询所有的Tags的Key
export async function getAllTagsKey() {
    return request(`/treeMap/tags/allKeys`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getTagValues(param) {
    return request(`/treeMap/tags/getTagValues?${stringify(param)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
