import { getUUID } from '../../utils/index'
import AsyncValidator from 'async-validator'
import StoreUtils from './createValidateStore.js'
import React, { PropTypes, Component } from 'react'
import { Form } from 'antd'
import _ from 'lodash'
import * as Constants from './propTypes.js'
import limitField from './FormMaterial/limitField.js'

// 处理条件数据，给每一条数据（加上/去掉）唯一id
function makeCondition(node, type = true) {
  const { complex = [] } = node;
  if (type) {
    node.id = getUUID(8);
  } else {
    delete node.id;
  }
  for (let i = complex.length - 1; i >= 0; i -= 1) {
    makeCondition(complex[i]);
  }
  return node;
}

/**
 * 入口数据处理层
 * 1. 新增/编辑时 --> 转换props --> { Base, TimeCycle, Condition, Source, Action }
 * 2. 编辑时 --> 现有的Condition需要配上UUID
 * @param { Object } props对象, 注意区别add / edit
 * @return { Object } Base TimeCycle Condition Source, Action
 */
function entryServer(props) {
  // 深拷贝Constants是为了每次的默认的对象引用不一样，防止Purerender引起的不渲染
  let isShareUpgrade = false;
  let {  DefaultBaseProps: _Base
          , DefaultTimeProps: _Time
          , DefaultTimeStart: _TimeStart
          , DefaultTimeEnd: _TimeEnd
          , NotifyTypes: _NotifyTypes
          , DefaultSourceProps: _Source
          , DefaultConditionProps: _Condition
          , DefaultActionsProps: _Action } = _.cloneDeep(Constants);

  // 给不同的关联类型都加上id
  makeCondition(_Condition.noAssociation.ruleData)
  makeCondition(_Condition.tagAssociation.ruleData)
  makeCondition(_Condition.topologyAssociation.primaryRuleData)
  makeCondition(_Condition.topologyAssociation.secondaryRuleData)

  if (_.isEmpty(props.rule) || _.isEmpty(props.action)) {
    return {
      Base: _Base,
      Time: _Time,
      TimeStart: _TimeStart,
      TimeEnd: _TimeEnd,
      NotifyTypes: _NotifyTypes,
      Source: _Source,
      Condition: _Condition,
      Action: _Action,
      isShareUpgrade: isShareUpgrade
    }
  }

  let propsArray = [props.rule, props.action]
  let defaultArray = [_Base, _Time, _Source, _Condition, _Action]
  // 编辑时 将 props -> defaultProps 统一赋值
  for (let result of propsArray) {
    for (let [k, v] of Object.entries(result)) {
      outer:
      for (let obj of defaultArray) {
        for (let m of Object.keys(obj)) {
          // 不需要做特殊处理的直接赋值
          if (k === m) {
            obj[m] = v
            break outer
          }
        }
      }
    }
  }
  // _TimeStart and _TimeEnd
  if (props.rule.dayStart && props.rule.dayEnd) {
    _TimeStart.hours = props.rule.dayStart.substr(11, 2);
    _TimeStart.mins = props.rule.dayStart.substr(14, 2);
    _TimeEnd.hours = props.rule.dayEnd.substr(11, 2);
    _TimeEnd.mins = props.rule.dayEnd.substr(14, 2);
  } else if (props.rule.timeStart && props.rule.timeEnd) {
    _TimeStart.hours = props.rule.timeStart.substr(0, 2);
    _TimeStart.mins = props.rule.timeStart.substr(3, 2);
    _TimeEnd.hours = props.rule.timeEnd.substr(0, 2);
    _TimeEnd.mins = props.rule.timeEnd.substr(3, 2);
  }
  // associatedFlag
  switch (_Condition.associatedFlag ) {
    case 0:
      _Condition.noAssociation.ruleData = makeCondition(_.cloneDeep(props.rule.ruleData))
      break;
    case 1:
      _Condition.tagAssociation.ruleData = makeCondition(_.cloneDeep(props.rule.ruleData))
      for (let key of ['tags', 'timeWindow', 'newObject', 'newName', 'newSeverity', 'newDescription']) {
        _Condition.tagAssociation[key] = props.rule[key]
      }
      break;
    case 2:
      _Condition.topologyAssociation.primaryRuleData = makeCondition(_.cloneDeep(props.rule.primaryRuleData))
      _Condition.topologyAssociation.secondaryRuleData = makeCondition(_.cloneDeep(props.rule.secondaryRuleData))
      for (let key of ['timeWindow', 'ruleRelation', 'associatedCode', 'apiKey', 'consumersID', 'sourceID']) {
        _Condition.topologyAssociation[key] = props.rule[key]
      }
      break;
    default:
      break;
  }
  // action
  if (_Action.type.includes(3)) { // 升级 与 通知
    if (_Action.type.includes(2)) { // 含有升级
      isShareUpgrade = true
    }
    _Action.type = [3]
  }
  // notifyTypes
  for (let type of _Action.actionNotification.notificationMode.notificationMode) {
    if (type === 1) _NotifyTypes.email = true
    if (type === 2) _NotifyTypes.sms = true
    if (type === 3) _NotifyTypes.chatops = true
    if (type === 5) _NotifyTypes.audio = true
  }
  return {
    Base: _Base,
    Time: _Time,
    TimeStart: _TimeStart,
    TimeEnd: _TimeEnd,
    NotifyTypes: _NotifyTypes,
    Source: _Source,
    Condition: _Condition,
    Action: _Action,
    isShareUpgrade: isShareUpgrade
  }
}

