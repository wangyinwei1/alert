import React, { PropTypes, Component } from 'react'
import { Form, Input, Radio, Select, Tabs, Popover, Checkbox, Row, Col } from 'antd';
import _ from 'lodash'
import styles from './index.less'
import * as Constants from '../propTypes.js'
import PureRender from '../../../utils/PureRender.js'
// ------------- actions ---------------- //
import ActionChatOps from './actions/actionChatOps.js'
import ActionDelOrClose from './actions/actionDelOrClose.js'
import ActionNotification from './actions/actionNotification.js'
import ActionUpgrade from './actions/actionUpgrade.js'
import ActionSeverity from './actions/actionSeverity.js'
import CustomField from './actions/customField.js'

const FormItem = Form.Item
const TabPane = Tabs.TabPane;

class Action extends Component {
  constructor(props) {
    super(props)
    this.vars = this.vars.bind(this)
    this.changeAction = this.changeAction.bind(this)
    this.changeActionByAudio = this.changeActionByAudio.bind(this)
    this.userSearch = this.userSearch.bind(this)
    this.changeNotifyLevelUp = this.changeNotifyLevelUp.bind(this)
    this.changeShareUpgrade = this.changeShareUpgrade.bind(this)
    this.getInstance = this.getInstance.bind(this)
  }

  // 更改动作类型
  changeActionType(value) {
    const _action = {
      ...this.props.action,
      type: [parseInt(value, 10)]
    }
    this.props.commonSetState('action', _action)
  }

  // 模糊查找用户
  userSearch(value) {
    this.props.dispatch({
      type: 'alertAssociationRules/ownerQuery',
      payload: {
        realName: value
      }
    })
  }

  // 更改web声音通知的参数
  changeActionByAudio(type, value) {
    const { dispatch } = this.props;
    const _action = _.cloneDeep(this.props.action);
    let mode = _action.actionNotification.notificationMode;
    mode.webNotification[type] = value;
    _action.actionNotification.notificationMode.notificationMode = mode.notificationMode;
    this.props.commonSetState('action', _action)
  }

  // 插入变量的内容
  vars(type) {
    const { field = [] } = this.props;
    return (
      <div className={styles.varList}>
          {field.map(item => <span key={`${'${'}${item}${'}'}`} onClick={this.insertVar.bind(this, type, item)}>{item}</span>)}
      </div>
    );
  }

  // 插入变量
  insertVar(type, item, event) {
    const _action = _.cloneDeep(this.props.action);

    let mode = _action.actionNotification.notificationMode;
    switch (type) {
      case 'webAudioMessage':
        mode['webNotification']['message'] += '${' + item + '}';
        break;
      default:
        mode[type] += '${' + item + '}';
        break;
    }
    _action.actionNotification.notificationMode.notificationMode = mode.notificationMode;
    this.props.commonSetState('action', _action)
  }

  // 级别变更提醒用户
  changeNotifyLevelUp(type, event) {
    const _action = _.cloneDeep(this.props.action);
    switch (type) {
      case 3:
        _action.actionNotification.notifyWhenLevelUp = event.target.checked;
        break;
      case 6:
        _action.actionChatOps.notifyWhenLevelUp = event.target.checked;
        break;
      default:
        break;
    }
    this.props.commonSetState('action', _action)
  }

  // 是否需要告警升级
  changeShareUpgrade(event) {
    this.props.commonSetState('isShareUpgrade', event.target.checked)
  }

  // 获取实例
  getInstance(type) {
    if (type === 'actionITSM') {
      return this.formByItsm
    } else if (type === 'actionPlugin') {
      return this.formByPlugin
    }
  }

