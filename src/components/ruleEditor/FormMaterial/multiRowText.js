import React from 'react';
import { Form, Input, Popover } from 'antd';
import styles from '../Action/actions/customField.less'
const FormItem = Form.Item;

export default class CTMMultiRowText extends React.Component {
  constructor(props) {
    super(props)
  }

  handleCheckMultiRowText(name, rule, value, callback) {
    value = value || "";
    if (rule.required && value === '') {
      callback(window.__alert_appLocaleData.messages['ITSMWrapper.create.enter'] + name);
    } else if (value && rule.max && value.length > rule.max) {
      callback(window.__alert_appLocaleData.messages['ITSMWrapper.create.most_input'] + rule.max + window.__alert_appLocaleData.messages['ITSMWrapper.create.character']);
    } else if (value && value.length < rule.min) {
      callback(window.__alert_appLocaleData.messages['ITSMWrapper.create.minimal_input'] + rule.min + window.__alert_appLocaleData.messages['ITSMWrapper.create.character']);
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
            getFieldDecorator(item.code, _.merge(
              {
                rules: [
                  {
                    required: item.isRequired === 1 ? true : false,
                    min: item.minLength ? item.minLength : null,
                    max: item.maxLength && item.maxLength > item.minLength ? item.maxLength : null,
                    validator: this.handleCheckMultiRowText.bind(this, item.name)
                  }
                ]
              },
              prop
            ))(
              <Input
                type="textarea"
                autosize={{ minRows: 2, maxRows: 8 }}
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
