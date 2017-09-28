import React, { Component, PropTypes } from 'react'
import { Input } from 'antd'
import styles from './index.less'
import { classnames } from '../../../utils/index'

class AlertInput extends Component {
  constructor(props) {
    super(props);
    this.state = { wordNum: 0 }
  }
  componentWillReceiveProps(newProps) {
    if(newProps.value) {
      this.state.wordNum = newProps.value.length;
    }
  }

  onChange(e) {
    this.props.onChange && this.props.onChange(e);
  }

  render() {
    const { wordLimit, value='', onChange, overWarnClassName, pClassName, ...otherProps } = this.props;
    const wordNum = value.length;
    return (
      <div className={classnames(styles.inputArea, pClassName || '')}>
        <Input {...otherProps} style={{ paddingRight: 42 }} value={value} onChange={(e) => { this.onChange(e) }}/>
        {
          wordLimit?
          <div className={classnames(styles.countArea, wordNum > wordLimit?(overWarnClassName || styles.warn):'')}>{ wordNum } / { wordLimit }</div>
          :
          undefined
        }

      </div>
    )
  }
}

AlertInput.propTypes = {
  overWarnClassName: PropTypes.string, // 字数超标的样式
  wordLimit: PropTypes.number, //字数限制，如果不填则不显示字数限制
  pClassName: PropTypes.string // 设置包含着Input的容器的样式，用于Input定宽且与父容器宽度不一致的时候
}

export default AlertInput;