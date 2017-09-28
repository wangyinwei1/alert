import React, { Component } from 'react'
import { connect } from 'dva'
import { Popover } from 'antd'
import styles from './index.less'


// 变量选择组件
class VarsSelect extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'vars/initVars',
    })
  }
  render() {
    const { fields, insertVar=()=>{} } = this.props;

    const fieldContent = (
      <div className={styles.varList}>
        {fields.map(item => <span key={`${'${'}${item}${'}'}`} onClick={() => insertVar(item)}>{item}</span>)}
      </div>
    )

    return (
      <Popover overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={fieldContent}>
        <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
      </Popover>
    )
  }
}

export default connect((state) => {
  return {
    fields: state.vars.list
  }
})(VarsSelect)