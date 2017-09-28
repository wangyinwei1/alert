import React, { PropTypes, Component } from 'react';
import { default as cls } from 'classnames';
import {
    Form,
    Input,
    Radio,
    Select,
    Tabs,
    Popover,
    Checkbox
} from 'antd';
import _ from 'lodash'

import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class NotificationList extends Component {
    constructor(props) {
        super(props)
        this.formatDate = this.formatDate.bind(this)
    }

    changeAction(value) {
        const {
            changeAction
        } = this.props;

        changeAction(value);
    }

    formatDate(time){
      const d = new Date(+time);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let date = d.getDate();
      let hours = d.getHours();
      let mins = d.getMinutes();

      hours = hours < 10 ? '0' + hours : hours
      mins = mins < 10 ? '0' + mins : mins

      return year + '/' + month + '/' + date + ' ' + hours + ':' + mins
    }

    render() {
        const {
            recipients,
            checkedState,
            notifyIncident,
            notifyUsers,
            action,
            disableChatOps
        } = this.props;

        const desLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };

        return (
            <div className={styles.wrapper}>
                <FormItem
                    {...desLayout}
                    label={window.__alert_appLocaleData.messages['ruleEditor.notifyObj']}
                >
                    <Select
                        getPopupContainer={() => {
                          return document.getElementById("content") || document.body
                        }}
                        mode="multiple"
                        labelInValue
                        filterOption={false}
                        placeholder={window.__alert_appLocaleData.messages['ruleEditor.notifySelectObj']}
                        onChange={this.changeAction.bind(this)}
                        className={styles.recipients}
                        value={recipients}
                        onSearch={
                          _.debounce( (value) => {
                            this.props.userSearch(value)
                          }, 500)
                        }
                    >
                        {
                            notifyUsers.map((item, index) => <Option key={item.userId} value={item.userId}>{item.realName}</Option>)
                        }
                    </Select>
                </FormItem>
                <Tabs animated={false} className={styles.notificationTabs}>
                    <TabPane tab={
                        <div>
                            <Checkbox
                                id="email"
                                checked={checkedState.email}
                                value={1}
                                onChange={this.changeAction.bind(this)}
                            />
                            <span>{window.__alert_appLocaleData.messages['ruleEditor.email']}</span>
                        </div>
                    } key="1">

                        <div>
                            <FormItem
                                {...desLayout}
                                label={window.__alert_appLocaleData.messages['ruleEditor.emailTitle']}
                                className={styles.mailTitle}
                            >
                                <Input id="emailTitle"
                                    value={
                                        action.actionNotification.notificationMode ?
                                        action.actionNotification.notificationMode.emailTitle
                                        :
                                        `${notifyIncident.entityName}:${notifyIncident.name}`
                                    }
                                    onChange={this.changeAction.bind(this)}
                                />

                            </FormItem>
                            <FormItem
                                {...desLayout}
                                label={window.__alert_appLocaleData.messages['ruleEditor.emailCon']}
                                className={styles.msgContent}
                            >
                                <Input id="emailMessage"
                                    value={
                                        action.actionNotification.notificationMode ?
                                        action.actionNotification.notificationMode.emailMessage
                                        :
                                        `${window['_severity'][notifyIncident.severity]}, ${notifyIncident.entityName}, ${this.formatDate(notifyIncident.firstOccurTime)}, ${notifyIncident.description}`
                                    }
                                    onChange={this.changeAction.bind(this)}
                                    type="textarea"
                                    autosize={{ minRows: 4, maxRows: 6 }}
                                />

                            </FormItem>

                        </div>
                    </TabPane>
                    <TabPane tab={
                        <div>
                            <Checkbox
                                id="sms"
                                checked={checkedState.sms}
                                value={2}
                                onChange={this.changeAction.bind(this)}
                            />
                            <span>{window.__alert_appLocaleData.messages['ruleEditor.sms']}</span>
                        </div>
                    } key="2">
                        <div>
                            <FormItem
                                {...desLayout}
                                label={window.__alert_appLocaleData.messages['ruleEditor.smsCon']}
                                className={styles.msgContent}
                            >
                                <Input id="smsMessage"
                                    value={
                                        action.actionNotification.notificationMode ?
                                        action.actionNotification.notificationMode.smsMessage
                                        :
                                        `${window['_severity'][notifyIncident.severity]}, ${notifyIncident.entityName}, ${this.formatDate(notifyIncident.firstOccurTime)}, ${notifyIncident.description}`
                                    }
                                    onChange={this.changeAction.bind(this)}
                                    type="textarea"
                                    autosize={{ minRows: 4, maxRows: 6 }}
                                />
                            </FormItem>
                        </div>
                    </TabPane>
                    <TabPane disabled={disableChatOps} tab={
                        <div>
                            <Checkbox
                                id="chatops"
                                disabled={disableChatOps}
                                checked={checkedState.chatops}
                                value={3}
                                onChange={this.changeAction.bind(this)}
                            />
                            <span>{window.__alert_appLocaleData.messages['ruleEditor.chatops']}</span>
                        </div>
                    } key="3" />
                </Tabs>
            </div>
        );
    }
}

NotificationList.defaultProps = {};

NotificationList.propsTypes = {};

export default NotificationList;
