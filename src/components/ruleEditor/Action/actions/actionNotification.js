import React, { PropTypes, Component } from 'react'
import { Form, Select, Checkbox } from 'antd'
import NotificationList from './notificationList.js'
import _ from 'lodash'
import styles from './commonStyle.less'

const FormItem = Form.Item
const Option = Select.Option

const desLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 10 }
}
export default class ActionNotification extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { actionNotification } = this.props
    return (
      <div className={styles.actionNotification}>
        <FormItem
          {...desLayout}
          label={window.__alert_appLocaleData.messages['ruleEditor.notifyObj']}
        >
          <Select
            getPopupContainer={() => document.getElementById("content") || document.body }
            mode="multiple"
            labelInValue
            style={{ width: 200 }}
            filterOption={false}
            placeholder={window.__alert_appLocaleData.messages['ruleEditor.notifySelectObj']}
            onChange={this.props.changeAction.bind(null, 3)}
            className={styles.recipients_notify}
            value={actionNotification ? actionNotification.recipients.map(item => ({key: item.userId, label: item.realName})) : []}
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
        </FormItem>
        <div className={styles.NotificationListWrap}>
            <div className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.notifyMode']}</div>
            <NotificationList
              checkedState={this.props.notifyTypes}
              changeAction={this.props.changeAction.bind(null)}
              changeActionByAudio={this.props.changeActionByAudio.bind(null)}
              actionNotification={ actionNotification }
              smsVarContent={this.props.smsVarContent}
              emailVarContent={this.props.emailVarContent}
              audioVarContent={this.props.audioVarContent}
              rooms={this.props.rooms}
            />
        </div>
        {
          this.props.target === 0 &&
          <div>
            <Checkbox
              className={styles.nLevelUp}
              checked={actionNotification && actionNotification.notifyWhenLevelUp}
              onChange={this.props.changeNotifyLevelUp.bind(null, 3)}
            >
              {window.__alert_appLocaleData.messages['ruleEditor.nLevelUp']}
            </Checkbox>
            <Checkbox
              className={styles.shareUpgrade}
              checked={this.props.isShareUpgrade}
              onChange={this.props.changeShareUpgrade.bind(null)}
            >
              {window.__alert_appLocaleData.messages['ruleEditor.isShareUpgrade']}
            </Checkbox>
          </div>
        }
      </div>
    )
  }
}