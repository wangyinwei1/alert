// ---------- vendors ---------- //
import React, { PropTypes, Component } from 'react';
import _ from 'lodash'
// ---------- Basic Information ---------- //
import Basic from './Basic/index.js'
import moment from 'moment'
import 'moment/locale/zh-cn'
// ---------- Source Information ---------- //
import Source from './Source/index.js'
// ---------- Condition Information ---------- //
import Condition from './Condition/index.js'
// ---------- Action Information ---------- //
import Action from './Action/index.js'
// ---------- other ------------ //
import * as Constants from './propTypes.js'
import Services from './service.js'
import StoreUtils from './createValidateStore.js'
import styles from './index.less';
import LeaveNotifyModal from '../common/leaveNotifyModal/index'

// init Moment Locale
function initMomentLocale() {
  if (window.__alert_appLocaleData.locale === 'en-us') { // 设定时间国际化(为了保持国际化的统一, moment改为props传入组件)
    moment.locale('en_US');
  } else {
    moment.locale('zh-cn');
  }
}

class RuleEditor extends Component {
  // 这里在编辑态刷新的时候有坑
  constructor(props) {
    super(props)
    initMomentLocale()
    let Convert = Services.entryServer(props)
    this.state = {
      /* Basic */
      base: Convert.Base,
      /* TimeCycle */
      time: Convert.Time,
      timeStart: Convert.TimeStart,
      timeEnd: Convert.TimeEnd,
      /* Condition */
      condition: Convert.Condition,
      /* Source */
      source: Convert.Source,
      /* Action */
      action: Convert.Action,
      /* target 和 associatedFlag 会影响组件之间的交互，单独提出来 */
      target: Convert.Base.target,
      associatedFlag: Convert.Condition.associatedFlag,
      /* Other */
      isShareUpgrade: Convert.isShareUpgrade, // 是否需要升级
      notifyTypes: Convert.NotifyTypes, // 告警通知 --> 通知类型
      ITSMParam: props.allParams.ITSMParam, // ITSM映射
      PluginParam: props.allParams.PluginParam, // 插件映射
    };
    this.commonSetState = this.commonSetState.bind(this)
    this.changeTarget = this.changeTarget.bind(this)
    this.getRefOfActionITSM = this.getRefOfActionITSM.bind(this)
    this.getRefOfActionPlugin = this.getRefOfActionPlugin.bind(this)
    // 检验部分(现在如果需要增加检验，只需要在这里将检验字段扁平化，然后在规则写上rules即可生效)
    StoreUtils.createValidateStore(Services.flatten(Convert))
  }

  componentDidMount() {
    this.isNeedLeaveCheck = true;
  }

  componentWillReceiveProps(nextProps, nextState) {

    if (nextProps.rule.id !== this.props.rule.id) { // 初次编辑赋值
      let Convert = Services.entryServer(nextProps)
      this.setState({
        base: Convert.Base,
        time: Convert.Time,
        timeStart: Convert.TimeStart,
        timeEnd: Convert.TimeEnd,
        condition: Convert.Condition,
        source: Convert.Source,
        action: Convert.Action,
        target: Convert.Base.target,
        associatedFlag: Convert.Condition.associatedFlag,
        isShareUpgrade: Convert.isShareUpgrade,
        notifyTypes: Convert.NotifyTypes,
        ITSMParam: nextProps.allParams.ITSMParam,
        PluginParam: nextProps.allParams.PluginParam,
      })
      StoreUtils.updateFieldsStore(Services.flatten(Convert))
    }
    // 选择不同的工单映射 --> 触发
    if (nextProps.allParams.ITSMParam !== this.props.allParams.ITSMParam) {
      let _ITSMParam = nextProps.allParams.ITSMParam;
      this.setState({
        ITSMParam: _ITSMParam
      })
    }
    // 选择不同的插件类型 --> 触发
    if (nextProps.allParams.PluginParam !== this.props.allParams.PluginParam) {
      let _pluginParam = nextProps.allParams.PluginParam;
      this.setState({
        PluginParam: _pluginParam
      })
    }
  }

  // 获取actionITSM的实例
  getRefOfActionITSM(type) {
    return this.action.getInstance(type)
  }

  // 获取actionPlugin的实例
  getRefOfActionPlugin(type) {
    return this.action.getInstance(type)
  }

  // 通用是setState方式
  commonSetState(target, value) {
    this.setState({
      [target]: value
    })
  }

