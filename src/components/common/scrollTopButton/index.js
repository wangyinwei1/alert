import React, { PropTypes, Component } from 'react'
import { Button, BackTop } from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import styles from './index.less'
import { classnames } from '../../../utils'
import $ from 'jquery'

class ScrollTopButton extends Component {
  constructor(props) {
    super(props);
    this.state = { isHovered: false }
  }
  _onMouseEnter() {
    this.setState({ isHovered: true });
  }
  _onMouseOut() {
    this.setState({ isHovered: false });
  }
  render() {
    const localeMessage = defineMessages({
      goTopTip: {
        id: 'go_top.tip',
        defaultMessage: '返回顶部'
      },
    })
    const shouqiClass = classnames(
      'iconfont',
      'icon-xialasanjiao-copy',
      styles.scrollTopIcon
    )
    const scrollTop = function () {
      $("div#topMain").scrollTop("0px");
    }

    const getCookie = function(name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    }

    return (
      <div>
        <BackTop onMouseEnter={() => { this._onMouseEnter() }} onMouseLeave={() => { this._onMouseOut() }} className={styles.scrollTopDiv} onClick={scrollTop} target={() => document.getElementById("topMain")}>
          <div className={styles.backCtrl}>
            <span className={styles.backText} style={{ display: this.state.isHovered ? (getCookie('language') == 'en_US' ? 'inline' : 'block') : 'none' }}><FormattedMessage {...localeMessage['goTopTip']} /></span>
            <div className={styles.scrollTopIconDiv} style={{ display: this.state.isHovered ? 'none' : 'block' }}>
              <i className={shouqiClass} />
            </div>
          </div>
        </BackTop>
      </div>
    )
  }
}

export default injectIntl(ScrollTopButton);