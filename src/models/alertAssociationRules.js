import {parse} from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import {
  queryRulesList,
  changeRuleStatus,
  deleteRule,
  viewRule,
  createRule,
  getWos,
  getField,
  queryAttributes,
  getshowITSMParam,
  getshowPluginParam,
  getClasscode,
  querySource,
  getPlugins
} from '../services/alertAssociationRules';
import {
  queryActionListToOpen
} from '../services/alertMotionManagement'
import {
  getUsers
} from '../services/app.js'
import {
  getChatOpsOptions
} from '../services/alertOperation';
import { groupSort } from '../utils'
import _ from 'lodash'

const initalState = {
  isLoading: false,
  columns: [
    {
      key: 'name'
    },
    {
      key: 'description'
    },
    {
      key: 'owner'
    },
    {
      key: 'enableIs',
      order: true
    },
    {
      key: 'operation'
    }
  ],
  associationRulesTotal: 0,
  associationRules: [], // 配置规则列表
  currentEditRule: {}, // 当前编辑的规则
  currentDeleteRule: {},
  isShowDeleteModal: false,
  orderBy: undefined, // 排序字段
  orderType: undefined, // 1 --> 升序
  users: [], // 用户列表
  source: [], // 来源列表
  attributes: [], // 维度列表
  field: [], // 映射字段
  rooms: [], // chatOps 群组
  wos: [], // 工单类型
  plugins: {}, //插件类型 actionsForHistory: [] actionsForNew: []
  classCode: [], // 资源类型
  ITSMParam: {}, // 映射配置
  PluginParam: {}, // 插件配置
  actions: {}, // 动作列表（新告警和历史告警不同，需要区分开）
}

function isArray(array) {
  return Object.prototype.toString.call(array) === "[object Array]"
}

function isObject(object) {
  return Object.prototype.toString.call(object) === "[object Object]"
}
// 新增工单映射切换工单类型时，不显示默认项
function deleteDefaultValue(woses = {}) {
  Object.keys(woses).length && Object.keys(woses).forEach( (key) => {
    if (isArray(woses[key]) && woses[key].length) {
      woses[key].forEach((item) => {
        delete item.defaultValue
      })
    }
  })
  return woses
}

// defaultValue回调
function injectDefaultValue(inject, injected) {
  // 差个级联的，暂时不做处理了，太耗
  switch (injected.type) {
    case 'listSel':
      if (injected.params.map(i => String(i.value)).includes(inject)) {
        injected.defaultValue = inject
      }
      break;
    case 'singleSel':
      if (injected.params.map(i => String(i.value)).includes(inject)) {
        injected.defaultValue = inject
      }
      break;
    case 'multiSel':
      let compose = injected.params.map(i => i.value)
      let array = inject.filter(inj => {
        let state = false
        if (compose.includes(inj)) {
          state = true
        }
        return state
      })
      injected.defaultValue = array
      break;
    case 'user': // 历史数据，编辑时不显示
      if (isArray(inject) && inject.length && isObject(inject[0])) {
        injected.defaultValue = inject
      } else {
        injected.defaultValue = []
      }
      break;
    default:
      injected.defaultValue = inject
      break;
  }
}
// 比较函数
function compare(params, target, callback) {
  let _target = _.cloneDeep(target)
  if (params.form) {
    let keys = Object.keys(params.form)
    for(let i = 0; i < keys.length; i++) {
      for(let j = 0; j < _target.form.length; j++) {
        if (_target.form[j].code === keys[i]) {
          callback(params.form[keys[i]], _target.form[j])
          break;
        }
      }
    }
  }
  if (params.executors) {
    let execKeys = Object.keys(params.executors)
    for(let i = 0; i < execKeys.length; i++) {
      for(let j = 0; j < _target.activityVOs.length; j++) {
        let users = _target.activityVOs[j].users
        if (_target.activityVOs[j].id === execKeys[i] && users && isArray(users)) {
          let ids = users.map(i => i.userId)
          let array = (params.executors[execKeys[i]]).filter(user => {
            let state = false
            if (ids.includes(user)) {
              state = true
            }
            return state
          })
          _target.activityVOs[j].defaultValue = array
          break;
        }
      }
    }
  }
  return _target
}

