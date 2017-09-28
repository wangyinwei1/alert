import React, { PropTypes, Component } from 'react'
import { Select } from 'antd'
import styles from './commonStyle.less'

const Option = Select.Option
export default class ActionDelOrClose extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { actionDelOrClose } = this.props

    return (
      <div className={styles.actionDelOrClose}>
        <em>{window.__alert_appLocaleData.messages['ruleEditor.word2']}</em>
        <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word1']}</span>
        <Select
          getPopupContainer={() => document.getElementById("content") || document.body}
          style={{ width: 150 }}
          value={actionDelOrClose && typeof actionDelOrClose.operation === 'number' ? String(actionDelOrClose.operation) : undefined}
          placeholder={window.__alert_appLocaleData.messages['ruleEditor.phCloseOrDel']}
          onChange={this.props.changeAction.bind(null, 1)}
        >
          <Option value='1'>{window.__alert_appLocaleData.messages['ruleEditor.del']}</Option>
          <Option value='2'>{window.__alert_appLocaleData.messages['ruleEditor.close']}</Option>
        </Select>
        <span className={styles.label}>{window.__alert_appLocaleData.messages['ruleEditor.word4']}</span>
      </div>
    )
  }
}