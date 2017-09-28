import React from 'react';
import { Form, Select, Tooltip, message } from 'antd';
import {
  getUsers
} from '../../../services/app.js'
import { getUUID } from '../../../utils/index'
import limitField from './limitField.js'
import _ from 'lodash'
import styles from '../Action/actions/customField.less'

const FormItem = Form.Item;
const Option = Select.Option;

class CTMUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userList: [] // 列表
    }
    this.userSearch = this.userSearch.bind(this)
  }


  userSearch(value = '') {
    getUsers({
      realName: value
    }).then((data) => {
      if (data.result) {
        this.setState({
          userList: data.data || []
        })
      } else {
        message.error(data.message, 3)
      }
    })
  }

  componentDidMount() {
    this.userSearch()
  }

  changeUsers(value) {
      const select = _.cloneDeep(this.props.prop.initialValue);
      const users = this.state.userList;
      let empty = [];
      let arr = [].concat(select);
      if (arr.length > value.length) {
        // 删除的情况
        arr.forEach((item) => {
          for (let i = value.length; i >= 0; i -= 1) {
              if (value[i] && value[i]['key'] === item.userId ) {
                  empty.push({
                      userId: item.userId,
                      realName: item.realName,
                      mobile: item.mobile,
                      email: item.email
                  });
              }
          }
        });
      } else {
        // 新增的情况
        empty = [].concat(arr)
        users.forEach((item) => {
          if (value[value.length - 1] && value[value.length - 1]['key'] === item.userId ) {
              empty.push({
                  userId: item.userId,
                  realName: item.realName,
                  mobile: item.mobile,
                  email: item.email
              });
          }
        })
      }
      this.props.changeUsers(empty)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, disabled } = this.props;
    let initialValue = prop.initialValue.map(item => ({key: item.userId, label: item.realName}))
    return (
      <div className={styles.wrapper}>
        <FormItem {...formItemLayout}>
          {
            getFieldDecorator(`${limitField.PREFIX_USERTYPE}${item.code}`, _.merge(
              {
                ...prop,
                initialValue
              }
            ))(
              <Select
                  style={{ width: 250 }}
                  disabled={disabled}
                  mode="multiple"
                  labelInValue
                  filterOption={false}
                  placeholder={ window.__alert_appLocaleData.messages['ruleEditor.notifySelectObj'] }
                  onChange={this.changeUsers.bind(this)}
                  getPopupContainer={() => {
                    return document.getElementById('content') || document.body
                  }}
                  onSearch={
                    _.debounce( (value) => {
                      this.userSearch(value)
                    }, 500)
                  }
              >
                  {
                      this.state.userList.map((item, index) => <Option key={item.userId} value={item.userId}>{item.realName}</Option>)
                  }
              </Select>
            )
          }
        </FormItem>
      </div>

    )
  }
}



export default class Wrapper extends React.Component {

  constructor(props) {
    super(props)
    this.changeUsers = this.changeUsers.bind(this)
    this.state = {
      select: []
    }
  }

  changeUsers(empty) {
    this.setState({
      select: empty
    })
  }

  render() {
    // 这是针对编辑进来有初始化值且无过程选项的一个处理
    let init = this.props.prop && this.props.prop.initialValue ? this.props.prop.initialValue.map(user => ({ userId: user.key, realName: user.label })) : []
    // 以下为在过程中修过用户组
    if (this.state.select.length) {
      init = _.cloneDeep(this.state.select)
    }
    let props = {
      ...this.props,
      prop: {
        ...this.props.prop,
        initialValue: init
      },
      changeUsers: this.changeUsers
    }
    return (
      <CTMUser {...props}/>
    )
  }
}
