import React from 'react'
import { Form, Select, Row, Col, Tooltip} from 'antd';
import styles from '../Action/actions/customField.less'
import limitField from './limitField.js'
import classnames from 'classnames'
import _ from 'lodash'

const FormItem = Form.Item;
const Option = Select.Option;

export default class Executor extends React.Component {
  constructor(props) {
    super(props)
  }

  handleCheck(rule, value, callback) {
    value = value || []
    if (value.length === 0) {
      callback( window.__alert_appLocaleData.messages['ITSMWrapper.create.select_handler'] )
    } else {
      callback()
    }
  }

  render() {
    const { item, getFieldDecorator, prop } = this.props;

    return (
      <Row>
        <Col span={3} >
          <div className={styles.tacheName}>
            {item.name.length > 15 ? item.name.substr(0,15) + '...' : item.name}
          </div>
        </Col>
        <Col span={12} className={styles.manageStyle}>
          <FormItem>
            {
              getFieldDecorator(`${limitField.PREFIX_EXECUTOR}${item.id}`, {
                // rules: [
                //   {
                //     validator: this.handleCheck.bind(this)
                //   }
                // ],
                ...prop
              })(
                <Select
                  mode="multiple" showSearch  optionFilterProp="children"
                  notFoundContent={ window.__alert_appLocaleData.messages['ITSMWrapper.create.find'] }
                  placeholder={ window.__alert_appLocaleData.messages['ITSMWrapper.create.select_handler'] }
                  getPopupContainer={() => {
                    return document.getElementById('content') || document.body
                  }}
                >
                  {
                    _.map(item.users, (user, index) => {
                      return (
                        <Option key={index} value={user.userId}>{user.realname}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </FormItem>
        </Col>
      </Row>
    )
  }
}