  // 改变告警适用范围
  changeTarget(value) {
    let _action, _pluginParam = null
    // 因为插件种类会因为新告警和历史告警的不同而不同，所以需要清空原先的设置
    if (this.state.action.type[0] === 100) {
      let _initActionPlugin = _.cloneDeep(Constants.InitalActions.actionPlugin)
      _action = _.cloneDeep(this.state.action)
      _pluginParam = {}
      _action.actionPlugin = _initActionPlugin
    }
    if (Number(value) === 0) { // 判断为新告警
      // 新接告警没有抑制功能
      let _time = null
      if (this.state.action.type[0] === 5) {
        _action = _.cloneDeep(this.state.action);
        _action.type[0] = 1;
      }
      // 新接告警无任意时间选项
      if (this.state.time.timeCondition === 0) {
        _time = _.cloneDeep(this.state.time)
        _time.timeCondition = 2 // 周期性执行
      }
      this.setState({
        target: Number(value),
        time: _time ? _time : { ...this.state.time },
        action: _action ? _action : { ...this.state.action },
        PluginParam: _pluginParam ? _pluginParam : { ...this.state.PluginParam }
      })
    } else { // 判断为历史告警
      // 若在新告警时选择的关联方式历史告警不存在需要手动置无关联
      let _associatedFlag = this.state.associatedFlag
      if (this.state.associatedFlag !== 0) {
        _associatedFlag = 0
      }
      this.setState({
        target: Number(value),
        associatedFlag: _associatedFlag,
        action: _action ? _action : { ...this.state.action },
        PluginParam: _pluginParam ? _pluginParam : { ...this.state.PluginParam }
      })
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    let arrayToValidate = ['name', 'description']

    switch (this.state.associatedFlag) {
      case 1:
        arrayToValidate = arrayToValidate.concat(['newObject', 'newName', 'newSeverity'])
        break;
      default:
        break;
    }

    Services.validateAllFields(arrayToValidate, (errors) =>{
      if (!!errors) {
        return
      }
      const result = Services.outputServer.call(this, moment)
      this.props.dispatch({
        type: 'alertAssociationRules/createRule',
        payload: {
          result,
          resolve: (res) => {
            this.isNeedLeaveCheck = !res;
          }
        }
      })
    }, this.forceUpdate.bind(this))
  }

  render() {
    let { base, source, time, timeStart, timeEnd, condition, action, target, associatedFlag, notifyTypes, isShareUpgrade } = this.state;

    let basicProps = {
      base, time, timeStart, timeEnd, target, associatedFlag, moment,
      commonSetState: this.commonSetState,
      changeTarget: this.changeTarget
    }

    let sourceProps = {
      sourceValue: source,
      source: this.props.allParams.source,
      commonSetState: this.commonSetState
    }

    let conditionProps = {
      condition, associatedFlag,
      userInfo: this.props.userInfo,
      codewords: {
        classCode: this.props.allParams.classCode,
        source: this.props.allParams.source,
        attributes: this.props.allParams.attributes
      },
      changeCondition: this.commonSetState,
    }

    let actionsProps = {
      action, target, notifyTypes, isShareUpgrade,
      ITSMParam: this.state.ITSMParam,
      PluginParam: this.state.PluginParam,
      dispatch: this.props.dispatch,
      users: this.props.allParams.users,
      rooms: this.props.allParams.rooms,
      field: this.props.allParams.field,
      wos: this.props.allParams.wos,
      plugins: this.props.allParams.plugins,
      actions: this.props.allParams.actions,
      commonSetState: this.commonSetState
    }

    return (
      <div id="RuleEditor" className="ant-form ant-form-horizontal">
        {/* Basic */}
        <h2>{window.__alert_appLocaleData.messages['ruleEditor.baseInfo']}</h2>
        <Basic {...basicProps}/>
        {/* Source */}
        <h2>{window.__alert_appLocaleData.messages['ruleEditor.source']}</h2>
        <Source {...sourceProps}/>
        {/* Condition */}
        <h2>{window.__alert_appLocaleData.messages['ruleEditor.defineRule']}</h2>
        <Condition {...conditionProps}/>
        {/* Actions (若动作列表接口返回有问题直接不显示动作)*/}
        { Object.keys(this.props.allParams.actions).length ? <h2>{window.__alert_appLocaleData.messages['ruleEditor.setAct']}</h2> : null }
        { Object.keys(this.props.allParams.actions).length ? <Action ref={ node => this.action = node } {...actionsProps}/> : null }
        <LeaveNotifyModal route={ this.props.route } needLeaveCheck={ () => { return this.isNeedLeaveCheck }}/>
        <span onClick={this.handleSubmit.bind(this)} className={styles.submit}>{window.__alert_appLocaleData.messages['ruleEditor.submit']}</span>
      </div>
    )
  }
}

export default RuleEditor;
