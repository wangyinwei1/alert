import React from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../Action/actions/customField.less'
const FormItem = Form.Item;

export default class CTMInt extends React.Component {
  constructor(props) {
    super(props)
  }

  handleCheckInt(name, rule, value, callback) {
    value = value || null;
    if (rule.required && value == null) {
      callback( window.__alert_appLocaleData.messages['ITSMWrapper.create.enter'] + name );
    } else if ( value && rule.max != null && value > rule.max ) {
      callback( window.__alert_appLocaleData.messages['ITSMWrapper.create.maximum'] + rule.max );
    } else if ((value && rule.min != null && value < rule.min) || (value == null && value < rule.min)) {
      callback( window.__alert_appLocaleData.messages['ITSMWrapper.create.minimum'] + rule.min );
    } else {
      callback();
    }
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
                    type: 'integer',
                    min: item.intMin != null ? item.intMin : null ,
                    max: item.intMax != null && item.intMax > item.intMin ? item.intMax : null,
                    validator: this.handleCheckInt.bind(this, item.name)
                  }
                ]
              },
              prop
            ))(
              <InputNumber
                disabled={ disabled }
              />
            )
          }
          <span style={{color: "#6ca4cd"}}>{item.unit ? item.unit : null}</span>
        </FormItem>
      </div>
    )
  }
}
