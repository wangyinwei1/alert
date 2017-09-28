import React from 'react';
import { Select } from 'antd';
import styles from '../Action/actions/customField.less'
import classnames from 'classnames'

const Option = Select.Option
export default class Prefix extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item, children, options, changeUper, delUper } = this.props;
    const arrow = classnames(
      'icon',
      'icon-arrowdown',
      'iconfont'
    )

    return (
      <div>
        {
          !(item.isRequired === 1) ?
          <Select defaultValue={item.code} placeholder={window.__alert_appLocaleData.messages['ITSMWrapper.create.selectType']} onChange={(code) => {changeUper(code)}}>
            {
              options.length ?
              options.map((item) => {
                return <Option key={item.code} value={item.code}>{item.name}</Option>
              })
              :
              []
            }
          </Select>
          :
          <div className={styles.key}>{item.name}</div>
        }
        <i className={classnames(arrow, styles.arrow)}></i>
        { children }
        {
          !(item.isRequired === 1) ?
          <i className={styles.delUper} onClick={delUper}>X</i>
          :
          null
        }
     </div>
    )
  }
}
