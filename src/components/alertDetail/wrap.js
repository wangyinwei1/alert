import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { message } from 'antd';
import AlertDetail from '../common/alertDetail/index'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import styles from './index.less'
import { classnames } from '../../utils'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'
import ChatOpshModal from '../common/chatOpsModal/index.js'
import ResolveModal from '../common/resolveModal/index.js'
import SuppressModal from '../common/suppressModal/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import ReassignModal from '../common/reassignModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'

const AlertDetailWrap = ({ alertDetail, userInfo, dispatch, afterTakeOver, afterChatOpsh, afterClose, afterDispatch, afterMunalNotify, afterReassign, afterResolve, afterSuppress, intl: { formatMessage } }) => {

  const localeMessage = defineMessages({
    assign_ticket: {
      id: 'alertDetail.ticket.assgin',
      defaultMessage: '派发工单'
    },
    errorMsg: {
      id: 'alertOperate.errorMsg',
      defaultMessage: '无法{ operate }因为存在以下错误:{ errorContent }',
    },
    operateType: {
      10: {
        id: 'alertDetail.action.t10',
        defaultMessage: '新告警创建'
      },
      30: {
        id: 'alertDetail.action.t30',
        defaultMessage: '更改状态'
      },
      50: {
        id: 'alertDetail.action.t50',
        defaultMessage: '更改级别'
      },
      70: {
        id: 'alertDetail.action.t70',
        defaultMessage: '告警删除'
      },
      90: {
        id: 'alertDetail.action.t90',
        defaultMessage: '通知'
      },
      110: {
        id: 'alertDetail.action.t110',
        defaultMessage: 'chatOps群组'
      },
      130: {
        id: 'alertDetail.action.t130',
        defaultMessage: '派发工单'
      },
      150: {
        id: 'alertDetail.action.t150',
        defaultMessage: '派发cross工单'
      },
      170: {
        id: 'alertDetail.action.t170',
        defaultMessage: '解决'
      },
      200: {
        id: 'alertDetail.action.t200',
        defaultMessage: '接手'
      },
      210: {
        id: 'alertDetail.action.t210',
        defaultMessage: '转派'
      },
      220: {
        id: 'alertDetail.action.t220',
        defaultMessage: '抑制'
      },
      250: {
        id: 'alertDetail.action.t250',
        defaultMessage: '关闭'
      }
    }
  })

  const reassignModalProps = {
    isShowReassingModal: alertDetail.isShowReassingModal,
    users: alertDetail.notifyUsers,
    onOk: (selectedUser) => {
      dispatch({
        type: 'alertDetail/submitReassign',
        payload: {
          toWho: selectedUser.key,
          resolve: afterReassign,
          ownerName: selectedUser.label
        }
      })
    },
    ownerQuery: (value) => {
      dispatch({
        type: 'alertDetail/ownerQuery',
        payload: {
          realName: value
        }
      })
    },
    onCancel: () => {
      dispatch({
        type: 'alertDetail/toggleReassignModal',
        payload: false
      })
    }
  }

  const shanchuClass = classnames(
    'iconfont',
    'icon-shanchux'
  )

  const showErrorMessage = function ({ checkResponse, operateCode }) {
    const errorList = checkResponse.failed || [];
    let errorCodes = [];
    let errorMsgs = [];
    let errorContent = <div></div>;
    errorList.forEach((error) => {
      const { errorCode, msg } = error;
      if (errorCodes.indexOf(errorCode) < 0) {
        errorContent += (errorCodes.length > 0 ? '\\n' : '\\n') + (errorCodes.length + 1) + "." + msg
        errorCodes.push(errorCode);
        errorMsgs.push(msg);
      }
    })

    message.error(
      <span>
        {
          formatMessage(
            {
              ...(localeMessage['errorMsg']),
            },
            {
              operate: formatMessage({ ...(localeMessage['operateType'][operateCode]) })
            }
          )
        }

        {
          errorMsgs.map((msg, index) => (
            <p key={ index } style={{ textAlign: 'left' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{index + 1}.{msg}</p>
          ))
        }
      </span>
    )
  }

  const closeModalProps = {
    currentData: alertDetail,

    onOk: (form) => {
      form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return;
        }
        const formData = form.getFieldsValue()

        dispatch({
          type: 'alertDetail/closeAlert',
          payload: {
            closeMessage: formData.closeMessage,
            resolve: afterClose
          }
        })
        form.resetFields();
      })

    },
    onCancal: (form) => {
      dispatch({
        type: 'alertDetail/toggleCloseModal',
        payload: false
      })
      form.resetFields();
    }
  }

  const resolveModalProps = {
    currentData: alertDetail,

    onOk: (form) => {
      form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return;
        }
        const formData = form.getFieldsValue()

        dispatch({
          type: 'alertDetail/resolveAlert',
          payload: {resolveMessage: formData.resolveMessage, resolve: afterResolve}
        })
        form.resetFields();
      })

    },
    onCancal: (form) => {
      dispatch({
        type: 'alertDetail/toggleResolveModal',
        payload: false
      })
      form.resetFields();
    }
  }

  const dispatchModalProps = {
    currentData: alertDetail,

    closeDispatchModal: () => {
      dispatch({
        type: 'alertDetail/toggleDispatchModal',
        payload: false
      })
    },
    onOk: (value) => {
      dispatch({
        type: 'alertDetail/dispatchForm',
        payload: {...value, resolve: (response, currentAlertDetail) => {
          dispatch({
            type: 'alertDetail/toggleDispatchModal',
            payload: false
          })
          afterDispatch(response, currentAlertDetail);
        }}
      })
    },
    onCancal: () => {
      dispatch({
        type: 'alertDetail/toggleDispatchModal',
        payload: false
      })
    }
  }

  const chatOpsModalProps = {
    currentData: alertDetail,

    closeChatOpsModal: () => {
      dispatch({
        type: 'alertDetail/toggleChatOpsModal',
        payload: false
      })
    },
    onOk: (value) => {
      dispatch({
        type: 'alertDetail/shareChatOps',
        payload: {...value, resolve: afterChatOpsh}
      })
    },
    onCancal: () => {
      dispatch({
        type: 'alertDetail/toggleChatOpsModal',
        payload: false
      })
    }
  }

  const notifyModalProps = {
    disableChatOps: alertDetail.disableChatOps,
    isShowNotifyModal: alertDetail.isShowNotifyModal,
    notifyIncident: alertDetail.notifyIncident,
    notifyUsers: alertDetail.notifyUsers,
    userSearch: (value) => {
      dispatch({
        type: 'alertDetail/ownerQuery',
        payload: {
          realName: value
        }
      })
    },
    onOk: (data) => {
      dispatch({
        type: "alertDetail/notyfiyIncident",
        payload: { data, resolve: afterMunalNotify }
      })
    },
    onCancel: () => {
      dispatch({
        type: "alertDetail/initManualNotifyModal",
        payload: {
          isShowNotifyModal: false
        }
      })
    }
  }

  const timeSliderProps = {
    isShowTimeSliderModal: alertDetail.isShowTimeSliderModal,
    onOk: (time) => {
      dispatch({
        type: "alertDetail/suppressIncidents",
        payload: {
          time: time,
          resolve: afterSuppress
        }
      })
      dispatch({
        type: "alertDetail/toggleSuppressTimeSliderModal",
        payload: false
      })
    },
    onCancel: () => {
      dispatch({
        type: "alertDetail/toggleSuppressTimeSliderModal",
        payload: false
      })
    }
  }

  const suppressModalProps = {
    isShowRemindModal: alertDetail.isShowRemindModal,
    onKnow: (checked) => {
      if (checked) {
        localStorage.setItem('__alert_suppress_remind', 'false')
      }
      dispatch({
        type: "alertDetail/toggleRemindModal",
        payload: false
      })
      dispatch({ type: 'alertDetail/openDetailModal' })
    }
  }

  const ticketModalProps = {
    isShowTicketModal: alertDetail.isShowTicketModal,
    ticketUrl: alertDetail.ticketUrl,
    onCloseTicketModal() {
      dispatch({
        type: 'alertDetail/closeTicketModal'
      })
    }
  }
  const operateProps = {
    dispatchFunc: (position) => {
      dispatch({
        type: 'alertDetail/openFormModal',
        payload: {
          checkFailPayload: showErrorMessage
        }
      })
    },
    closeFunc: (position) => {
      dispatch({
        type: 'alertDetail/openCloseModal',
        payload: {
          checkFailPayload: showErrorMessage
        }
      })
    },
    resolveFunc: (position) => {
      dispatch({
        type: 'alertDetail/openResolveModal',
        payload: {
          checkFailPayload: showErrorMessage
        }
      })
    },
    showChatOpsFunc: (position) => {
      dispatch({
        type: 'alertDetail/openChatOps',
      })
    },
    showNotifyFunc: (position) => {
      dispatch({
        type: 'alertDetail/openNotify',
      })
    },
    suppressIncidents: (min, position) => {
      dispatch({
        type: 'alertDetail/suppressIncidents',
        payload: {
          time: min
        }
      })
    },
    showSuppressTimeSlider: (position) => {
      dispatch({
        type: 'alertDetail/openSuppressTimeSlider',
      })
    },
    takeOverFunc: () => {
      dispatch({
        type: 'alertDetail/takeOver',
        payload: {
          resolve: afterTakeOver
        }
      })
    },
    showReassiginFunc: () => {
      dispatch({
        type: 'alertDetail/openReassign',
        payload: {
          checkFailPayload: showErrorMessage
        }
      })
    }
  }

  const alertDeatilProps = {
    userInfo,
    extraProps: {
      currentAlertDetail: alertDetail.currentAlertDetail,
      isShowOperateForm: alertDetail.isShowOperateForm,
      operateForm: alertDetail.operateForm,
      isShowRemark: alertDetail.isShowRemark,
      operateRemark: alertDetail.operateRemark,
      ciUrl: alertDetail.ciUrl,
      isLoading: alertDetail.isLoading,
      invokeByOutside: alertDetail.invokeByOutside
    },
    operateProps: {
      ...operateProps,
      dispatchDisabled: alertDetail.dispatchDisabled,
      closeDisabled: alertDetail.closeDisabled,
      resolveDisabled: alertDetail.resolveDisabled,
      notifyDisabled: alertDetail.notifyDisabled,
      shareDisabled: alertDetail.shareDisabled
    },

    closeDeatilModal: () => {
      dispatch({
        type: 'alertDetail/closeDetailModal',
        payload: false
      })
    },
    clickTicketFlow: (operateForm) => {
      if (operateForm !== undefined && operateForm !== '') {
        dispatch({
          type: 'alertDetail/viewTicketDetail',
          payload: operateForm
        })
      }
    },
    openForm: () => {
      dispatch({
        type: 'alertDetail/toggleFormModal',
        payload: true
      })
    },
    editForm: (formData) => {
      dispatch({
        type: 'alertDetail/changeTicketFlow',
        payload: formData.formContent
      })
      dispatch({
        type: 'alertDetail/toggleFormModal',
        payload: false
      })
    },
    closeForm: () => {
      dispatch({
        type: 'alertDetail/toggleFormModal',
        payload: false
      })
    },
    openRemark: () => {
      dispatch({
        type: 'alertDetail/toggleRemarkModal',
        payload: true
      })
    },
    editRemark: (formData) => {
      dispatch({
        type: 'alertDetail/setRemarkData',
        payload: formData.remark
      })
      dispatch({
        type: 'alertDetail/toggleRemarkModal',
        payload: false
      })
    },
    closeRemark: () => {
      dispatch({
        type: 'alertDetail/toggleRemarkModal',
        payload: false
      })
    }
  }
  const detailModal = Object.keys(alertDetail.currentAlertDetail).length !== 0 ?
    <div
      className={
        alertDetail.invokeByOutside ?
        styles.alertDetailModalByOutside
        :
        alertDetail.isShowDetail ?
        classnames(styles.alertDetailModal, styles.show)
        :
        styles.alertDetailModal
      }
    >
      <AlertDetail {...alertDeatilProps} />
    </div>
    :
    undefined
  return (
    <div>
      {ticketModalProps.ticketUrl && <div
        className={
          alertDetail.invokeByOutside ?
          styles.ticketModalByOutside
          :
          ticketModalProps.isShowTicketModal ?
          classnames(styles.ticketModal, styles.show)
          : styles.ticketModal
        }
      >
        <div className={styles.detailHead}>
          <p><FormattedMessage {...localeMessage['assign_ticket']} /></p>
          <i className={classnames(styles.shanChu, shanchuClass)} onClick={ticketModalProps.onCloseTicketModal}></i>
        </div>
        <iframe src={ticketModalProps.ticketUrl}>
        </iframe>
      </div>}
      <CloseModal {...closeModalProps} />
      <DispatchModal {...dispatchModalProps} />
      <ChatOpshModal {...chatOpsModalProps} />
      <ResolveModal {...resolveModalProps} />
      <SuppressModal {...suppressModalProps} />
      <SuppressTimeSlider {...timeSliderProps} />
      <ManualNotifyModal {...notifyModalProps} />
      <ReassignModal {...reassignModalProps} />
      {
        detailModal
      }
    </div>
  )
}

