import React from 'react';
import { Form, Select } from 'antd';
import styles from '../Action/actions/customField.less'
import _ from 'lodash'
const FormItem = Form.Item;
const Option = Select.Option;

export default class CTMListSel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, notInit, disabled } = this.props;

    return (
      <div className={styles.wrapper}>
        <FormItem {...formItemLayout}>
          {
            getFieldDecorator(item.code, _.merge(
              {
                rules: [
                  {
                    required: item.isRequired === 1 ? true : false,
                    message: window.__alert_appLocaleData.messages['ITSMWrapper.create.select'] + item.name
                  }
                ]
              },
              prop
            ))(
              <Select
                disabled={ disabled }
                placeholder={ window.__alert_appLocaleData.messages['ITSMWrapper.create.select'] + item.name }
                notFoundContent={ window.__alert_appLocaleData.messages['ITSMWrapper.create.find'] }
                getPopupContainer={() => {
                  return document.getElementById('content') || document.body
                }}
                allowClear
              >
                { _.map(item.params, (param, i) => {
                  return (
                    <Option key={ item.id + i } value={ '' + param.value }>
                      { param.label }
                    </Option>
                  )
                })}
              </Select>
            )
          }
        </FormItem>
      </div>
    )
  }
}

