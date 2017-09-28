import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Select, Radio, Tooltip } from 'antd'
import { classnames } from '../../utils'
import LevelIcon from '../common/levelIcon/index.js'
import FilterHead from '../common/filterHead/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const formatMessages = defineMessages({
  set: {
    id: 'alertManage.addTags',
    defaultMessage: '关注设置',
  },
  noAlert: {
    id: 'alertManage.noAlert',
    defaultMessage: '无告警'
  }
})

const AlertManageHead = ({
  alertManage,
  supervisor,
  dispatch,
  intl
}) => {
  const {
    isSetAlert,
    levels,
    hideAlertSetTip,
    modalVisible,
    tagsNum,
    tagsList,
    isLoading,
    isFullScreen,
    isFixed,
    currentDashbordData,
    oldDashbordDataMap,
    selectedStatus,
    selectedTime,
    isNeedRepaint,
    currentViewId,
  } = alertManage;

  function showTagsModal() {
    dispatch({
      type: 'alertTagsSet/openSetModal',
      payload: {
        id: currentViewId
      }
    })
  }

  function queryByTime(time) {
    dispatch({
      type: 'alertManage/queryAlertDashbord',
      payload: {
        selectedTime: time
      }
    })
  }
  function queryByStatus(status) {
    dispatch({
      type: 'alertManage/queryAlertDashbord',
      payload: {
        selectedStatus: status
      }
    })
  }
  function setFullScreen() {
    dispatch({
      type: 'alertManage/setFullScreen',
      payload: !isFullScreen
    })
  }
  function setLayout(e) {
    const target = e.target.tagName.toLocaleLowerCase() == 'i' ? e.target.parentNode : e.target
    const isFixed = target.getAttribute('data-isFixed')
    dispatch({
      type: 'alertManage/setLayout',
      payload: isFixed
    })
  }

  const setClass = classnames(
    'iconfont',
    'icon-bushu'
  )
  const fixedLayoutClass = classnames(
    'iconfont',
    'icon-gudingdaxiao'
  )
  const autoLayoutClass = classnames(
    'iconfont',
    'icon-angaojingshu'
  )
  const fullScreenClass = classnames(
    'iconfont',
    'icon-zuidahua'
  )
  const minFullScreenClass = classnames(
    'iconfont',
    'icon-zuixiaohua'
  )
  const layouthandler = (e) => {
    // 如果是当前状态不更新布局（通过className）
    const target = e.target.tagName.toLocaleLowerCase() == 'i' ? e.target.parentNode : e.target
    if (target.className.indexOf('curLayout') > -1) return
    setLayout(e)
  }
  const { formatMessage } = intl;

  return (
    <div className={styles.manageHead}>
      {isFullScreen && <div className={styles.fullScreenMask}></div>}
      {
        parseInt(supervisor, 10) > 0?
        <div className={styles.focusSet} onClick={showTagsModal}>
          <i className={setClass}></i><FormattedMessage {...formatMessages['set']} />
        </div>
        :
        undefined
      }
      <div className={styles.layout} >

        {isFullScreen &&
          <a href="javascript:void(0)" className={classnames(styles.minFullScreen)} onClick={setFullScreen}>
            <Tooltip title={__alert_appLocaleData.messages['layout.initialize']}><i className={minFullScreenClass}></i></Tooltip>
          </a>
        }
        <a href="javascript:void(0)" className={classnames(styles.fullScreen)} onClick={setFullScreen}>
          <Tooltip title={__alert_appLocaleData.messages['layout.fullScreen']}><i className={fullScreenClass}></i></Tooltip>
        </a>
        <a href="javascript:void(0)" className={classnames(styles.fixedLayout, isFixed ? 'curLayout' : '')} data-isFixed="0" onClick={(e) => { layouthandler(e) }}>
          <Tooltip title={__alert_appLocaleData.messages['layout.fixedLayout']}><i className={fixedLayoutClass}></i></Tooltip>
        </a>
        <a href="javascript:void(0)" className={classnames(styles.autoLayout, !isFixed ? 'curLayout' : '')} data-isFixed="1" onClick={(e) => { layouthandler(e) }}>
          <Tooltip title={__alert_appLocaleData.messages['layout.autoLayout']}><i className={autoLayoutClass}></i></Tooltip>
        </a>

      </div>
      {
        isSetAlert &&
        <FilterHead
          defaultTime={selectedTime}
          defaultStatus={selectedStatus}
          queryByTime={(value) => { queryByTime(value) }}
          queryByStatus={(value) => { queryByStatus(value) }}
        />
      }
      {isSetAlert &&
        <ul className={styles.alertStatus}>
          <li><LevelIcon extraStyle={styles.extraStyle} iconType='jj' /><p>{`${window['_severity']['3']}（${levels.totalCriticalCnt !== undefined ? levels.totalCriticalCnt : 0}）`}</p></li>
          <li><LevelIcon extraStyle={styles.extraStyle} iconType='gj' /><p>{`${window['_severity']['2']}（${levels.totalWarnCnt !== undefined ? levels.totalWarnCnt : 0}）`}</p></li>
          <li><LevelIcon extraStyle={styles.extraStyle} iconType='tx' /><p>{`${window['_severity']['1']}（${levels.totalInfoCnt !== undefined ? levels.totalInfoCnt : 0}）`}</p></li>
          <li><LevelIcon extraStyle={styles.extraStyle} iconType='hf' /><p>{`${window['_severity']['0']}（${levels.totalOkCnt !== undefined ? levels.totalOkCnt : 0}）`}</p></li>
          <li><LevelIcon extraStyle={styles.extraStyle} iconType='noAlerts' /><p><FormattedMessage {...formatMessages['noAlert']} /></p></li>
        </ul>
      }
    </div>
  )
}

export default injectIntl(connect(state => {
  return {
    alertManage: state.alertManage,
    supervisor: (state.app.userInfo && state.app.userInfo.supervisor) || '0'
  }
})(AlertManageHead))
