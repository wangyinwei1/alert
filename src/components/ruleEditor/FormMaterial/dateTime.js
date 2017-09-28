import React from 'react';
import { Form, DatePicker } from 'antd';
import moment from 'moment'
import styles from '../Action/actions/customField.less'
const FormItem = Form.Item;

export default class CTMDateTime extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, disabled } = this.props;

    let wrapper = prop.initialValue ? item.formatDate ? { initialValue: moment(prop.initialValue, 'YYYY-MM-DD') } : { initialValue: moment(prop.initialValue, 'YYYY-MM-DD HH:mm') } : {}

    return (
      <div className={styles.wrapper}>
        <FormItem {...formItemLayout}>
          {
            getFieldDecorator(item.code, _.merge(
              {
                rules: [
                  {
                    required: item.isRequired === 1 ? true : false,
                    message: window.__alert_appLocaleData.messages['ITSMWrapper.create.select_right'] + item.name
                  }
                ]
              },
              wrapper
            ))(
              <DatePicker
                disabled={ disabled }
                showTime={ item.formatDate ? false : true }
                format={ item.formatDate ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm" }
                getCalendarContainer={ ()=> {
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