// 比如告警派单需要在此时先根据id做一次工单类型模板的查询
function beforeEdit(viewData) {
  let other = {}
  if (viewData.action.type && viewData.action.type.includes(4)) { //工单映射配置
    return getshowITSMParam({
      id: viewData.action.actionITSM.itsmModelId
    }).then( ITSM => {
      if (ITSM.result) {
        let viewParam = _.cloneDeep(viewData.action.actionITSM.viewParam) || _.cloneDeep(viewData.action.actionITSM.realParam)
        /*
          比较编辑数据和ITSM模板
          1. 判断编辑数据是否存在ITSM的可选项中（依据code，再找type，再比较）
          2. 如果在可选项中将值作为defaultValue填入ITSMParam中
          */
        const ITSMParam = compare(JSON.parse(viewParam), ITSM.data, injectDefaultValue)
        return Promise.resolve({
          ITSMParam
        })
      }
    })
  }
  if (viewData.action.type && viewData.action.type.includes(100)) { // 插件映射
    return getshowPluginParam({
      id: viewData.action.actionPlugin.uuid
    }).then( plugin => {
      if (plugin.result) {
        let viewParam = _.cloneDeep(viewData.action.actionPlugin.realParam)
        /*
          比较编辑数据和插件模板
          1. 判断编辑数据是否存在插件配置的可选项中（依据code，再找type，再比较）
          2. 如果在可选项中将值作为defaultValue填入PluginParam中
          */
        const PluginParam = compare(JSON.parse(viewParam), plugin.data, injectDefaultValue)
        return Promise.resolve({
          PluginParam
        })
      }
    })
  }
}

// 处理动作列表
function disposeActions(actions) {
  let result = {}
  if (actions.result) {
    let array = actions.data.sort((pre, next) => {return Number(pre.type) - Number(next.type)})
    for (let action of array) {
      // 新告警
      if (action.scope.includes(1)) {
        if (result.newIncident) {
          result.newIncident.push(action)
        } else {
          result.newIncident = []
          result.newIncident.push(action)
        }
      }
      // 历史告警
      if (action.scope.includes(2)) {
        if (result.historyIncident) {
          result.historyIncident.push(action)
        } else {
          result.historyIncident = []
          result.historyIncident.push(action)
        }
      }
    }
    return result
  } else {
    // 错误需要提示
    message.error(actions.message, 3)
    return result
  }
}