/**
 * sumit之前的数据处理(Time, Action)
 * @return { Object } rule + action
 */
function outputServer(moment) {
  let holdup = 0 // 0 非抑制 1 抑制
  let timeParams = {}, conditionParams = {}
  const { allParams } = this.props;
  const { base, time, timeStart, timeEnd, condition, source, action, target, associatedFlag, isShareUpgrade } = this.state

  /* ---------- 时间处理 ---------- */
  let cycleTimeStart =  `${timeStart.hours}:${timeStart.mins}`;
  let cycleTimeEnd = `${timeEnd.hours}:${timeEnd.mins}`;
  let hmStart = `${moment(cycleTimeStart, 'H:mm').format("HH:mm")}`;
  let hmEnd = `${moment(cycleTimeEnd, 'H:mm').format("HH:mm")}`;
  let local = moment().format().substr(19, 6);

  timeParams.timeCondition = time.timeCondition
  switch (time.timeCondition) {
    case 2: // 周期
      if (time.timeCycle === 1) { // 每周
        timeParams.timeCycle = time.timeCycle;
        timeParams.timeCycleWeek = time.timeCycleWeek;
      }
      if (time.timeCycle === 2) { // 每月
        timeParams.timeCycle = time.timeCycle;
        timeParams.timeCycleMonth = time.timeCycleMonth;
      }
      if (time.timeCycle === 0) { // 每日
        timeParams.timeCycle = time.timeCycle;
      }
      timeParams.timeStart = `${hmStart}${local}`;
      timeParams.timeEnd = `${hmEnd}${local}`;
      break;
    case 1: // 固定
      timeParams.dayStart = time.dayStart.replace(time.dayStart.substr(11, 5), hmStart);
      timeParams.dayEnd = time.dayEnd.replace(time.dayEnd.substr(11, 5), hmEnd);
      break;
    default:
      break;
  }
  /* ---------- End ---------- */

  /* ---------- 条件处理 -----------*/
  conditionParams.associatedFlag = associatedFlag
  switch (associatedFlag) {
    case 0: // 不关联
      makeCondition(condition.noAssociation.ruleData, false) // 去除id标识
      conditionParams = { ...conditionParams, ...condition.noAssociation }
      break;
    case 1: // 基于标签
      makeCondition(condition.tagAssociation.ruleData, false)
      conditionParams = { ...conditionParams, ...condition.tagAssociation }
      break;
    case 2: // 基于拓扑
      makeCondition(condition.topologyAssociation.primaryRuleData, false)
      makeCondition(condition.topologyAssociation.secondaryRuleData, false)
      conditionParams = { ...conditionParams, ...condition.topologyAssociation }
      break;
    default:
      break;
  }
  /* ---------- End ---------- */

  /* ---------- 动作处理 -----------*/
  let _actionType = action.type;
  let _actionDelOrClose = undefined;
  let _actionNotification = undefined;
  let _actionITSM = undefined;
  let _actionSuppress = undefined;
  let _actionChatOps = undefined;
  let _actionUpgrade = undefined;
  let _actionPlugin = undefined;
  let _actionSeverity = undefined;

  switch (_actionType[0]) {
    case 1: // 删除或关闭
      _actionDelOrClose = action.actionDelOrClose;
      break;
    case 3: // 告警通知和升级合并
      if (!Number(target) && isShareUpgrade) {
        _actionNotification = action.actionNotification;
        // ---------------------------------------------
        _actionUpgrade = action.actionUpgrade;
        _actionUpgrade.notificationMode = action.actionNotification.notificationMode
        _actionUpgrade.notificationGroupings = action.actionUpgrade.notificationGroupings.filter(item => item);
        _actionType = [2, 3] // 升级type
      } else {
        _actionNotification = action.actionNotification;
        _actionType = [3]
      }
      break;
    case 4: // 工单映射
      this.getRefOfActionITSM('actionITSM').validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return
        }
        let params = this.getRefOfActionITSM('actionITSM').getFieldsValue()
        let viewForm, viewExecutors = {}
        let form, executors = {}
        Object.keys(params).filter(key => params[key]).forEach(key => {
          if (key.indexOf(limitField.PREFIX_EXECUTOR) === 0) {
            executors = {
              ...executors,
              [key.slice(limitField.PREFIX_EXECUTOR.length)]: params[key]
            }
            viewExecutors = {
              ...viewExecutors,
              [key.slice(limitField.PREFIX_EXECUTOR.length)]: params[key]
            }
          } else {
            if (key.indexOf(limitField.PREFIX_USERTYPE) === 0) {
              form = { ...form, [key.slice(limitField.PREFIX_USERTYPE.length)]: params[key].map(i => i.key) }
              viewForm = { ...viewForm, [key.slice(limitField.PREFIX_USERTYPE.length)]: params[key] }
            } else {
              form = { ...form, [key]: params[key] }
              viewForm = { ...viewForm, [key]: params[key] }
            }
          }
        })
        _actionITSM = action.actionITSM;
        _actionITSM.itsmModelName = allParams.wos.filter(item => {
            return item.id === _actionITSM.itsmModelId;
        })[0]['name'];
        _actionITSM.realParam = JSON.stringify({form, executors}, null, 2).replace(/\s|\n/g, "");
        _actionITSM.viewParam = JSON.stringify({form: viewForm, executors: viewExecutors}, null, 2).replace(/\s|\n/g, "")
      })
      break;
    case 5: // 告警抑制
      holdup = 1 // 抑制标识
      _actionSuppress = action.actionSuppress;
      break;
    case 6: // 分享到chatops
      _actionChatOps = action.actionChatOps;
      _actionChatOps.chatOpsRoomName = allParams.rooms.filter(item => {
          return item.id === _actionChatOps.chatOpsRoomId;
      })[0]['topic'];
      break;
    case 7: // 修改告警级别
      _actionSeverity = action.actionSeverity;
      break;
    case 100: // 插件配置
      this.getRefOfActionPlugin('actionPlugin').validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return
        }
        let params = this.getRefOfActionPlugin('actionPlugin').getFieldsValue()
        let allPlugins = target ? allParams.plugins.actionsForHistory : allParams.plugins.actionsForNew
        let form = {}
        Object.keys(params).filter(key => params[key]).forEach(key => {
          form = { ...form, [key]: params[key] }
        })
        _actionPlugin = action.actionPlugin;
        _actionPlugin.name = allPlugins.filter(item => {
            return item.id === _actionPlugin.uuid;
        })[0]['name'];
        _actionPlugin.realParam = JSON.stringify({ form }, null, 2).replace(/\s|\n/g, "");
      })
      break;
    default:
      break;
  }
  /* ---------- End ---------- */
  return {
    rule: {
      id: _.isEmpty(this.props.rule) ? undefined : this.props.rule.id,
      ...base,
      ...timeParams,
      ...source,
      ...conditionParams,
      holdup,
      target,
      associatedFlag
    },
    action: {
      id: _.isEmpty(this.props.action) ? undefined : this.props.action.id,
      type: _actionType,
      actionDelOrClose: _actionDelOrClose,
      actionNotification: _actionNotification,
      actionITSM: _actionITSM,
      actionSuppress: _actionSuppress,
      actionChatOps: _actionChatOps,
      actionUpgrade: _actionUpgrade,
      actionPlugin: _actionPlugin,
      actionSeverity: _actionSeverity
    }
  }
}

