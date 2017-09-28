import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Form, Input, Select, DatePicker, Button, Popover, Checkbox, message } from 'antd'
import ListTableWrap from './queryList.js'
import AlertOriginSliderWrap from '../alertOriginSlider/wrap'
import AlertDetaiWrap from '../alertDetail/wrap'
import { classnames } from '../../utils'
import AlertDetail from '../common/alertDetail/index.js'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'
import ChatOpshModal from '../common/chatOpsModal/index.js'
import ResolveModal from '../common/resolveModal/index.js'
import SuppressModal from '../common/suppressModal/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import ReassignModal from '../common/reassignModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'
import ScrollTopButton from '../common/scrollTopButton/index.js'
import AutoRefresh from '../common/autoRefresh'
import Filter from './filter'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import moment from 'moment'
import $ from 'jquery'
import _ from 'lodash'

const Item = Form.Item;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;
const Option = Select.Option;
class alertQueryManage extends Component {

  constructor(props) {
    super(props)
    this.ITSMPostMessage = this.ITSMPostMessage.bind(this)
  }

  ITSMPostMessage(e) {
    const { dispatch, intl: { formatMessage } } = this.props;
    if (e.data.createTicket !== undefined && e.data.createTicket === 'success') {
      const localeMessage = defineMessages({
        successMsg: {
          id: 'alertOperate.dispatch.success',
          defaultMessage: "派单成功，工单号为：{flowNo}",
        }
      })
      message.success(formatMessage({ ...localeMessage['successMsg'] }, { flowNo: e.data.flowNo }));
      dispatch({
        type: 'alertDetail/afterDispatch',
      })
    }
  }

  componentDidMount() {
    const { dispatch, intl: { formatMessage } } = this.props;
    window.addEventListener('message', this.ITSMPostMessage, false)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.ITSMPostMessage, false)
  }

  render() {
    const { dispatch, form, alertOperation, intl: { formatMessage } } = this.props;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    const refreshList = (response) => {
      if (response && response.result) {
        dispatch({
          type: 'alertQuery/queryAlertList'
        })
      }
    }

    const updateRow = (response, currentAlertDetail) => {
      if(response && response.result) {
        dispatch({
          type: 'alertQuery/updateDataRow',
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
    skinType == 'white' ? (autoRefreshTop = '-55px') : (autoRefreshTop = '-50px');
    return (
      <div style={{ position: 'relative' }} className={styles.alertQueryWrapper}>
        <AutoRefresh origin='alertList' top={autoRefreshTop} refresh={() => {
          dispatch({
            type: 'alertQuery/queryAlertList'
          })
        }} />
        <Filter />
        <ListTableWrap />
        <ScrollTopButton />
        <AlertOriginSliderWrap />
        <AlertDetaiWrap { ...alertDetailWrapProps } />
      </div>
    )
  }
}

export default injectIntl(connect()(alertQueryManage))
