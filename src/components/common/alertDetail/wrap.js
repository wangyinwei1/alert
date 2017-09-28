import React, {Component} from 'react'
import styles from './index.less'
import { classnames, isMobile } from '../../../utils'
import { Button } from 'antd'

export default class Wrap extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: typeof props.visible === 'undefined'?true:props.visible};
  }
  toggleVisible() {
    const visible = this.state.visible;
    this.setState({ ...this.state, visible: !visible });
  }
  render() {
    const {title, children, toggleVisible} = this.props;
    const xialaClass = classnames(
        'icon',
        'iconfont',
        'icon-xialasanjiao-copy'
    )
    const shanglaClass = classnames(
        'icon',
        'iconfont',
        'icon-xialasanjiao'
    )
    return (
      <div className={ !(isMobile()) ? styles.info : classnames(styles.info, styles.mobileInfo) }>
        <div className={ styles.infoTitle }>
          <p onClick={toggleVisible || (() => {this.toggleVisible()})}>{ title } <Button ghost className={ styles.setVisibleIcon } onClick={toggleVisible || (() => {this.toggleVisible()})}><i href="javascript:;" className={ (this.state.visible?xialaClass : shanglaClass) + ' ' }/></Button></p>
        </div>
        <div className={ classnames(styles.infoBody)  }>
          <div className={ this.state.visible?styles.showInfo:styles.hideInfo }>
          {
            children
          }
          </div>
        </div>
      </div>
    )
  }
}