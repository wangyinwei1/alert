import React, { PropTypes, Component } from 'react'

import { Tabs, Select, Switch, Checkbox, Button, message } from 'antd'
import ListTableWrap from './listTable'
import ListTimeTableWrap from './listTimeTable'
import VisualAnalyzeWrap from './visualAnalyze'
import LevelsWrap from './levelsWrap'
import AlertDetailWrap from '../alertDetail/wrap'
import AlertOperationWrap from '../alertOperation/wrap'
import AlertBar from './d3AlertBar'
import AlertTagsFilter from './alertTagsFilter'
import AlertOperation from '../common/alertOperation/index.js'
import AlertDetail from '../common/alertDetail/index.js'
import { connect } from 'dva'
import styles from './index.less'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'
import ChatOpshModal from '../common/chatOpsModal/index.js'
import ResolveModal from '../common/resolveModal/index.js'
import SuppressModal from '../common/suppressModal/index.js'
import ReassignModal from '../common/reassignModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import AlertOriginSliderWrap from '../alertOriginSlider/wrap.js'
import FilterHead from '../common/filterHead/index.js'
import ScrollTopButton from '../common/scrollTopButton/index'
import AutoRefresh from '../common/autoRefresh'
import { classnames } from '../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const TabPane = Tabs.TabPane

const statusOperationMap = {
  'NEW': ['takeOver', 'reassign', 'merge', 'other'],
  'PROGRESSING': ['dispatch', 'reassign', 'close', 'resolve', 'merge'],
  'RESOLVED': ['close', 'reassign', 'merge'],
  'EXCEPTCLOSE': ['merge', 'other'],
}

// “不同状态的过滤”与“是否禁止非自己的告警选择框”的关系
const isNeedCheckOwnerMap = {
  'NEW': false,
  'PROGRESSING': true,
  'RESOLVED': true,
  'EXCEPTCLOSE': false
}

class AlertListManage extends Component {
  constructor(props) {
    super(props);
    this.ITSMPostMessage = this.ITSMPostMessage.bind(this)
  }

  ITSMPostMessage(e) {
    const { dispatch, intl: { formatMessage }, alertList } = this.props;
    const { alertOperateModalOrigin='alertOperation' } = alertList;
    if (e.data.createTicket !== undefined && e.data.createTicket === 'success') {
      const localeMessage = defineMessages({
        successMsg: {
          id: 'alertOperate.dispatch.success',
          defaultMessage: "派单成功，工单号为：{ flowNo }",
        }
      })
      message.success(formatMessage({ ...localeMessage['successMsg'] }, { flowNo: e.data.flowNo }));
      dispatch({
        type: alertOperateModalOrigin + '/afterDispatch'
      })
    }
  }

