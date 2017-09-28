import React from 'react';
import { Form, Input, Popover } from 'antd';
import styles from '../Action/actions/customField.less'
import limitFields from './limitField';

function trim(str) { //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

const FormItem = Form.Item;
export default class CTMTitle extends React.Component {
  constructor(props) {
    super(props)
    this.trim = trim.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
  }

  handleCheck(rule, value, callback) {
    value = value || "";
    value = this.trim(value);
    if (value.length === 0) {
      callback( window.__alert_appLocaleData.messages['ITSMWrapper.create.enter_subject'] );
    } else if (value.length > limitFields.ticket.creatTitle) {
      callback( window.__alert_appLocaleData.messages['ITSMWrapper.create.limit_subject'] );
    } else {
      callback();
    }
  }

  render() {
    const { item, getFieldDecorator, prop, vars, formItemLayout, disabled, isNeedVars } = this.props;

    return (
      <div className={styles.wrapper}>
        <FormItem {...formItemLayout}>
          {
            getFieldDecorator('title', _.merge(
              {
                rules: [
                  {
                    required: true,
                    validator: this.handleCheck
                  }
                ]
              },
              prop
            ))(
              <Input
                type="text"
                disabled={ disabled }
              />
            )
          }
        </FormItem>
        {
          !disabled && isNeedVars ?
          <Popover overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={vars}>
              <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
          </Popover>
          :
          null
        }
      </div>

    )
  }
}