/**
 * Convert --> fields store 数据扁平化
 * @param { object } Convert
 * @return { object }
 */
function flatten(convert) {
  return {
    name: convert.Base.name,
    description: convert.Base.description,
    newObject: convert.Condition.tagAssociation.newObject,
    newName: convert.Condition.tagAssociation.newName,
    newSeverity: convert.Condition.tagAssociation.newSeverity,
  }
}

/**
 * 字段检验
 * @param { object } fields need validate
 * @param { function } callback
 */
function validateFieldsInternal(fields, callback) {
  const allRules = {};
  const allValues = {};
  fields.forEach( field => {
    // 单个检验
    if (_.isObject(field)) {
      Object.keys(field).forEach(key => {
        if (StoreUtils.hasRules(key)) {
          allValues[key] = field[key]
          allRules[key] = StoreUtils.getFieldRules(key)
        }
      })
    }
    // submit检验
    if (StoreUtils.hasRules(field)) {
      allValues[field] = StoreUtils.getFieldsValue(field)
      allRules[field] = StoreUtils.getFieldRules(field)
    }
  })
  const validator = new AsyncValidator(allRules)
  validator.validate(allValues, {}, (errors) => {
    // 保存value message status
    let allfield = {}
    if (errors && errors.length) {
      errors.forEach((e) => {
        if (!allfield[e.field]) {
          allfield[e.field] = {
            'metaValue': { value: allValues[e.field], rules: allRules[e.field] },
            'validate': { status: 'error', message: [].concat(e.message) }
          }
        }
        allfield[e.field]['validate']['message'].push(e.message)
      });
    }
    Object.keys(allRules).forEach(key => {
      if (!allfield[key]) {
        allfield[key] = {
          'metaValue': { value: allValues[key], rules: allRules[key] }
        }
      }
    })
    StoreUtils.setFields(allfield)
    if (callback) {
      callback(errors)
    }
  })
}