  componentDidMount() {
    const { dispatch, alertManage = {}, intl: { formatMessage } } = this.props;

    dispatch({ type: 'alertOperation/changeShowOperation', payload: { showOperations: statusOperationMap[alertManage.selectedStatus || 'NEW'] } });

    window.addEventListener('message', this.ITSMPostMessage, false)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.ITSMPostMessage, false)
    this.props.dispatch({
      type: 'tagListFilter/clear'
    })
  }

  render() {

    const { alertDetail, alertList, userInfo, dispatch, alertOperation, alertManage, intl: { formatMessage } } = this.props;

    const localeMessage = defineMessages({
      tab_list: {
        id: 'alertList.tabs.list',
        defaultMessage: '列表'
      },
      assign_ticket: {
        id: 'alertDetail.ticket.assgin',
        defaultMessage: '派发工单'
      },
      tab_time: {
        id: 'alertList.tabs.timeList',
        defaultMessage: '时间线'
      },
      tab_visual: {
        id: 'alertList.tabs.visual',
        defaultMessage: '可视化分析'
      },
      noAlert: {
        id: 'alertManage.noAlert',
        defaultMessage: '无告警'
      }
    })

    const toggleBarButtonClick = (e) => {
      const isShowAlertBar = !alertList.isShowBar;
      dispatch({
        type: 'alertList/toggleBar',
        payload: isShowAlertBar,
      })
    }

    const refresh = () => {
      dispatch({
        type: 'alertList/refresh'
      })
    }

    const tabList = classnames(
      'iconfont',
      'icon-liebiao',
      styles['listTab']
    )
    const tabLine = classnames(
      'iconfont',
      'icon-shijian',
      styles['timeTab']
    )
    const tabVisual = classnames(
      'iconfont',
      'icon-yunweichangjing',
      styles['visualTab']
    )
    const shanchuClass = classnames(
      'iconfont',
      'icon-shanchux'
    )
    const zhankaiClass = classnames(
      'iconfont',
      'icon-xialasanjiao'
    )
    const shouqiClass = classnames(
      'iconfont',
      'icon-xialasanjiao-copy'
    )

    const groupName = localStorage.getItem('__visual_group'),
      isShowVisualTab = !(groupName == 'source' || groupName == 'status' || groupName == 'severity');

    const updateRow = (response, currentAlertDetail) => {
      if (response && response.result) {
        dispatch({
          type: 'alertListTable/updateDataRow',
          payload: currentAlertDetail
        })
      }
    }

    const alertDetailWrapProps = {
      afterTakeOver: updateRow,
      afterClose: updateRow, // 告警关闭后的回调方法
      afterDispatch: updateRow, // 告警派发后的回调方法
      afterChatOpsh: updateRow, // 告警发送到ChatOps后的回调方法
      afterResolve: updateRow, // 告警解决后的回调方法
      afterSuppress: updateRow, // 告警抑制后的回调方法
      afterReassign: updateRow, // 告警转派后的回调方法
      afterMunalNotify: updateRow // 告警通知后的回调方法
    }

    const skinType = document.getElementsByTagName('html')[0].className;
    let autoRefreshTop;
    skinType == 'white' ? (autoRefreshTop = '-55px') : (autoRefreshTop = '-30px')

    return (
      <div style={{ position: 'relative' }}>
        <AutoRefresh origin='alertList' refresh={refresh}  top={"-55px"} />
        <FilterHead
          style={{ marginBottom: '20px' }}
          defaultTime={alertManage.selectedTime}
          defaultStatus={alertManage.selectedStatus}
          queryByTime={(value) => {
            dispatch({ type: 'tagListFilter/selectTime', payload: value })
          }}
          queryByStatus={(value) => {
            const showOperations = statusOperationMap[value];
            dispatch({ type: 'alertOperation/changeShowOperation', payload: { showOperations } })
            dispatch({ type: 'tagListFilter/selectStatus', payload: value })
          }}
        />
        <div className={alertList.isShowBar ? styles.showBar : styles.hideBar}>
          <AlertTagsFilter />
          <AlertBar />
        </div>
        <Button className={classnames(styles.toggleBarButton, zhankaiClass)} onClick={toggleBarButtonClick} size="small"><i className={classnames(alertList.isShowBar ? shouqiClass : zhankaiClass, styles.toggleBarButtonIcon)} /></Button>
        <div className={styles.alertListPage + " " + (alertList.isShowBar ? '' : styles.marginTop0)}>
          <Tabs defaultActiveKey="1" animated={ false }>
            <TabPane tab={<span className={tabList}><FormattedMessage {...localeMessage['tab_list']} /></span>} key='1'>
              {/*<AlertOperation position='list' {...operateProps} />*/}
              <AlertOperationWrap topFixKey="queryOperate1"/>
              <ListTableWrap isNeedCheckOwner={isNeedCheckOwnerMap[alertManage.selectedStatus] && userInfo.supervisor != "1"} extraAreaKey="queryOperate1" topFixArea={<AlertOperationWrap />} topHeight={alertList.isShowBar ? 308 : 172} />
            </TabPane>
            <TabPane tab={<span className={tabLine} ><FormattedMessage {...localeMessage['tab_time']} /></span>} key='2'>
              {/*<AlertOperation position='timeAxis' {...operateProps} />*/}
              <AlertOperationWrap isShowColSetBtn={false} topFixKey="queryOperate2" />
              <ListTimeTableWrap isNeedCheckOwner={isNeedCheckOwnerMap[alertManage.selectedStatus] && userInfo.supervisor != "1"} extraAreaKey="queryOperate2" topFixArea={<AlertOperationWrap />} topHeight={alertList.isShowBar ? 308 : 172} />
            </TabPane>
            {
              isShowVisualTab ?
                <TabPane tab={<span className={tabVisual}><FormattedMessage {...localeMessage['tab_visual']} /></span>} key='3'>
                  <VisualAnalyzeWrap key={new Date().getTime()} />
                </TabPane>
                :
                []
            }
          </Tabs>
          <LevelsWrap />
        </div>

        <AlertDetailWrap { ...alertDetailWrapProps } />
        <AlertOriginSliderWrap />
        <ScrollTopButton />
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  return {
    alertManage: state.alertManage,
    alertList: state.alertList,
    userInfo: state.app.userInfo,
  }
})(AlertListManage))
