import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Button } from 'antd'
import styles from './index.less';
import LevelIcon from '../levelIcon/index.js'

function switchVideoSouce(type = '01') {
    let _source = `./sound/Sound${type || '01'}.mp3`;
    return _source;
}

function isLoopVideo(type = 'ONCE') {
  if(type === 'ONCE') {
    return false
  }
  return true
}

function saveref(name, component) {
    this[name] = component
}

class Notice extends Component {
  constructor(props) {
    super(props)
    this.closeTimer = null // duration timeOut
    this.pauseTimer = null // duration voice play some Secs
    this.close = this.close.bind(this)
    this.clearTimer = this.clearTimer.bind(this)
    this.switchVideoSouce = switchVideoSouce.bind(this)
    this.isLoopVideo = isLoopVideo.bind(this)
    this.saveAudioRef = saveref.bind(this, 'audioInstance')
  }

  static propTypes = {
    timeOut: React.PropTypes.number,
    onClose: React.PropTypes.func,
    children: React.PropTypes.any
  }
  static defaultProps = {
    onClose: () => {},
    timeOut: 0 // when audio player loop duration time
  }

  clearTimer() {
    if (this.closeTimer || this.pauseTimer) {
      clearTimeout(this.closeTimer)
      clearTimeout(this.pauseTimer)
      this.closeTimer = null;
      this.pauseTimer = null;
    }
  }

  close() {
    this.clearTimer();
    this.props.onClose();
  }

  componentDidMount() {
    if (this.props.timeOut) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.props.timeOut * 1000);
    }
    if (this.props.playTimeType && this.props.playTimeType === 'TENSEC') {
      this.pauseTimer = setTimeout(() => {
        if (this.audioInstance) {
          this.audioInstance.pause()
        }
      }, 10 * 1000)
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  render() {
    const props = this.props;
    const noticeCls = [
      styles[`${props.prefix}-notice`]
    ]
    const contentCls = [
      styles[`${props.prefix}-content`]
    ]
    return (
      <div className={classnames(...noticeCls)}>
          <div className={classnames(...contentCls)}>
            <p className={styles.title}>{props.title}</p>
            <div><LevelIcon extraStyle={styles.icon} iconType={props.severity}/>{`${window['_severity'][props.severity]}`}</div>
            <p className={styles.message}>{props.message}</p>
            <div className={styles.ok}><Button type="primary" onClick={this.close}>{window.__alert_appLocaleData.messages['modal.ok']}</Button></div>
          </div>
          <a tabIndex="0" onClick={this.close} className={styles[`${props.prefix}-close`]}>
            <span className={styles[`${props.prefix}-close-x`]}></span>
          </a>
          {React.cloneElement(<audio />, {
            ref: this.saveAudioRef,
            src: this.switchVideoSouce(props.voiceType),
            loop: this.isLoopVideo(props.playTimeType),
            autoPlay: true
          })}
      </div>
    )
  }
}

export default Notice