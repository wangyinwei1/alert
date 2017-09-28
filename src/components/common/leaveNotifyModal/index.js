import React, { PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'
import { Modal, Button } from 'antd'
import { connect } from 'dva'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

class LeaveNotifyModal extends Component {
  componentDidMount() {
    const router = this.context.router;
    const { route, needLeaveCheck } = this.props;
    this.setAsyncRouteLeaveHook(router, route, () => { return this._show() }, needLeaveCheck || this.defaultNeedLeaveCheck)
  }

  // 判断是否要显示弹出框来阻挡跳转
  defaultNeedLeaveCheck() {
    return true;
  }

  _show() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.setState({ visible: true })
    })
  }

  _onLeave() {
    this.resolve(true);
  }

  _onCancel() {
    this.setState({ visible: false });
  }

  setAsyncRouteLeaveHook(router, route, hook, needLeaveCheck) {
    let withinHook = false
    let finalResult = undefined
    let finalResultSet = false
    router.setRouteLeaveHook(route, nextLocation => {
      if(!needLeaveCheck()) {
        return true;
      }
      withinHook = true
      if (!finalResultSet) {
        hook(nextLocation).then(result => {
          finalResult = result
          finalResultSet = true
          if (!withinHook && nextLocation) {
            router.push(nextLocation)
          }
        })
      }
      let result = finalResultSet ? finalResult : false
      withinHook = false
      finalResult = undefined
      finalResultSet = false
      return result
    })
  }

  render() {
    const visible = this.state && this.state.visible
    const localeMessage = defineMessages({
        modal_ok: {
            id: 'modal.leave',
            defaultMessage: '离开'
        },
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        leaveNotice: {
            id: 'modal.leaveNotice',
            defaultMessage: '你还有数据未保存，确定要离开此页面吗？'
        }
    });
    const warnClasses = classnames(
      'icon',
      'iconfont',
      'icon-tishi',
      styles.tishi
    );

    const buttons = (
      <div key={ 1 } className={styles.modalFooter}>
        <Button type="primary" onClick={ () => {
            this._onLeave();
        }} ><FormattedMessage {...localeMessage['modal_ok']} /></Button>
        <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
            this._onCancel();
        }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
      </div>
    )
    return (
      <Modal
        title=""
        maskClosable="true"
        onCancel={ () => { this._onCancel() } }
        visible={ visible }
        footer={ [buttons] }
        width={ 400 }
      >
        <div className={ styles.leaveNotifyModal }>
          <div className={ styles.tishiDiv }> <i className={ warnClasses }/> </div>
          <div className={ styles.content }> <span> <FormattedMessage {...localeMessage['leaveNotice']}  /></span> </div>
        </div>
      </Modal>
    )
  }
}

LeaveNotifyModal.contextTypes = { 
  router: PropTypes.object
}

LeaveNotifyModal.propTypes = {
  route: PropTypes.object.isRequired, // 当前路径,React-Router传递过来的参数
  needLeaveCheck: PropTypes.func // 判断是否需要弹出框确认，一些页面可能是需要先判断一下表单内容是否发生变化，如果发生变化再弹窗确认是否离开，如果不变化则直接跳转
}

export default LeaveNotifyModal;