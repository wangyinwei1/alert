import { queryTags, queryVisual, queryVisualRes, queryResInfo, queryAlertList } from '../services/visualAnalyze'

import { queryConfigAplication, changeAppStatus, deleteApp, typeQuery, add, update, view } from '../services/alertConfig'
import { parse } from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

const initalState = {
  groupList: [],
  tags: [],
  //  isFirst: false, //是否从其他页面进入
  resList: [],
  pageSize: 20,
  isShowFouth: false,
  incidentGroup: true,
  tagsLevel: 1,
  lessLevel: 0,
  tasgFitler: '',
  resInfo: [],
  alertList: '',
  hoverId: undefined, // 鼠标所在的设备编号，showAlertList后设置的
}

// 保存标签分组选择
const setGroups = (gr2, gr3, gr4) => {
  gr2 && localStorage.setItem("__alert_visualAnalyze_gr2", gr2)
  gr3 && localStorage.setItem("__alert_visualAnalyze_gr3", gr3)
  gr4 && localStorage.setItem("__alert_visualAnalyze_gr4", gr4)
}


export default {
  namespace: 'visualAnalyze',

  state: initalState,

  subscriptions: {
    init({ dispatch, history }) {
      history.listen((location, state) => {
        if (pathToRegexp('/alertManage/alertList').test(location.pathname)) {
          // ---------- 之所以要在这里重置 __alert_visualAnalyze_gr1 来处理浏览器强刷的情况--------- //
          let alertListPath = JSON.parse(localStorage.getItem('alertListPath')) || {}
          let array = Object.values(alertListPath)
          if (array.length === 1) {
            let gr1 = array.filter(item => item.keyName !== 'source').map( item => {
              item.value = item.values
              delete item.values
              delete item.keyName
              return item
            })
            localStorage.setItem('__alert_visualAnalyze_gr1', JSON.stringify(gr1))
          }
          // ------------------------------------------------------------------------------------ //
          dispatch({
            type: 'queryVisualList',
            payload: { isFirst: true }
          })
        }
      });
    },
  },

  effects: {
    *queryVisualList({ payload }, { select, put, call }) {
      // {"key":"source", "value": "古荡派出所"}
      let level
      let tags
      let gr2 //分组1
      let gr3 //分组2
      let gr4

      // const isFirst = yield select(state => {
      //   return state.visualAnalyze.isFirst
      // })
      const { isFirst, showIncidentGroup } = payload

      const visualSelect = JSON.parse(localStorage.getItem("__alert_visualAnalyze_gr1")) || [];

      // isFirst表示从重新查询 否则为select切换选择
      if (isFirst) {
        // 初始化状态
        yield put({
          type: 'init'
        })

        const tagsData = yield call(queryTags, {
          tags: visualSelect
        })

        if (tagsData.result) {

          const data = tagsData.data
          level = data.level
          tags = data.keys

          // 判断用户是否访问过类似路径 如果匹配到用户之前的路径直接使用
          // 比如 用户从 派出所-街道-站点 则存为一条路径
          // 派出所，来源-街道-站点 则存另为一条路径
          // 第一个分组key作为存储用户路径的依据

          // construction
          let gr1key = visualSelect.map(item => {
            return item.key
          })
          let userRecord = localStorage.getItem(gr1key.join())
          if (userRecord) {
            const userStore = JSON.parse(userRecord)
            gr2 = userStore.gr2key
            gr3 = userStore.gr3key
            gr4 = userStore.gr4key
          } else {
            // 这个是正常流程 默认取值
            gr2 = tags[0]
            gr3 = tags[1]
          }


          // 默认选择标签
          setGroups(gr2, gr3, gr4)

          yield put({
            type: 'updateSelect',
            payload: {
              lessLevel: level - visualSelect.length,
              tags,
              level
            }
          })
        } else {
          message.error(tagsData.message)
        }

      } else {
        const { l, t } = yield select(state => {
          const visualAnalyze = state.visualAnalyze

          return {
            l: visualAnalyze.tagsLevel,
            t: visualAnalyze.tags
          }
        })
        level = l
        tags = t
      }

      let groupList = []

      const isShowIncidentGroup = yield select(state => {
        return state.visualAnalyze.incidentGroup
      })


      // 如果标签层级小于指定层级
      // 这里的3是前面2层分组加上设备的1层分组
      // visualSelect 是热图以及tagsFileter选择的条件 如果选择了2个维度就是 最终的层级为2 + 3
      // 如果选择的标签比较多，那么就直接查询resource
      if (level < visualSelect.length + 2) {
        let val
        const gr1 = JSON.parse(localStorage.getItem("__alert_visualAnalyze_gr1")) || [];
        const gr2key = localStorage.getItem('__alert_visualAnalyze_gr2') ? localStorage.getItem('__alert_visualAnalyze_gr2') : tags[0]
        const gr3key = localStorage.getItem('__alert_visualAnalyze_gr3') ? localStorage.getItem('__alert_visualAnalyze_gr3') : tags[1]
        switch (level - visualSelect.length) {
          case 0:
            val = gr1
            break;
          case 1:
            val = gr1.concat([{ key: gr2key, value: '' }])
            break;
          case 2:
            val = gr1.concat([{ key: gr2key, value: '' }, { key: gr3key, value: '' }])
            break;
        }
        const res = yield call(queryVisualRes, { tags: val })
        const resList = res.data
        if (res.result) {
          yield put({
            type: 'updateResListDirectly',
            payload: {
              tagsLevel: level,
              isShowFouth: false,
              resList
            }
          })
        }

      } else {
        let pageSize = yield select(state => state.visualAnalyze.pageSize)
        let groupListData = yield call(queryVisual, {
          "incidentGroup": showIncidentGroup !== undefined ? showIncidentGroup : isShowIncidentGroup,
          tags: visualSelect.concat([
            { key: localStorage.getItem('__alert_visualAnalyze_gr2'), value: "" },
            { key: localStorage.getItem('__alert_visualAnalyze_gr3'), value: "" }
          ])
        })
        if (groupListData.result) {
          // 一级分组列表
          groupList = groupListData.data.map(item => {
            item.isExpand = true
            item.count = pageSize
            return item
          })
        } else {
          message.error(groupListData.message)
        }

        // 更新分组数据
        yield put({
          type: 'updateGroupList',
          payload: {
            groupList
          }
        })

      }


    },
    *queryVisualRes({ }, { select, put, call }) {
      const gr4key = localStorage.getItem('__alert_visualAnalyze_gr4')
      const tags = yield select(state => {
        const visualAnalyze = state.visualAnalyze

        return visualAnalyze.tags
      })
      const gr3Val = localStorage.getItem('__alert_visualAnalyze_gr3Val')
      const visualSelect = JSON.parse(localStorage.getItem("__alert_visualAnalyze_gr1")) || []

      let targetTags = visualSelect.concat([
        { key: localStorage.getItem("__alert_visualAnalyze_gr2"), value: localStorage.getItem('__alert_visualAnalyze_gr2Val') },
        { key: localStorage.getItem("__alert_visualAnalyze_gr3"), value: gr3Val },
        { key: gr4key ? gr4key : tags[0], value: '' }
      ])

      if (tags.length === 2) { // 区分三个标签展示设备和四个标签展示设备的区别
        targetTags = targetTags.slice(0, targetTags.length - 1)
      }
      const res = yield call(queryVisualRes, {
        tags: targetTags
      })

      const resList = res.data
      if (res.result) {
        yield put({
          type: 'updateResList',
          payload: {
            isShowFouth: true,
            tasgFitler: gr3Val,
            resList
          }
        })
      } else {
        message.error(res.message)
      }


    },
    *queryResInfo({ payload: { res } }, { select, put, call }) {

      const resInfo = yield call(queryResInfo, {
        resName: res
      })
      if (resInfo.result) {
        yield put({
          type: 'updateResInfo',
          payload: resInfo.data
        })
      } else {
        message.error(resInfo.message)
      }
    },
    *showAlertList({ payload }, { select, put, call }) {

      const alertList = yield call(queryAlertList, {
        resId: payload
      })

      if (alertList.result) {
        yield put({
          type: 'updateAlertList',
          payload: {
            list: alertList.data,
            resId: payload
          }
        })
      } else {
        message.error(alertList.message)
      }

    }

  },

  reducers: {
    init(state) {
      return {
        ...state,
        ...initalState
      }
    },

    addNums(state, {payload: {num, tagValue}}) {
      const groupList = state.groupList
      groupList.forEach(item => {
        if (item.tagValue === tagValue) {
          item.count = num
        }
      })
      return { ...state, groupList }
    },

    expandList(state, { payload: { index, isExpand } }) {
      let newGroupList = state.groupList.slice(0)
      newGroupList[index]['isExpand'] = isExpand
      return { ...state, newGroupList }
    },
    updateAlertList(state, { payload: {list, resId} }) {
      return {
        ...state,
        alertList: list,
        hoverId: resId
      }
    },

    updateIncidentGroup(state, { payload: isChecked }) {

      return {
        ...state,
        incidentGroup: isChecked
      }
    },
    updateGroupList(state, { payload: { groupList } }) {
      return {
        ...state,
        groupList
      }
    },
    updateSelect(state, { payload: { tags, level, lessLevel } }) {
      return {
        ...state,
        tags,
        tagsLevel: level,
        lessLevel
      }
    },
    updateResInfo(state, { payload }) {
      return {
        ...state,
        resInfo: payload
      }
    },
    // 显示tags列表
    redirectTagsList(state) {
      return {
        ...state,
        isShowFouth: false
      }
    },
    // 显示资源列表(有4层)
    updateResList(state, { payload: { isShowFouth, tasgFitler, resList } }) {

      return {
        ...state,
        isShowFouth,
        tasgFitler,
        resList
      }
    },
    // 显示资源列表(少于4层)
    updateResListDirectly(state, { payload: { tagsLevel, isShowFouth, resList } }) {

      return {
        ...state,
        tagsLevel,
        isShowFouth,
        resList
      }
    }
  }
}