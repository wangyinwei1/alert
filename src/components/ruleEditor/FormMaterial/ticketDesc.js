import React from 'react';
import { Form, Input, Popover } from 'antd';
import limitFields from './limitField';
import styles from '../Action/actions/customField.less'

const FormItem = Form.Item;
export default class CTMTicketDesc extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, getFieldDecorator, prop, vars, formItemLayout, disabled, isNeedVars } = this.props;

    return (
      <div className={styles.wrapper}>
        <FormItem {...formItemLayout}>
          {
            getFieldDecorator('ticketDesc', _.merge(
              {
                rules: [
                  {
                    min: 0,
                    max: limitFields.ticket.ticketDesc,
                    message: window.__alert_appLocaleData.messages['ITSMWrapper.create.most_description']
                  }
                ]
              },
              prop
            ))(
              <Input
                type="textarea"
                disabled={ disabled }
                autosize={{ minRows: 2, maxRows: 8 }}
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
