import React from 'react';
import { Form, Checkbox } from 'antd';
import styles from '../Action/actions/customField.less'
import classnames from 'classnames'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

export default class CTMMultSel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, disabled } = this.props;

    const option = [];
    const params = item.params;
    for (let i = 0; i < params.length; i++) {
      option.push(params[i]);
    }

    return (
      <div className={classnames(styles.fullWidth, styles.wrapper)}>
        <FormItem {...formItemLayout}>
          {
            getFieldDecorator(item.code, _.merge(
              {
                rules: [
                  {
                    required: item.isRequired === 1 ? true : false,
                    type: 'array',
                    message: window.__alert_appLocaleData.messages['ITSMWrapper.create.select'] + item.name
                  }
                ]
              },
              prop
            ))(
              <CheckboxGroup
                disabled={ disabled }
                options={option}
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