export default {
  namespace: 'alertAssociationRules',

  state: initalState,

  subscriptions: {
    associationRulesSetup({dispatch, history}) {
      history.listen( (location) => {
        if (location.pathname === '/alertConfig/alertAssociationRules') {
          dispatch({
            type: 'queryAssociationRules',
          })
        }
      })
    },
    addAssociationRulesSetup({dispatch, history}) {
      history.listen((location) => {
        if (pathToRegexp('/alertConfig/alertAssociationRules/ruleEditor/add').test(location.pathname)) {
          dispatch({
            type: 'initQuery'
          });
        }
      })
    },
    editAssociationRulesSetup({dispatch, history}) {
      history.listen((location) => {
        if (pathToRegexp('/alertConfig/alertAssociationRules/ruleEditor/edit/:ruleId').test(location.pathname)) {
          const match = pathToRegexp('/alertConfig/alertAssociationRules/ruleEditor/edit/:ruleId').exec(location.pathname);
          const ruleId = match[1];
          dispatch({
            type: 'editView',
            payload: ruleId
          });
        }
      })
    }
  },

  effects: {
    // 用户查询
    *ownerQuery({ payload }, { select, put, call }) {
      const ownerOptions = yield call(getUsers, {
        realName: payload.realName
      });
      if (!ownerOptions.result) {
        yield message.error(ownerOptions.message, 3)
      }
      yield put({
        type: 'setUsers',
        payload: {
          users: ownerOptions.result ? ownerOptions.data : [],
        }
      })
    },
    *queryAssociationRules({payload}, {select, put, call}) {
      yield put({ type: 'toggleLoading', payload: true })

      var { orderBy, orderType } = yield select( state => {
        return {
          'orderBy': state.alertAssociationRules.orderBy,
          'orderType': state.alertAssociationRules.orderType
        }
      })

      if (payload !== undefined && payload.orderType !== undefined) {
        orderType = payload.orderType;
        orderBy = payload.orderBy;
      }

      const params = {
        orderType: orderType,
        orderBy: orderBy
      }

      const ruleResult = yield call(queryRulesList, params);
      yield put({type: 'clear'});
      if (ruleResult.result) {
        const groupList = yield groupSort()(ruleResult.data, 'timeCondition')
        yield put({ type: 'setRulesListData', payload: {
          associationRules: groupList,
          associationRulesTotal: ruleResult.data.length,
          orderBy: orderBy,
          orderType: orderType
        }})
      } else {
        yield message.error(ruleResult.message, 2)
      }

      yield put({ type: 'toggleLoading', payload: false })

    },
    // 编辑查询
    *editView({payload}, {select, put, call}) {
      if (payload !== undefined) {
        yield put({
          type: 'initQuery'
        })
        const viewResult = yield call(viewRule, payload)
        if (viewResult.result) {
          const other = yield call(beforeEdit, viewResult.data)
          yield put({
            type: 'setCurrent',
            payload: {
              currentEditRule: viewResult.data || {},
              ...other
            }
          })
        } else {
          yield message.error(viewResult.message, 3)
        }
      } else {
        console.error('ruleId is null')
      }
    },
    // 更改状态
    *changeStatus({payload}, {select, put, call}) {
      if (payload !== undefined && payload.ruleId !== undefined && payload.status !== undefined) {
        const ruleResult = yield call(changeRuleStatus, payload.ruleId)
        if (ruleResult.result) {
          yield put({
            type: 'changeRuleStatus',
            payload: {
              id: payload.ruleId,
              status: payload.status
            }
          })
        } else {
          yield message.error(ruleResult.message, 2)
        }
      } else {
        console.error('changeStatus infomation is null')
      }
    },
    // 删除规则
    *deleteRule({payload}, {select, put, call}) {
      const currentDeleteRule = yield select((state) => state.alertAssociationRules.currentDeleteRule);
      if (currentDeleteRule.id !== undefined) {
        const deleteResult = yield call(deleteRule, currentDeleteRule.id)
        if (deleteResult.result) {
          yield put({
            type: 'deleteRuleOperate',
            payload: currentDeleteRule.id
          })
        } else {
          yield message.error(deleteResult.message, 2)
        }
      } else {
        console.error('deleteId is null')
      }
    },
    //orderList排序
    *orderList({payload}, {select, put, call}) {
      yield put({
        type: 'queryAssociationRules',
        payload: {
          orderBy: payload.orderBy,
          orderType: payload.orderType
        }
      })
    },
    //orderByTittle
    *orderByTittle({payload}, {select, put, call}) {
      const { orderType } = yield select( state => {
        return {
          'orderType': state.alertAssociationRules.orderType,
        }
      } )
      if (payload !== undefined) {
        yield put({
          type: 'toggleOrder',
          payload: {
            orderBy: payload,
            orderType: orderType === undefined || orderType === 1 ? 0 : 1,
          }
        })
        yield put({ type: 'queryAssociationRules' })
      } else {
        console.error('orderBy error')
      }
    },

    // 进入页面时做一些接口的查询
    *initQuery({payload}, {select, put, call}) {

      const [ chatOps, users, source, attributes, field, wos, classCode, plugins, actions ] = yield [
        call(getChatOpsOptions), // 获取群组
        call(getUsers), // 获取用户
        call(querySource), // 获取来源
        call(queryAttributes), // 获取维度
        call(getField), // 获取映射字段
        call(getWos), // 获取工单类型
        call(getClasscode), // 获取classcode
        call(getPlugins), // 获取插件种类
        call(queryActionListToOpen) // 获取动作列表
      ]

      const dealActions = yield disposeActions(actions)

      yield put({
        type: 'updateInitData',
        payload: {
          rooms: chatOps.result ? chatOps.data : [],
          users: users.result ? users.data : [],
          source: source.result ? source.data : [],
          attributes: attributes.result ? attributes.data : [],
          field: field.result ? field.data : [],
          wos: wos.result ? wos.data : [],
          classCode: classCode.result ? classCode.data : [],
          plugins: plugins.result ? plugins.data : {},
          actions: dealActions
        }
      })
    },
    // 获取 工单映射配置
    *getshowITSMParam({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(getshowITSMParam, params);
      if (result.result) {
        let data = yield deleteDefaultValue(result.data)
        yield put({
          type: 'updateITSMParam',
          payload: {
            data: data || {}
          }
        });
      } else {
        message.error(result.message, 3);
      }
    },

    // 获取 插件配置
    *getshowPluginParam({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(getshowPluginParam, params);
      if (result.result) {
        yield put({
          type: 'updatePluginParam',
          payload: {
            data: result.data || {}
          }
        });
      } else {
        message.error(result.message, 3);
      }
    },

    // 保存规划
    *createRule({payload}, {select, put, call}) {
      const params = {
        ...payload.result
      };
      const result = yield call(createRule, params);
      if (result.result) {
        // message.success('保存成功');
        payload.resolve && payload.resolve(true);
        yield put(routerRedux.goBack());
        // yield put({type: 'clear'});
      } else {
        payload.resolve && payload.resolve(false);
        message.error(result.message, 3);
      }
    },
  },

  reducers: {
    //setUsers
    setUsers(state, { payload: {users} }) {
      return { ...state, users}
    },
    // 加载状态
    toggleLoading(state, {payload: isLoading}) {
      return { ...state, isLoading }
    },
    // 排序
    toggleOrder(state, {payload}) {
      return { ...state, ...payload }
    },
    // 列表数据
    setRulesListData(state, {payload}) {
      return { ...state, ...payload }
    },
    // 转换展开状态
    spreadGroup(state, { payload }) {
      const { associationRules } = state;
      const newData = associationRules.map( (group) => {
        if (group.classify == payload) {
          group.isGroupSpread = !group.isGroupSpread;
        }
        return group
      })
      return { ...state, associationRules: newData }
    },
    // 收拢
    noSpreadGroup(state, { payload }) {
      const { associationRules } = state;
      const newData = associationRules.map( (group) => {
        if (group.classify == payload) {
          group.isGroupSpread = false;
        }
        return group
      })
      return { ...state, associationRules: newData }
    },

    // 更改状态
    changeRuleStatus(state, { payload: {id, status} }) {
      const { associationRules } = state;
      const newData = associationRules.map( (item) => {
        item.children.length > 0 && item.children.map( (childrenItem) => {
          if (childrenItem.id == id) {
            childrenItem.enableIs = status
          }
        })
        return item;
      })
      return { ...state, associationRules: newData }
    },
    // 删除
    deleteRuleOperate(state, { payload }) {
      const { associationRules } = state;
      const newData = associationRules.map( (item) => {
        let temp = item.children.filter( (childrenItem) => {
          return childrenItem.id !== payload
        })
        item.children = temp
        return item;
      })
      return { ...state, associationRules: newData, isShowDeleteModal: false, currentDeleteRule: {} }
    },
    setCurrent(state, { payload }) {
      return { ...state, ...payload }
    },
    updateInitData(state, {payload}) {
      return { ...state, ...payload}
    },
    updateITSMParam(state, {payload}) {
      return { ...state, ITSMParam: payload.data }
    },
    updatePluginParam(state, {payload}) {
      return { ...state, PluginParam: payload.data }
    },
    clear(state, {payload}) {
      return initalState
    },
    toggleDeleteModal(state, {payload: {currentDeleteRule, isShowDeleteModal}}) {
      return { ...state, currentDeleteRule, isShowDeleteModal }
    }
  },
}