AlertDetailWrap.propTypes = {
  afterTakeOver: PropTypes.func, // 告警接手后的回调方法
  afterClose: PropTypes.func, // 告警关闭后的回调方法
  afterDispatch: PropTypes.func, // 告警派发后的回调方法
  afterChatOpsh: PropTypes.func, // 告警发送到ChatOps后的回调方法
  afterResolve: PropTypes.func, // 告警解决后的回调方法
  afterSuppress: PropTypes.func, // 告警抑制后的回调方法
  afterReassign: PropTypes.func, // 告警转派后的回调方法
  afterMunalNotify: PropTypes.func // 告警通知后的回调方法
}

AlertDetailWrap.defaultProps = {
  afterTakeOver: () => {}, // 告警接手后的回调方法
  afterClose: () => {}, // 告警关闭后的回调方法
  afterDispatch: () => {}, // 告警派发后的回调方法
  afterChatOpsh: () => {}, // 告警发送到ChatOps后的回调方法
  afterResolve: () => {}, // 告警解决后的回调方法
  afterSuppress: () => {}, // 告警抑制后的回调方法
  afterReassign: () => {}, // 告警转派后的回调方法
  afterMunalNotify: () => {} // 告警通知后的回调方法
}

export default injectIntl(connect((state) => {
  return {
    alertDetail: state.alertDetail,
    userInfo: state.app && state.app.userInfo
  }
})(AlertDetailWrap))