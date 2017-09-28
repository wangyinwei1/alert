import {parse} from 'qs'
import { getField, getSource, getCMDBSource, getOID, get16Data, getValidateRegex } from '../services/alertConfig'
import { message } from 'antd';
import { getUUID } from '../utils'

const initalState = {
  isShowTrapDeleteModal: false,
  operateDeleteRule: {},
  isShowTrapModal: false,
  trapUrl: 'alert.uyun.cn',
  appRules: [], // 规则
  filterSource: [], // fiter选项
  OIDList: [], // 精确匹配时的oid类
  operateType: undefined, // 操作类型
  operateAppRules: {}, // 操作的对象
  matchProps: [], // 全量的后台返回字段名
  dataToString: {}, // 16进制转String
  validateResult: {} // 校验结果
}

export default {
  namespace: 'snmpTrapRules',

  state: initalState,

  effects: {
    // 新增规则 --> 点击新增
    *addRule({payload}, {select, put, call}) {
      const [ fields, source, OID ] = yield [
        call(getField),
        call(getSource),
        call(getOID)
      ]
      if (!fields.result) {
        yield message.error(fields.message, 3);
      }
      if (!source.result) {
        yield message.error(source.message, 3);
      }
      if (!OID.result) {
        yield message.error(OID.message, 3);
      }
      yield put({
        type: 'addOperate',
        payload: {
          fields: fields.result ? fields.data : [],
          source: source.result ? source.data : [],
          OIDList: OID.result ? OID.data : [],
          operateType: 'add'
        }
      })
      yield put({
        type: 'toggleTrapModal',
        payload: true
      })
    },
    // 编辑规则 --> 点击编辑
    *editRule({payload}, {select, put, call}) {
      const [ fields, source, OID ] = yield [
        call(getField),
        call(getSource),
        call(getOID)
      ]
      if (!fields.result) {
        yield message.error(fields.message, 3);
      }
      if (!source.result) {
        yield message.error(source.message, 3);
      }
      if (!OID.result) {
        yield message.error(OID.message, 3);
      }
      yield put({
        type: 'editOperate',
        payload: {
          id: payload,
          fields: fields.result ? fields.data : [],
          source: source.result ? source.data : [],
          OIDList: OID.result ? OID.data : [],
          operateType: 'edit'
        }
      })
      yield put({
        type: 'toggleTrapModal',
        payload: true
      })
    },
    // 删除规则 --> 点击删除
    *deleteRule({payload}, {select, put, call}) {
      const { operateDeleteRule } = yield select( state => {
        return {
          'operateDeleteRule': state.snmpTrapRules.operateDeleteRule,
        }
      })
      if (operateDeleteRule.id !== undefined) {
        yield put({
          type: 'deleteOperate',
          payload: {
            id: operateDeleteRule.id
          }
        })
      }
      yield put({
        type: 'toggleTrapDeleteModal',
        payload: {
            status: false,
        }
      })

    },
    // 保存规则 --> 点击保存
    *saveRule({payload: appRule }, {select, put, call}) {
      const { operateType, operateAppRules } = yield select( state => {
        return {
          'operateType': state.snmpTrapRules.operateType,
          'operateAppRules': state.snmpTrapRules.operateAppRules
        }
      })
      if (operateType === 'add') {
        appRule.id = yield getUUID(32);
        yield put({
          type: 'saveOperateByadd',
          payload: appRule
        })
      } else if (operateType === 'edit') {
        yield put({
          type: 'saveOperateByedit',
          payload: {
            id: operateAppRules.id,
            appRule: appRule
          }
        })
      }
      yield put({
        type: 'toggleTrapModal',
        payload: false
      })
    },
    // 16进制转换成string
    *toggle16Radix({payload: hex }, {select, put, call}) {
      if (hex && hex.hexType && hex.hexValue) {
        const type = hex.type
        const toggleData = yield call(get16Data, {
          hexType: '16',
          value: hex.hexValue
        })
        if (toggleData.result) {
          yield put({
            type: 'set16ToString',
            payload: {
              type: type,
              data: toggleData.data.data
            }
          })
        } else {
          yield message.error(toggleData.message, 3);
        }
      } else {
        console.error('hex type error')
      }
    },
    *validateRadix({payload: params }, {select, put, call}) {
      if (params && params.value && params.regex) {
        const type = params.type
        const validateData = yield call(getValidateRegex, {
          value: params.value,
          regex: params.regex
        })
        if (validateData.result) {
          yield put({
            type: 'setValidateResult',
            payload: {
              type: type,
              data: validateData.data.data
            }
          })
        } else {
          yield message.error(validateData.message, 3);
        }
      } else {
        console.error('validate data error')
      }
    },

  },

  reducers: {
    // 检验
    setValidateResult(state, {payload: data}) {
      return { ...state, validateResult: data }
    },
    // 16进制 --> string
    set16ToString(state, {payload: data}) {
      return { ...state, dataToString: data }
    },
    // 转换关闭弹窗状态，以及注入删除对象
    toggleTrapDeleteModal(state, {payload: {status, rule ={} }}) {
      return { ...state, isShowTrapDeleteModal: status, operateDeleteRule: rule }
    },
    // 转换modal状态
    toggleTrapModal(state, {payload: isShowTrapModal}) {
      return { ...state, isShowTrapModal }
    },
    // 配置页面的规则列表
    setAppRules(state, {payload: {appRules, trapUrl}}) {
      return { ...state, appRules, trapUrl }
    },
    // 新增打开modal时预处理数据
    addOperate(state, {payload: {fields, source, OIDList, operateType}}) {
      return {
        ...state,
        filterSource: source,
        matchProps: fields,
        operateAppRules: initalState.operateAppRules,
        operateType,
        OIDList
      }
    },
    // 编辑打开modal时预处理数据
    editOperate(state, {payload: {id, fields, source, OIDList, operateType}}) {
      const { appRules } = state;
      let operateAppRules = {};
      let matchProps = [].concat(fields);

      appRules.forEach( (rule, index) => {
        if (rule.id == id) {
          operateAppRules = rule;
          if (rule.dataSource === 2) {
            matchProps.push('severity');
          }
        }
      })

      return {
        ...state,
        filterSource: source,
        matchProps,
        operateAppRules,
        operateType,
        OIDList
      }
    },
    // 删除规则
    deleteOperate(state, {payload: { id }}) {
      const { appRules } = state;
      const newRules = appRules.filter( rule => rule.id !== id )
      return { ...state, appRules: newRules }
    },
    // 保存规则
    saveOperateByadd(state, {payload}) {
      const { appRules } = state;
      appRules.push(payload)
      return { ...state, appRules }
    },
    saveOperateByedit(state, {payload: { id, appRule }}) {
      const { appRules } = state;
      const newRules = appRules.map( (rule, index) => {
        if (rule.id === id) {
          return {
            id: rule.id,
            ...appRule
          }
        } else {
          return rule;
        }
      })
      return { ...state, appRules: newRules }
    }
  },

}
