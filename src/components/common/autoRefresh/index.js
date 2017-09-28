import React, { PropTypes } from 'react'
import styles from './index.less'
import { Switch } from 'antd'
import { connect } from 'dva'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

class autoRefresh extends React.Component {

  constructor(props) {
    super(props)
    this.autoRefreshTimer = null
    this.state = {
      isRefresh: (localStorage.getItem(`UYUN_Alert_${props.origin}Refresh`) == 'true') || false
    }
    if (this.state.isRefresh) {
      this.autoRefreshTimer = setInterval(function () {
          props.refresh(props.origin)
      }, 60000)
    }
  }


  change(checked) {
    localStorage.setItem(`UYUN_Alert_${this.props.origin}Refresh`, checked)
    this.setState({
      isRefresh: checked
    })
    if (!checked) {
      this.autoRefreshTimer && clearInterval(this.autoRefreshTimer)
      this.autoRefreshTimer = null

    } else {
      if (!this.autoRefreshTimer) {
        this.autoRefreshTimer = setInterval(() => {
          this.props.refresh(this.props.origin)
        }, 60000)
      }
    }
  }

  componentWillUnmount() {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer)
    }
    this.autoRefreshTimer = null
  }

  render() {

    const localeMessage = defineMessages({
      auto_refresh: {
        id: 'alertList.autoRefresh',
        defaultMessage: '自动刷新'
      }
    })

    return (
      <div className={`${styles.alertSwitch} refresh-top`}>
        <span><FormattedMessage {...localeMessage['auto_refresh']} /></span>
        <Switch onChange={this.change.bind(this)} checked={this.state.isRefresh} />
      </div>
    )
  }

}

export default injectIntl(autoRefresh)