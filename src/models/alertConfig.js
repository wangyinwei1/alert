import { queryConfigAplication, changeAppStatus, deleteApp, typeQuery, add, update, view, getTrapUrl, checkPayType } from '../services/alertConfig'
import { parse } from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

const initalState = {

  isLoading: false,
  applicationType: undefined, // 接入还是接出
  UUID: undefined, // UUID
  apikey: undefined,

  applicationTypeData: [], // 配置种类

  currentOperateAppType: {}, //配置的应用详情
  currentEditApp: {}, // 编辑的应用
  currentDisplayName: undefined, // 增加时点击生成UUID重新渲染需要保存displayname

  isShowTypeModal: false, // 配置的modal
  isShowDeteleModal: false, // 删除的modal
  currentDeleteApp: {}, // 删除操作的app

  columns: [{
    key: 'displayName',
  }, {
    key: 'name',
  }, {
    key: 'createDate',
    order: true
  }, {
    key: 'status',
    order: true
  }, {
    key: 'operation',
  }],

  applicationData: [],

  orderBy: undefined, // 排序字段
  orderType: undefined, // 1升序
}

export default {
  namespace: 'alertConfig',

  state: initalState,

  subscriptions: {
    alertAplicationSetup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/alertConfig/alertApplication') {
          dispatch({
            type: 'queryAplication',
            payload: { type: 0 }
          })
        } else if (pathToRegexp('/alertConfig/alertApplication/:type')) {
          const match = pathToRegexp('/alertConfig/alertApplication/:type').exec(location.pathname);
          if (match) {
            const type = match[1];
            dispatch({
              type: 'queryAplication',
              payload: { type }
            })
          }
        }
      })
    },
    addApplicationSetup({ dispatch, history }) {
      history.listen((location) => {
        if (pathToRegexp('/alertConfig/alertApplication/applicationView/add/:typeId').test(location.pathname)) {
          const match = pathToRegexp('/alertConfig/alertApplication/applicationView/add/:typeId').exec(location.pathname);
          const appTypeId = match[1];
          dispatch({
            type: 'addApplicationView',
            payload: appTypeId
          })
        }
      })
    },
    editApplicationSetup({ dispatch, history }) {
      history.listen((location) => {
        if (pathToRegexp('/alertConfig/alertApplication/applicationView/edit/:appId').test(location.pathname)) {
          const match = pathToRegexp('/alertConfig/alertApplication/applicationView/edit/:appId').exec(location.pathname);
          const appId = match[1];
          dispatch({
            type: 'editApplicationView',
            payload: appId
          })
        }
      })
    }
  },

  effects: {
    // 通过modal进入详情页
    *addApplicationView({ payload }, { select, put, call }) {
      const app = yield select(state => state.app)
      if (payload !== undefined) {
        yield put({
          type: 'setApiKeys',
          payload: (app.userInfo && app.userInfo.apiKeys && app.userInfo.apiKeys[0]) || undefined
        })
        yield put({ type: 'initalAddAppView', payload: { isShowTypeModal: false, uniqueCode: payload, UUID: undefined, webHook: {} } }) // isShowTypeModal -> false, currentOperateAppType -> Object
        const { currentOperateAppType } = yield select(state => {
          return {
            'currentOperateAppType': state.alertConfig.currentOperateAppType,
          }
        })
        // 如果是SNMP Trap
        switch (currentOperateAppType.name) {
          case 'SNMPTrap':
            const trapUrl = yield call(getTrapUrl)
            if (trapUrl.result) {
              yield put({ type: 'snmpTrapRules/setAppRules', payload: { trapUrl: trapUrl.data.url, appRules: [] } })
            } else {
              yield message.error(trapUrl.message, 3)
            }
            break;
          default:
            break;
        }
      } else {
        console.error('appTypeId is null')
      }
    },
    // 通过编辑进入详情页
    *editApplicationView({ payload }, { select, put, call }) {
      const app = yield select(state => state.app)
      if (payload !== undefined) {
        const viewResult = yield call(view, payload)
        if (viewResult.result) {
          yield put({
            type: 'setCurrent',
            payload: viewResult.data || {}
          })
          yield put({
            type: 'setApiKeys',
            payload: app.userInfo && app.userInfo.apiKeys && app.userInfo.apiKeys[0] || undefined
          })
          if (viewResult.data.applyType !== undefined) {
            switch (viewResult.data.applyType.name) {
              case 'SNMPTrap':
                const trapUrl = yield call(getTrapUrl)
                if (trapUrl.result) {
                  yield put({ type: 'snmpTrapRules/setAppRules', payload: { trapUrl: trapUrl.data.url, appRules: viewResult.data.appRules || [] } })
                } else {
                  yield message.error(trapUrl.message, 3)
                }
                break;
              default:
                break;
            }
          }
        } else {
          yield message.error(viewResult.message, 3)
        }
      } else {
        console.error('appId is null')
      }
    },
    // 新增应用
    *addApplication({ payload }, { select, put, call }) {
      const { UUID, currentOperateAppType, appRules } = yield select(state => {
        return {
          'UUID': state.alertConfig.UUID,
          'currentOperateAppType': state.alertConfig.currentOperateAppType,
          'appRules': state.snmpTrapRules.appRules
        }
      })

      const { formData, resolve } = payload;

      if (formData !== undefined && formData.displayName !== undefined) {
        if (UUID === undefined) {
          message.error(window.__alert_appLocaleData.messages['alertApplication.appKey.placeholder'], 3)
          return;
        }
        const params = {
          status: 1, // 默认启用
          integration: '',
          displayName: formData.displayName,
          applyType: {
            ...currentOperateAppType
          },
          type: currentOperateAppType.type,
          appKey: UUID
        }
        // 如果是SNMP Trap
        switch (currentOperateAppType.name) {
          case 'SNMPTrap':
            yield params.appRules = appRules;
            break;
          case 'Web Hook':
            params.webHook = formData.webHook;
            break;
          default:
            break;
        }
        const addResult = yield call(add, params)
        if (addResult.result) {
          yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3)
          resolve && resolve(addResult.result);
          yield put(routerRedux.push('alertConfig/alertApplication/' + params.type));
        } else {
          yield message.error(addResult.message, 3)
        }
        resolve && resolve(addResult.result);
      } else {
        resolve && resolve(false);
        console.error('displayName is null')
      }
    },
    // 编辑
    *editApplication({ payload }, { select, put, call }) {
      const { UUID, currentEditApp, appRules } = yield select(state => {
        return {
          'UUID': state.alertConfig.UUID,
          'currentEditApp': state.alertConfig.currentEditApp,
          'appRules': state.snmpTrapRules.appRules
        }
      })

      const { formData, resolve } = payload;

      if (formData !== undefined && formData.displayName !== undefined) {
        if (UUID === undefined) {
          yield message.error(window.__alert_appLocaleData.messages['alertApplication.appKey.placeholder'], 3)
        }
        const params = {
          id: currentEditApp.id,
          status: currentEditApp.status,
          integration: currentEditApp.integration,
          displayName: formData.displayName,
          applyType: {
            ...currentEditApp['applyType']
          },
          type: currentEditApp.type,
          appKey: UUID,
          webHook: formData.webHook
        }
        // 如果是SNMP Trap
        switch (currentEditApp.applyType.name) {
          case 'SNMPTrap':
            yield params.appRules = appRules;
            break;
          case 'Web Hook':
            params.webHook = formData.webHook;
            break;
          default:
            break;
        }
        const editResult = yield call(update, params)
        if (editResult.result) {
          yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3)
          resolve && resolve(true);
          yield put(routerRedux.goBack());
        } else {
          resolve && resolve(false);
          yield message.error(editResult.message, 3)
        }
      } else {
        resolve && resolve(false);
        console.error('displayName is null')
      }
    },
    // 查询
    *queryAplication({ payload }, { select, put, call }) {

      yield put({ type: 'toggleLoading', payload: true })

      var { type, orderBy, orderType, applicationType } = yield select(state => {
        return {
          'type': state.alertConfig.applicationType,
          'orderBy': state.alertConfig.orderBy,
          'orderType': state.alertConfig.orderType,
          'applicationType': state.alertConfig.applicationType
        }
      })

      if (payload !== undefined && payload.type !== undefined) {
        type = payload.type;
      } else {
        type = applicationType;
      }

      if (payload !== undefined && payload.orderType !== undefined) {
        orderType = payload.orderType;
        orderBy = payload.orderBy;
      }

      const params = {
        type: type,
        sortType: orderType,
        orderBy: orderBy
      }

      const appResult = yield call(queryConfigAplication, params)
      if (appResult.result) {
        yield put({
          type: 'setApplicationData', payload: {
            applicationData: appResult.data || [],
            applicationType: type,
            orderBy: orderBy,
            orderType: orderType,
          }
        })
      } else {
        yield message.error(appResult.message, 2)
      }

      yield put({ type: 'toggleLoading', payload: false })
    },
    *beforeQueryApplicationType({ payload }, { select, put, call }) {
      if (payload !== undefined && payload == 0) {
        const isRoot = yield call(checkPayType)
        if (isRoot.result) {
          if (!isRoot.data) {
            yield message.warn(window.__alert_appLocaleData.messages['alertApplication.incomingTotal.numberWarn'], 2)
            return false
          }
        } else {
          yield message.error(isRoot.message, 2)
          return false
        }
      }
      yield put({ type: 'queryAplicationType', payload: payload })
    },
    // 查询配置种类 --> 接入在判断前先查询是否有资格，免费用户只有5个名额
    *queryAplicationType({ payload }, { select, put, call }) {
      if (payload !== undefined) {
        yield put({ type: 'toggleTypeModal', payload: true })
        const typeResult = yield call(typeQuery, payload)
        if (typeResult.result) {
          if (payload == '1') {
            typeResult.data = typeResult.data.filter( item => item.type == 1 && item.uniqueCode != '2' && item.uniqueCode != '3' )
          }
          yield put({
            type: 'openTypeModal',
            payload: {
              applicationTypeData: typeResult.data || [], // 过滤ITSM和chatops
            }
          })
        } else {
          yield message.error(typeResult.message, 2)
        }
      } else {
        console.error('application type is null')
      }
    },
    // 更改启用状态
    *changeStatus({ payload }, { select, put, call }) {
      if (payload !== undefined && payload.id !== undefined && payload.status !== undefined) {
        const statusResult = yield call(changeAppStatus, payload)
        if (statusResult.result) {
          yield put({
            type: 'changeAppStatus',
            payload: {
              id: payload.id,
              status: payload.status
            }
          })
        } else {
          yield message.error(statusResult.message, 2)
        }
      } else {
        console.error('edit infomation is null')
      }
    },
    // 删除时的操作
    *deleteApp({ payload }, { select, put, call }) {
      const { currentDeleteApp } = yield select(state => {
        return {
          'currentDeleteApp': state.alertConfig.currentDeleteApp,
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
        console.error('application is null')
      }
    },
    //orderList排序
    *orderList({ payload }, { select, put, call }) {
      yield put({ type: 'queryAplication', payload: { orderBy: payload.orderBy, orderType: payload.orderType } })
    },
    //orderByTittle
    *orderByTittle({ payload }, { select, put, call }) {
      const { orderType } = yield select(state => {
        return {
          'orderType': state.alertConfig.orderType,
        }
      })
      if (payload !== undefined) {
        yield put({
          type: 'toggleOrder',
          payload: {
            orderBy: payload,
            orderType: orderType === undefined || orderType === 1 ? 0 : 1,
          }
        })
        yield put({ type: 'queryAplication' })
      } else {
        console.error('orderBy error')
      }
    }
  },

  reducers: {
    setApiKeys(state, { payload: apikey }) {
      return { ...state, apikey }
    },
    // 点开新增详情页面
    initalAddAppView(state, { payload: { isShowTypeModal, uniqueCode, UUID } }) {
      const { applicationTypeData } = state;
      let newObj = {};
      applicationTypeData.forEach((typeItem) => {
        typeItem.children.forEach((item) => {
          if (item.uniqueCode == uniqueCode) {
            newObj = item;
          }
        })
      })
      if(Object.keys(newObj).length == 0) {
        newObj.uniqueCode = uniqueCode;
      }
      return { ...state, isShowTypeModal, UUID, currentOperateAppType: newObj, currentDisplayName: undefined, webHook: {} }
    },
    // 回显
    setCurrent(state, { payload }) {
      return { ...state, currentEditApp: payload, UUID: payload.appKey }
    },
    // 打开配置modal
    openTypeModal(state, { payload: { applicationTypeData } }) {
      let typeObj = {};
      let newArr = [];
      let keys = [];
      applicationTypeData.forEach((typeItem) => {
        if (typeObj[typeItem.appType] !== undefined) {
          typeObj[typeItem.appType].push(typeItem)
        } else {
          typeObj[typeItem.appType] = [typeItem]
        }
      })
      keys = Object.keys(typeObj);
      keys.forEach((key) => {
        newArr.push({
          appType: key,
          children: typeObj[key]
        })
      })
      return { ...state, applicationTypeData: newArr }
    },
    // 关闭modal
    toggleTypeModal(state, { payload: isShowTypeModal }) {
      return { ...state, isShowTypeModal }
    },
    // 关闭modal
    toggleDeleteModal(state, { payload: { applicationItem, status } }) {
      return { ...state, currentDeleteApp: applicationItem, isShowDeteleModal: status }
    },
    // 加载状态
    toggleLoading(state, { payload: isLoading }) {
      return { ...state, isLoading }
    },
    // 排序
    toggleOrder(state, { payload }) {
      return { ...state, ...payload }
    },
    // 存贮当前的data
    setApplicationData(state, { payload: { applicationData, applicationType, orderBy, orderType, type } }) {
      return { ...state, applicationData, applicationType, orderBy, orderType, type }
    },
    // 改变状态
    changeAppStatus(state, { payload: { id, status } }) {
      const { applicationData } = state;
      const newData = applicationData.map((item) => {
        if (item.id == id) {
          item.status = + status
        }
        return item;
      })
      return { ...state, applicationData: newData }
    },
    // 删除
    deleteApplication(state, { payload }) {
      const { applicationData } = state;
      const newData = applicationData.filter((item) => {
        let status = true;
        if (item.id == payload) {
          status = false;
        }
        return status;
      })
      return { ...state, applicationData: newData, isShowDeteleModal: false }
    },
    setUUID(state, { payload: { UUID, currentDisplayName, webHook } }) {
      return { ...state, UUID: UUID, currentDisplayName: currentDisplayName, webHook }
    }
  },


}
