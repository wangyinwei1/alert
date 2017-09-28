/**
 * Name: ruleEditor container
 * Create: 2017-04-13
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import RuleEditor from '../components/ruleEditor';

let defaultRule = {}
let defaultAction = {}

function ruleEditor({userInfo, allParams, rule, action, ...other}) {

  let ruleProps = {
    userInfo,
    allParams,
    rule,
    action,
    ...other
  }

  return (
    <RuleEditor { ...ruleProps } />
  );
}

ruleEditor.propTypes = {
  dispatch: PropTypes.func
};

export default connect( state => {
  return {
    userInfo: state.app.userInfo,
    allParams: {
      users: state.alertAssociationRules.users, // 用户列表
      source: state.alertAssociationRules.source, // 来源列表
      attributes: state.alertAssociationRules.attributes, // 维度列表
      field: state.alertAssociationRules.field, // 映射字段
      rooms: state.alertAssociationRules.rooms, // chatOps 群组
      wos: state.alertAssociationRules.wos, // 工单类型
      plugins: state.alertAssociationRules.plugins, //插件类型
      actions: state.alertAssociationRules.actions, // 动作列表
      classCode: state.alertAssociationRules.classCode, // 资源类型
      ITSMParam: state.alertAssociationRules.ITSMParam, // 映射配置
      PluginParam: state.alertAssociationRules.PluginParam, // 插件配置
    },
    rule: Object.keys(state.alertAssociationRules.currentEditRule).length ? state.alertAssociationRules.currentEditRule.rule : defaultRule,
    action: Object.keys(state.alertAssociationRules.currentEditRule).length ? state.alertAssociationRules.currentEditRule.action : defaultAction
  }
})(ruleEditor);
