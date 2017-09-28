import React, { Component } from 'react';
import { Form, Cascader } from 'antd';
import styles from '../Action/actions/customField.less'
import _ from 'lodash'

const FormItem = Form.Item;
export default class CTMCascader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, disabled } = this.props;

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
                <Cascader
                  allowClear
                  disabled={ disabled }
                  placeholder={ window.__alert_appLocaleData.messages['ITSMWrapper.create.select'] + item.name }
                  options={ item.cascade }
                  changeOnSelect
                  getPopupContainer={() => {
                    return document.getElementById('content') || document.body
                  }}
                />
              )
            }
        </FormItem>
        </div>
    )
  }
}
