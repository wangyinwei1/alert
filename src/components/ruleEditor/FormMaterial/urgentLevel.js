import React from 'react';
import { Form, Input } from 'antd';
import styles from '../Action/actions/customField.less'
import classnames from 'classnames'
import _ from 'lodash'
const FormItem = Form.Item;

export default class CTUrgentLevel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, disabled } = this.props;

    return (
      <div className={styles.wrapper}>
        <FormItem {...formItemLayout}>
          {
            <Input value={ window.__alert_appLocaleData.messages['ITSMWrapper.create.urgentLevel'] } readOnly />
          }
        </FormItem>
      </div>
    )
  }
}
