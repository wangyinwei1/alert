import React, { PropTypes, Component } from 'react'
import { Select, Checkbox, Row} from 'antd'
import styles from './commonStyle.less'

const Option = Select.Option
export default class ActionChatOps extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { actionChatOps } = this.props

    return (
      <div className={styles.actionChatOps}>
        <div style={{marginBottom: '20px'}}>
          <span>{window.__alert_appLocaleData.messages['ruleEditor.chatopsGroup']}：</span>
          <Select
            getPopupContainer={() => document.getElementById("content") || document.body }
            style={{ width: 200 }}
            value={ actionChatOps ? actionChatOps.chatOpsRoomId : undefined }
            placeholder={window.__alert_appLocaleData.messages['ruleEditor.phChatopsGroup']}
            onChange={this.props.changeAction.bind(null, 6)}
          >
            {
              this.props.rooms.map(item => <Option key={item.id}>{item.topic}</Option>)
            }
          </Select>
        </div>
        {
          this.props.target === 0 &&
          <Row>
            <Checkbox
              className={styles.nLevelUp}
              style={{left: '0px'}}
              checked={ actionChatOps && actionChatOps.notifyWhenLevelUp }
              onChange={this.props.changeNotifyLevelUp.bind(null, 6)}
            >
              {window.__alert_appLocaleData.messages['ruleEditor.nLevelUp']}
            </Checkbox>
          </Row>
        }
      </div>
    )
  }
}