import React, { PropTypes, Component } from 'react'
import { Select } from 'antd'
import styles from './commonStyle.less'
import { default as cls } from 'classnames';

const Option = Select.Option
const arrow = cls(
  'icon',
  'icon-arrowdown',
  'iconfont'
)

export default class ActionSeverity extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { actionSeverity } = this.props

    return (
      <div className={styles.actionSeverity}>
        <p>{window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.severity']}</p>
        <div className={styles.content}>
          <Select
            getPopupContainer={ () => {
              return document.getElementById("content") || document.body
            } }
            style={{ width: 100 }}
            placeholder={ window.__alert_appLocaleData.messages['ruleEditor.actionSeverity'] }
            value={ actionSeverity ? actionSeverity.type : undefined }
            onChange={ (value) => { this.props.changeAction(7, { type: value }) } }
          >
            <Option value='1'>{window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.fixed']}</Option>
            <Option value='2'>{window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.up']}</Option>
            <Option value='3'>{window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.down']}</Option>
          </Select>
          {
            actionSeverity && actionSeverity.type === '1' ?
            <i className={cls(arrow, styles.arrow)}></i> : undefined
          }
          {
            actionSeverity && actionSeverity.type === '1' ?
            <Select
              getPopupContainer={ () => {
                return document.getElementById("content") || document.body
              } }
              style={{ width: 100 }}
              placeholder={ window.__alert_appLocaleData.messages['ruleEditor.actionSeverity.fixed'] }
              value={ actionSeverity ? actionSeverity.fixedSeverity : undefined }
              onChange={ (value) => { this.props.changeAction(7, { fixedSeverity: value }) } }
            >
              <Option value="3" >{window['_severity']['3']}</Option>
              <Option value="2" >{window['_severity']['2']}</Option>
              <Option value="1" >{window['_severity']['1']}</Option>
              <Option value="0" >{window['_severity']['0']}</Option>
            </Select>
            : undefined
          }
        </div>
      </div>
    )
  }
}