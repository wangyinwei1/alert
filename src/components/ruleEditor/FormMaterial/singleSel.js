import React from 'react';
import { Form, Radio } from 'antd';
import _ from 'lodash'
import classnames from 'classnames'
import styles from '../Action/actions/customField.less'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class CTMSingleSel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, disabled } = this.props;

    return (
      <div className={classnames(styles.fullWidth, styles.wrapper)}>
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
              <RadioGroup
                disabled={ disabled }
                getPopupContainer={() => {
                  return document.getElementById('content') || document.body
                }}
              >
                { _.map(item.params, (param, i) => {
                  return (
                    <Radio key={i} value={ "" + param.value }>
                      { param.label }
                    </Radio>
                  )
                })}
              </RadioGroup>
            )
          }
        </FormItem>
      </div>
    )
  }
}