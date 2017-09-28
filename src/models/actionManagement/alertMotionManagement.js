import { parse } from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import {
  queryActionList,
  deleteApp,
  changeOpenedFlag,
  uploadActionJar,
  exportFile,
  importActionByIds,
  editAction,
} from '../../services/alertMotionManagement';
import _ from 'lodash'

const initalState = {
  isLoading: false,//列表加载中...
  actionManagementTotal: 0,//列表数量
  currentDeleteApp: {}, // 删除操作的app
  isShowDeteleModal: false,//删除弹框是否显示
  orderBy: undefined, // 排序字段
  orderType: undefined, // 1 --> 升序
  actionListData: [],//当前数据的储存->为删除数据做准备
  saveExportSelectedRowIds: '',//导出列表选中的数据
  sortOrder: false,//排序
}
export default {
  namespace: 'alertMotionManagement',

  state: initalState,

  subscriptions: {
    associationRulesSetup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/alertConfig/alertMotionManagement') {
          dispatch({
            type: 'queryMotionManagement',
            payload: {}
          })
        }
      })
    },
  },
  effects: {
    *sortTable({ payload }, { select, put, call }) {
      yield put({
        type: 'queryMotionManagement',
        payload
      })
    },
    *queryMotionManagement({ payload }, { select, put, call }) {
      yield put({ type: 'toggleLoading', payload: true })
      //?order='name'&orderType='1' 拼接
      let requestParameter = '';
      if (payload.orderBy && payload.orderType) {
        const orderType = payload.orderType == "descend" ? 0 : 1;
        requestParameter = `?orderBy=${payload.orderBy}&orderType=${orderType}`;
      }
      //列表请求
      const actionResult = yield call(queryActionList, requestParameter);
      yield put({ type: 'clear' });
      yield put({
        type: 'changeSortOrder',
        payload: {
          sortOrder: payload.order
        }
      })
      if (actionResult.result) {
        yield put({
          type: 'setActionListData', payload: {
            actionListData: actionResult.data,
            actionManagementTotal: actionResult.data.length
          }
        })
      } else {
        yield message.error(actionResult.message, 2)
      }
      yield put({ type: 'toggleLoading', payload: false })
    },

    *exportFile({ payload }, { select, put, call }) {
      const idsArray = payload.ids.split(',');
      let url = window.location.protocol + '//' + window.location.host + '/alert/api/v2/action/exportFile?';
      idsArray.map((d, i) => {
        if (d) {
          url += `ids=${d}`;
          (i < (idsArray.length - 1)) && (url += '&');
        };
      });
      window.location.href = url;
    },

    // 更改启用状态
    *changeStatus({ payload }, { select, put, call }) {
      if (payload !== undefined && payload.id !== undefined && payload.opened !== undefined) {
        const statusResult = yield call(changeOpenedFlag, payload)

        if (statusResult.result) {
          yield put({
            type: 'changeActionStatus',
            payload: {
              id: payload.id,
              opened: payload.opened
            }
          })
        } else {
          yield message.error(statusResult.message, 2)
        }
      } else {
         yield message.error(actionResult.message, 2)
      }
    },
    // 删除时的操作
    *deleteApp({ payload }, { select, put, call }) {
      const { currentDeleteApp } = yield select(state => {
        return {
          'currentDeleteApp': state.alertMotionManagement.currentDeleteApp,
        }
      })
      if (Object.keys(currentDeleteApp).length !== 0 && currentDeleteApp.id !== undefined) {
        const deleteResult = yield call(deleteApp, currentDeleteApp.id)
        if (deleteResult.result) {
          yield put({
            type: 'deleteApplication',
            payload: currentDeleteApp.id
          })
        } else {
          yield message.error(deleteResult.message, 2)
        }
      } else {
         yield message.error(actionResult.message, 2)
      }
    },

  },

  reducers: {
    //排序改变状态
    changeSortOrder(state, { payload: { sortOrder } }) {
      return { ...state, sortOrder }
    },
    // 改变状态
    changeActionStatus(state, { payload: { id, opened } }) {
      const { actionListData } = state;
      const newData = _.filter(actionListData, (item) => {
        if (item.id == id) {
          item.opened = opened;
        }
        return item;
      })
      return { ...state, actionListData: newData }
    },
    // 加载状态
    toggleLoading(state, { payload: isLoading }) {
      return { ...state, isLoading }
    },
    //查询列表数据
    setActionListData(state, { payload }) {
      return { ...state, ...payload }
    },
    //保存导出选择的id
    setSaveExportSelectedRowIds(state, { payload: { ids } }) {
      return { ...state, saveExportSelectedRowIds: ids }
    },
    // 删除
    deleteApplication(state, { payload }) {
      const { actionListData } = state;
      const newData = _.filter(actionListData, (item) => {
        let status = true;
        if (item.id == payload) {
          status = false;
        }
        return status;
      })
      return { ...state, actionListData: newData, actionManagementTotal: newData.length, isShowDeteleModal: false }
    },

    clear(state, { payload }) {
      return initalState
    },
    // 关闭modal
    toggleDeleteModal(state, { payload: { applicationItem, status } }) {
      return { ...state, currentDeleteApp: applicationItem, isShowDeteleModal: status }
    },
  },
}
