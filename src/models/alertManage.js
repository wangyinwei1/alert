import { queryDashbord } from '../services/alertManage'
import { isSetUserTags } from '../services/alertTags.js'
import { getAllView } from '../services/treeMap'
import { message } from 'antd'
import {parse} from 'qs'
import pathToRegexp from 'path-to-regexp';

const defaultFilter = {
  selectedTime: 'lastOneHour',
  selectedStatus: 'NEW'
}

const initialState = {
    isSetAlert: false, // 是否设置过告警标签
    hideAlertSetTip: true, // 设置提示false有提示
    modalVisible: false,
    currentDashbordData: undefined,
    oldDashbordDataMap: undefined,
    isNeedRepaint: true, // 是否需要重绘
    isLoading: true, //加载
    selectedTime: (JSON.parse(localStorage.getItem('UYUN_Alert_MANAGEFILTER')) || defaultFilter).selectedTime, // 选择的最近时间
    selectedStatus: (JSON.parse(localStorage.getItem('UYUN_Alert_MANAGEFILTER')) || defaultFilter).selectedStatus, // 选择的过滤状态
    isFullScreen: false, //是否全屏
    isFixed: true, //是否固定
    levels: { },
    currentViewId: undefined
}

export default {
  namespace: 'alertManage',

  state: initialState,

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathToRegexp('/alertManage/:id').test(location.pathname)) {
          const match = pathToRegexp('/alertManage/:id').exec(location.pathname);
          const id = match[1];
          dispatch({
            type: 'alertManageSetup',
            payload: { id }
          });
        }
      })
    }
  },

  effects: {
    *alertManageSetup({payload={}}, {put, call, select}) {
      let { selectedTime, selectedStatus, isShowMask } = yield select( state => {
        return {
          'selectedTime': state.alertManage.selectedTime,
          'selectedStatus': state.alertManage.selectedStatus,
          'isShowMask': state.app.isShowMask
        }
      })
      if(!payload.id) {
        const viewsRes = yield getAllView();
        if(viewsRes.result && viewsRes.data.length > 0) {
          payload.id = viewsRes.data[0].id;
        }
      }
      if(!isShowMask) {
        yield put({
          type: 'setCurrentViewId',
          payload: payload && payload.id
        })
        yield put({
          type: 'queryAlertDashbord',
          payload: {
            selectedTime: selectedTime,
            selectedStatus: selectedStatus,
            id: payload && payload.id
          }
        })
        yield put({
          type: 'toggleAlertSetTip',
          payload: true
        })
        yield put({
          type: 'toggleAlertSet',
          payload: true
        })
      } else {
        yield put({
          type: 'toggleAlertSetTip',
          payload: false
        })
        yield put({
          type: 'toggleAlertSet',
          payload: false
        })
      }
    },
    *queryAlertDashbord({payload}, {call, put, select}) {

      let { selectedTime, selectedStatus, isFixed, currentViewId } = yield select( state => {
        return {
          'selectedTime': state.alertManage.selectedTime,
          'selectedStatus': state.alertManage.selectedStatus,
          'currentViewId': state.alertManage.currentViewId,
          'isFixed': state.alertManage.isFixed
        }
      })

      if (payload !== undefined && payload.selectedTime !== undefined) {
        selectedTime = payload.selectedTime
      }

      if (payload !== undefined && payload.selectedStatus !== undefined) {
        selectedStatus = payload.selectedStatus
      }

      const params = {
        timeBucket: selectedTime,
        status: selectedStatus
      }
      if(payload && payload.id) {
        params.viewId = payload.id;
        yield put({
          type: 'setCurrentViewId',
          payload: payload.id
        })
      } else {
        params.viewId = currentViewId;
      }
      localStorage.setItem('UYUN_Alert_MANAGEFILTER', JSON.stringify({
        selectedTime: params.timeBucket,
        selectedStatus: params.status
      }))

      const treemapData = yield queryDashbord(params)

      if (treemapData.result) {
        let filterData = [];
        let index = 0;
        if (treemapData.data && treemapData.data.picList && treemapData.data.picList.length !== 0) {
          let dashbordData = treemapData.data.picList
          // 使用JSON方法进行深克隆
          dashbordData = JSON.parse(JSON.stringify(dashbordData))

          dashbordData.forEach( (item) =>{
            index ++;
            if(item.children){
              item.children.forEach((childItem) => {
                if(isFixed) {
                  childItem.fixedValue = 1 * ((item.children.length + 1) / item.children.length)
                  item.fixedValue = (item.fixedValue ? item.fixedValue : 0) + ((item.children.length + 1) / item.children.length)
                }
                // 保存真实数据修复显示tip 告警数不正确bug
                childItem.trueVal =  childItem.value;
                // 防止path重复（当标签对应的拼音一样可能会导致path重复，会导致一些格子不显示）
                childItem.path = childItem.path + "_" + index;
                // childItem.id = "label_" + index;
                index ++;
              })
              // item.fixedValue = item.children.length
            }

          })

          filterData = yield dashbordData.filter( item => item['path'] != 'status' )
        }

        yield put({
          type: 'setCurrentTreemap',
          payload: {
            currentDashbordData: filterData || [],
            isLoading: false,
            selectedTime: selectedTime,
            selectedStatus: selectedStatus,
            isNeedRepaint: payload && payload.isNeedRepaint
          }
        })

        yield put({
          type: 'setLevels',
          payload: {
            levels: {
              totalOkCnt: treemapData.data ? treemapData.data.totalOkCnt : 0, // 恢复
              totalCriticalCnt: treemapData.data ? treemapData.data.totalCriticalCnt : 0, // 紧急
              totalWarnCnt: treemapData.data ? treemapData.data.totalWarnCnt : 0, // 警告
              totalInfoCnt: treemapData.data ? treemapData.data.totalInfoCnt : 0, // 提醒
            }
          }
        })

      } else {
        yield message.error(treemapData.message, 2)
      }
    }
  },

  reducers: {
    setCurrentViewId(state, { payload: currentViewId }) {
      return { ...state, currentViewId };
    },
    // 显示标签设置
    toggleAlertSet(state, { payload: isSetAlert }){
      return { ...state, isSetAlert }
    },
    // 显示treemap
    setCurrentTreemap(state, { payload: {currentDashbordData, isLoading, selectedTime, selectedStatus, isNeedRepaint} }){
      const oldDashbordData = state.currentDashbordData || [];
      let oldDashbordDataMap = {};
      let newDashbordDataMap = {};
      oldDashbordData.forEach((parentNode, index) => {
          parentNode.children.forEach((childNode) => {
              oldDashbordDataMap[childNode.id] = childNode;
          })
      })
      currentDashbordData.forEach((parentNode, index) => {
          parentNode.children.forEach((childNode) => {
              newDashbordDataMap[childNode.id] = childNode;
          })
      })
      // 判断标签是否发生变化，是否需要重绘
      if(typeof isNeedRepaint === 'undefined') {
        currentDashbordData.forEach((parentNode, index) => {
            parentNode.children.forEach((childNode) => {
                if(!oldDashbordDataMap[childNode.id]) {
                  isNeedRepaint = true;
                }
            })
        })
        oldDashbordData.forEach((parentNode, index) => {
            parentNode.children.forEach((childNode) => {
                if(!newDashbordDataMap[childNode.id]) {
                  isNeedRepaint = true;
                }
            })
        })
      }

      return { ...state, oldDashbordDataMap, isNeedRepaint, currentDashbordData, isLoading, selectedTime, selectedStatus}
    },
    setSelectedTime(state, {payload: selectedTime}) {
      return { ...state, selectedTime}
    },
    setSelectedStatus(state, {payload: selectedStatus}) {
      return { ...state, selectedStatus}
    },
    // 设置告警状态
    setLevels(state, {payload}) {
      return { ...state, ...payload }
    },
    // 隐藏标签设置提示
    toggleAlertSetTip(state, { payload: hideAlertSetTip }){
      return { ...state, hideAlertSetTip }
    },
    // 设置全屏
    setFullScreen(state){
      return {...state, isFullScreen: !state.isFullScreen}
    },
    // 设置布局（固定大小和自动布局）
    setLayout(state,{payload: isFixed}){
      const cloneData = JSON.parse(JSON.stringify(state.currentDashbordData))

      if(isFixed == '0'){
          cloneData.forEach( (item) =>{
            if(item.children){
              item.children.forEach((childItem) => {
                childItem.fixedValue = 1
                // 保存真实数据修复显示tip 告警数不正确bug
                childItem.trueVal =  childItem.value
                item.fixedValue = (item.fixedValue ? item.fixedValue : 0) + 1
              })
              // item.fixedValue = item.children.length
            }

        })
      }else{
        cloneData.forEach( (item) =>{
          if(item.children){
              item.children.forEach((childItem) => {
                delete childItem.fixedValue
              })
            }
          delete item.fixedValue
        })
      }

      return {...state, currentDashbordData: cloneData, isFixed: isFixed == '0' ? true : false}

    }
  }

}