function validateAllFields(keys = Object.keys(StoreUtils.getFieldsStore()), callback, reRender) {
  return validateFieldsInternal(keys, (errors) => {
    if (!!errors) {
      reRender()
    }
    callback(errors)
  })
}

function getValueFromEvent(e) {
  // support custom element
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}

function wrapperValidator({code, param, trigger, itemProps}) {
  // 把param和rule注射到store的fields中
  StoreUtils.setFieldsValue(code, {
    value: param,
    rules: itemProps.rules || [],
  })
  return (children) => {
    if (React.isValidElement(children)) {
      delete itemProps.rules
      let error = StoreUtils.getFieldValidate(code)
      let parentProps = {
        ...itemProps,
        validateStatus: error ? error.status : undefined,
        help: error ? error.message[0] : ''
      }
      let childrenProps = {
        ...children.props,
        [trigger]: (...args) => {
          //检验 + setStore(error/message)
          validateFieldsInternal([{
            [code]: getValueFromEvent(...args)
          }])
          children.props[trigger](...args)
        }
      }
      return (
        <Form.Item
          {...parentProps}
        >
          { React.cloneElement(children, childrenProps) }
        </Form.Item>
      )
    }
    return null
  }
}

export default {
  flatten,
  entryServer,
  outputServer,
  wrapperValidator,
  validateFieldsInternal,
  validateAllFields
}