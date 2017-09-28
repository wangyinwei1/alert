import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
import { Select, InputNumber } from 'antd'
import styles from './commonStyle.less'

const Option = Select.Option

export default class ActionUpgrade extends Component {
  constructor(props) {
    super(props)
  }

  // 修改告警升级delay时间
  changeUpgrade(index, event) {
    const _actionUpgrade = _.cloneDeep(this.props.actionUpgrade);

    _actionUpgrade.notificationGroupings[index].delay = Number(event.target.value);

    this.props.changeAction(2, _actionUpgrade)
  }

  // 修改告警升级状态
  changeUpgradeMode(index, value) {
    const _actionUpgrade = _.cloneDeep(this.props.actionUpgrade);
    let val = [];
    switch(value) {
      case '0':
        val = [150, 190]
        break;
      case '1':
        val = [150]
        break;
      case '2':
        val = [255]
        break;
      default:
        break;
    }
    _actionUpgrade.notificationGroupings[index].status = val;

    this.props.changeAction(2, _actionUpgrade)
  }

  // 修改提醒用户
  changeUpgradeRecipients(index, value) {
    const _actionUpgrade = _.cloneDeep(this.props.actionUpgrade);

    const { users } = this.props;
    let empty = [];
    let arr = [].concat(_actionUpgrade.notificationGroupings[index].recipients);
    if (arr.length > value.length) {
      // 删除的情况
      arr.forEach((item) => {
        for (let i = value.length; i >= 0; i -= 1) {
          if (value[i] && value[i]['key'] === item.userId ) {
            empty.push({
              userId: item.userId,
              realName: item.realName,
              mobile: item.mobile,
              email: item.email
            });
          }
        }
      });
    } else {
      // 新增的情况
      empty = [].concat(arr)
      users.forEach((item) => {
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
    _actionUpgrade.notificationGroupings[index].recipients = empty;

    this.props.changeAction(2, _actionUpgrade)
  }

  // 增加
  addNotificationGroup() {
    const _actionUpgrade = _.cloneDeep(this.props.actionUpgrade);
    const item = {
        delay: 15,
        status: [],
        recipients: []
    };
    _actionUpgrade.notificationGroupings.push(item);

    this.props.changeAction(2, _actionUpgrade)
  }

  // 删除
  delNotificationGroup(index) {
    const _actionUpgrade = _.cloneDeep(this.props.actionUpgrade);
    _actionUpgrade.notificationGroupings.splice(index, 1, null);

    this.props.changeAction(2, _actionUpgrade)
  }


  render() {
    const { actionUpgrade } = this.props

    return (
      <div className={styles.actionUpgrade}>
        <div className={styles.upgradelabel}>{window.__alert_appLocaleData.messages['ruleEditor.upgradelabel']}</div>
        {
          actionUpgrade.notificationGroupings.map((item, index) => {
            if (item) {
              return (
                // 此处可能有BUG：数据的key值不是唯一
                <div key={index} className={styles.reclist}>
                  <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word9']}</span>
                  <InputNumber style={{ width: 60 }} defaultValue={item.delay} onBlur={this.changeUpgrade.bind(this, index)} />
                  <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word6']}</span>
                  <Select
                    // mode="multiple"
                    style={{ width: 180 }}
                    placeholder={window.__alert_appLocaleData.messages['ruleEditor.word8']}
                    onChange={this.changeUpgradeMode.bind(this, index)}
                    value={(() => {
                      if (item.status.length === 2) {
                        return '0';
                      } else if (item.status.length === 1) {
                        return item.status[0] === 255 ? '2' : '1';
                      } else {
                        return undefined;
                      }
                    })()}
                  >
                    <Option value='0'>{window.__alert_appLocaleData.messages['ruleEditor.s1']}</Option>
                    <Option value='1'>{window.__alert_appLocaleData.messages['ruleEditor.s3']}</Option>
                    <Option value='2'>{window.__alert_appLocaleData.messages['ruleEditor.s5']}</Option>
                  </Select>
                  <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word7']}</span>
                  <Select
                    style={{ width: 250 }}
                    mode="multiple"
                    labelInValue
                    filterOption={false}
                    placeholder={window.__alert_appLocaleData.messages['ruleEditor.notifySelectObj']}
                    onChange={this.changeUpgradeRecipients.bind(this, index)}
                    value={item.recipients.map(item => ({key: item.userId, label: item.realName}))}
                    onSearch={
                      _.debounce( (value) => {
                        this.props.userSearch(value)
                      }, 500)
                    }
                  >
                    {
                      this.props.users.map((item, index) => <Option key={item.userId} value={item.userId}>{item.realName}</Option>)
                    }
                  </Select>
                  {
                    index === 0
                      ? <i className={styles.addUper} onClick={this.addNotificationGroup.bind(this)}>+</i>
                      : <i className={styles.delUper} onClick={this.delNotificationGroup.bind(this, index)}>X</i>
                  }
                </div>
              )
            } else {
              return null;
            }
          })
        }
      </div>
    )
  }
}