  // 根据不同的type选取不同的TabPane
  switchTabPane(action, newOrHistory, newOrHistoryPlugins) {
    const { actionDelOrClose, actionNotification, actionUpgrade, actionITSM, actionChatOps, actionPlugin, actionSeverity } = action
    const tabPanes = []
    if (newOrHistory) {
      newOrHistory.forEach(instance => {
        switch (Number(instance.type)) {
          case 1:
            {/* 关闭/删除告警 */}
            tabPanes.push(
              <TabPane tab={instance.actionName} key={String(instance.type)}>
                <ActionDelOrClose
                  actionDelOrClose={ actionDelOrClose }
                  changeAction={this.changeAction}
                />
              </TabPane>
            )
            break;
          case 3:
            {/* 告警升级/通知 */}
            tabPanes.push(
              <TabPane tab={instance.actionName} key={String(instance.type)}>
                {/*通知*/}
                <ActionNotification
                  actionNotification={ actionNotification }
                  changeAction={this.changeAction}
                  changeActionByAudio={this.changeActionByAudio}
                  changeNotifyLevelUp={this.changeNotifyLevelUp}
                  changeShareUpgrade={this.changeShareUpgrade}
                  userSearch={this.userSearch}
                  users={this.props.users}
                  rooms={this.props.rooms}
                  emailVarContent={this.emailVarContent}
                  smsVarContent={this.smsVarContent}
                  audioVarContent={this.audioVarContent}
                  notifyTypes={this.props.notifyTypes}
                  target={this.props.target}
                  isShareUpgrade={this.props.isShareUpgrade}
                />
                {/*升级*/}
                {
                  this.props.target === 0 && this.props.isShareUpgrade &&
                  <ActionUpgrade
                    actionUpgrade={actionUpgrade}
                    changeAction={this.changeAction}
                    userSearch={this.userSearch}
                    users={this.props.users}
                  />
                }
              </TabPane>
            )
            break;
          case 4:
            {/* 告警派单 */}
            tabPanes.push(
              <TabPane disabled={this.props.wos.length === 0 ? true : false} tab={instance.actionName} key={String(instance.type)}>
                <CustomField
                  ref={ node => this.formByItsm = node }
                  titlePlacholder={window.__alert_appLocaleData.messages['ruleEditor.itsmType']}
                  tip={window.__alert_appLocaleData.messages['ruleEditor.word3']}
                  vars={ this.props.field || [] }
                  types={ this.props.wos || [] }
                  type={ actionITSM ? actionITSM.itsmModelId : undefined }
                  isNeedVars={true}
                  params={ this.props.ITSMParam }
                  changeType={ this.changeAction.bind(this, 4) }
                />
              </TabPane>
            )
            break;
          case 5:
            {/* 抑制告警 */}
            tabPanes.push(
              <TabPane tab={instance.actionName} key={String(instance.type)}>
                <div>
                  <span>{window.__alert_appLocaleData.messages['ruleEditor.word5']}</span>
                </div>
              </TabPane>
            )
            break;
          case 6:
            {/* 分享到ChatOps */}
            tabPanes.push(
              <TabPane disabled={this.props.rooms.length === 0 ? true : false} tab={instance.actionName} key={String(instance.type)}>
                <ActionChatOps
                  actionChatOps={actionChatOps}
                  rooms={this.props.rooms}
                  target={this.props.target}
                  changeAction={this.changeAction}
                  changeNotifyLevelUp={this.changeNotifyLevelUp}
                />
              </TabPane>
            )
            break;
          case 7:
            {/* 修改告警级别 */}
            tabPanes.push(
              <TabPane tab={instance.actionName} key={String(instance.type)}>
                <ActionSeverity
                  actionSeverity={actionSeverity}
                  changeAction={this.changeAction}
                />
              </TabPane>
            )
            break;
          case 100:
            {/* 动作插件 */}
            tabPanes.push(
              <TabPane tab={instance.actionName} key={String(instance.type)}>
                <CustomField
                  ref={ node => this.formByPlugin = node }
                  titlePlacholder={window.__alert_appLocaleData.messages['ruleEditor.pluginType']}
                  vars={this.props.field || []}
                  types={ newOrHistoryPlugins }
                  type={ actionPlugin ? actionPlugin.uuid : undefined }
                  isNeedVars={false}
                  params={ this.props.PluginParam }
                  changeType={ this.changeAction.bind(this, 100) }
                />
              </TabPane>
            )
            break;
          default:
            break;
        }
      })
    }
    return tabPanes
  }

  // 更改action
  changeAction(type, value) {
    const { dispatch } = this.props;
    const _action = _.cloneDeep(this.props.action);
    switch (type) {
      case 1: // 关闭/删除告警
          _action.actionDelOrClose.operation = Number(value);
          break;
      case 2: // 升级/降级告警
          _action.actionUpgrade = value
          break;
      case 3: // 告警通知
          let mode = _action.actionNotification.notificationMode;
          const { users } = this.props;
          if (_.isArray(value)) { // 通知对象
            let empty = [];
            let arr = [].concat(_action.actionNotification.recipients);
            if (arr.length > value.length) {
              // 删除的情况
              arr.forEach((item, index) => {
                for (let i = value.length; i >= 0; i -= 1) {
                  if (value[i] && value[i]['key'] === item.userId ) {
                    empty.push({
                      userId: item.userId,
                      realName: item.realName,
                      mobile: item.mobile,
                      email: item.email
                    })
                  }
                }
              });
            } else {
              // 新增的情况
              empty = [].concat(arr)
              users.forEach((item, index) => {
                if (value[value.length - 1] && value[value.length - 1]['key'] === item.userId ) {
                  empty.push({
                    userId: item.userId,
                    realName: item.realName,
                    mobile: item.mobile,
                    email: item.email
                  })
                }
              })
            }
            _action.actionNotification.recipients = empty;
          } else if (value.target.type === 'checkbox') { // 通知方式
            if (value.target.checked) { // 选中此通知方式
              mode.notificationMode.push(value.target.value);
              mode.notificationMode = _.uniq(mode.notificationMode);

              this.props.commonSetState('notifyTypes', {
                ...this.props.notifyTypes,
                [value.target.id]: true
              })
            } else { // 移除此通知方式
              mode.notificationMode = mode.notificationMode.filter(item => item !== value.target.value);
              this.props.commonSetState('notifyTypes', {
                ...this.props.notifyTypes,
                [value.target.id]: false
              })
            }
          } else { // 文本
            switch (value.target.id) {
              case 'audioTitle':
                mode['webNotification']['title'] = value.target.value;
                break;
              case 'audioMessage':
                mode['webNotification']['message'] = value.target.value;
                break;
              default:
                mode[value.target.id] = value.target.value;
                break;
            }
          }
          _action.actionNotification.notificationMode.notificationMode = mode.notificationMode;
          break;
        case 4: // 告警派单
              _action.actionITSM.itsmModelId = value;
              this.props.dispatch({
                type: 'alertAssociationRules/getshowITSMParam',
                payload: {
                  id: value
                }
              })
            break;
        case 5: // 抑制告警
            break;
        case 6: // 分享到Chatops
            _action.actionChatOps.chatOpsRoomId = value;
            break;
        case 7: // 修改告警级别
            if (value.type) {
              _action.actionSeverity.type = value.type
            } else {
              _action.actionSeverity.fixedSeverity = value.fixedSeverity
            }
            break;
        case 100: // 动作插件
            _action.actionPlugin.uuid = value;
            this.props.dispatch({
              type: 'alertAssociationRules/getshowPluginParam',
              payload: {
                id: value
              }
            })
            break;
        default:
            throw new Error('未指定动作类型');
    }

    this.props.commonSetState('action', _action)
  }

  render() {

    const newOrHistory = this.props.target ? this.props.actions.historyIncident : this.props.actions.newIncident
    const newOrHistoryPlugins = this.props.target ? this.props.plugins.actionsForHistory : this.props.plugins.actionsForNew

    this.emailVarContent = this.vars('emailMessage');
    this.smsVarContent = this.vars('smsMessage');
    this.audioVarContent = this.vars('webAudioMessage')

    return (
      <div>
        <Tabs
          className={styles.setActions}
          animated={false}
          activeKey={this.props.action.type[0].toString()}
          onChange={this.changeActionType.bind(this)}
        >
          {
            this.switchTabPane(this.props.action, newOrHistory, newOrHistoryPlugins)
          }
        </Tabs>
      </div>
    )
  }
}

Action.defaultProps = {
  action: Constants.DefaultActionsProps
}

Action.propTypes = {
  action: PropTypes.shape({
    ...Constants.ActionsPropTypes
  })
};

export default Action