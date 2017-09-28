import React, { Component, PropTypes } from 'react'
import { connect } from 'dva';
import { message } from 'antd';
import AlertOperation from '../common/alertOperation/index'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { classnames } from '../../utils'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'
import ChatOpshModal from '../common/chatOpsModal/index.js'
import ResolveModal from '../common/resolveModal/index.js'
import SuppressModal from '../common/suppressModal/index.js'
import ReassignModal from '../common/reassignModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import RelieveModal from '../common/relieveModal/index.js'
import MergeModal from '../common/mergeModal/index.js'
import styles from './index.less'

const AlertOperationWrap = ({ alertOperation, alertListTable, userInfo, isShowColSetBtn, dispatch, topFixKey, intl: { formatMessage } }) => {
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
      },
    }
  })

  const shanchuClass = classnames(
    'iconfont',
    'icon-shanchux'
  )

  const refreshListAndResetCheckbox = (newInfo) => {
    if (newInfo) {
      const checkAlert = alertListTable.checkAlert || {};
      const checkIds = Object.keys(checkAlert).filter((id) => {
        return checkAlert[id].checked;
      })
      const checkAlerts = checkIds.map((id) => {
        return { id, ...newInfo };
      })
      dispatch({
        type: 'alertListTable/updateDataRows',
        payload: {
          datas: checkAlerts
        }
      })
    }

    dispatch({
      type: 'alertOperation/setButtonsDisable',
      payload: true
    })
  }

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
            <p key={index} style={{ textAlign: 'left' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{index + 1}.{msg}</p>
          ))
        }
      </span>
    )
  }

  const operateProps = {
    selectGroup: alertOperation.selectGroup,
    columnList: alertOperation.columnList,
    extendColumnList: alertOperation.extendColumnList,
    extendTagsKey: alertOperation.extendTagsKey,

    takeOverDisabled: alertOperation.takeOverDisabled,
    dispatchDisabled: alertOperation.dispatchDisabled,
    closeDisabled: alertOperation.closeDisabled,
    resolveDisabled: alertOperation.resolveDisabled,
    notifyDisabled: alertOperation.notifyDisabled,
    shareDisabled: alertOperation.shareDisabled,
    mergeDisabled: alertOperation.mergeDisabled,
    reassignDisabled: alertOperation.reassignDisabled,
    suppressDisabled: alertOperation.suppressDisabled,
    chatOpsDisabled: alertOperation.chatOpsDisabled,

    showOperations: alertOperation.showOperations,
    isShowColSetBtn: isShowColSetBtn, // 是否显示列定制

    checkCloumFunc: (e) => {
      dispatch({
        type: 'alertOperation/checkColumn',
        payload: {
          value: e.target.value,
          resolve: (response) => {
            dispatch({ type: 'alertListTable/customCols', payload: response.selectColumn })
          }
        },
      })
    },
    relieveFunc: () => {
      dispatch({
        type: 'alertOperation/openRelieveModal',
        payload: {
          operateAlertIds: alertListTable.operateAlertIds,
          selectedAlertIds: alertListTable.selectedAlertIds,
          checkFailPayload: showErrorMessage
        }
      })
    },
    takeOverFunc: (position) => {
      dispatch({
        type: 'alertOperation/takeOver',
        payload: {
          operateAlertIds: alertListTable.operateAlertIds,
          selectedAlertIds: alertListTable.selectedAlertIds,
          resolve: (response) => {
            if (response && response.result) {
              refreshListAndResetCheckbox({ status: '150', owner: userInfo.userId, ownerName: userInfo.realName })
            }
          }
        }
      })
    },
    dispatchFunc: (position) => {
      dispatch({
        type: 'alertOperation/openFormModal',
        payload: {
          operateAlertIds: alertListTable.operateAlertIds,
          selectedAlertIds: alertListTable.selectedAlertIds,
          checkFailPayload: showErrorMessage
        }
      })
    },
    closeFunc: (position) => {
      dispatch({
        type: 'alertOperation/openCloseModal',
        payload: {
          state: true,
          origin: position,
          operateAlertIds: alertListTable.operateAlertIds,
          selectedAlertIds: alertListTable.selectedAlertIds,
          checkFailPayload: showErrorMessage
        }
      })
    },
    resolveFunc: (position) => {
      dispatch({
        type: 'alertOperation/openResolveModal',
        payload: {
          state: true,
          origin: position,
          operateAlertIds: alertListTable.operateAlertIds,
          selectedAlertIds: alertListTable.selectedAlertIds,
          checkFailPayload: showErrorMessage
        }
      })
    },
    mergeFunc: () => {
      dispatch({
        type: 'alertOperation/openMergeModal',
        payload: {
          selectedAlertIds: alertListTable.selectedAlertIds,
          checkFailPayload: showErrorMessage
        }
      })
    },
    groupFunc: (value) => {
      dispatch({
        type: 'alertOperation/groupView',
        payload: {
          data: value,
          resolve: (response) => {
            if (response && response.result) {
              dispatch({
                type: 'alertListTable/setGroup',
                payload: {
                  isGroup: true,
                  group: response.group
                }
              })
            }
          }
        },
      })
    },
    noGroupFunc: () => {
      dispatch({
        type: 'alertOperation/noGroupView',
        payload: {
          resolve: () => {
            dispatch({
              type: 'alertListTable/setGroup',
              payload: {
                isGroup: false,
              }
            })
          }
        }
      })
    },
    showChatOpsFunc: (position) => {
      dispatch({
        type: 'alertOperation/openChatOps',
        payload: {
          operateAlertIds: alertListTable.operateAlertIds,
          checkFailPayload: showErrorMessage
        }
      })
    },
    showNotifyFunc: (position) => {
      dispatch({
        type: 'alertOperation/openNotify',
        payload: {
          selectedAlertIds: alertListTable.selectedAlertIds,
          checkFailPayload: showErrorMessage
        }
      })
    },
    suppressIncidents: (min, position) => {
      dispatch({
        type: 'alertOperation/beforeSuppressIncidents',
        payload: {
          time: min,
          position: position,
          operateAlertIds: alertListTable.operateAlertIds,
          resolve: (response) => {
            if (response && response.result) {
              refreshListAndResetCheckbox();
            }
          }
        }
      })
    },
    showSuppressTimeSlider: (position) => {
      dispatch({
        type: 'alertOperation/openSuppressTimeSlider',
        payload: {
          position: position,
          operateAlertIds: alertListTable.operateAlertIds
        }
      })
    },
    showReassiginFunc: (position) => {
      dispatch({
        type: 'alertOperation/openReassign',
        payload: {
          operateAlertIds: alertListTable.operateAlertIds,
          checkFailPayload: showErrorMessage
        }
      })
    }
  }

  const closeModalProps = {
    currentData: alertOperation,

    onOk: (form) => {
      form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return;
        }
        const formData = form.getFieldsValue()

        dispatch({
          type: 'alertOperation/closeAlert',
          payload: {
            closeMessage: formData.closeMessage,
            operateAlertIds: alertListTable.operateAlertIds,
            resolve: (response) => {
              if (response && response.result) {
                refreshListAndResetCheckbox({ status: '255' });
              }
            }
          }
        })
        form.resetFields();
      })
    },
    onCancal: (form) => {
      dispatch({
        type: 'alertOperation/toggleCloseModal',
        payload: false
      })
      form.resetFields();
    }
  }

  const resolveModalProps = {
    currentData: alertOperation,

    onOk: (form) => {
      form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return;
        }
        const formData = form.getFieldsValue()

        dispatch({
          type: 'alertOperation/resolveAlert',
          payload: {
            resolveMessage: formData.resolveMessage,
            operateAlertIds: alertListTable.operateAlertIds,
            resolve: () => {
              refreshListAndResetCheckbox({ status: '190' });
            }
          }
        })
        form.resetFields();
      })
    },
    onCancal: (form) => {
      dispatch({
        type: 'alertOperation/toggleResolveModal',
        payload: false
      })
      form.resetFields();
    }
  }

  const dispatchModalProps = {
    currentData: alertOperation,

    closeDispatchModal: () => {
      dispatch({
        type: 'alertOperation/toggleFormModal',
        payload: false
      })
    },
    onOk: (value) => {
      dispatch({
        type: 'alertOperation/dispatchForm',
        payload: {
          data: value,
          selectedAlertIds: alertListTable.selectedAlertIds
        }
      })
    },
    onCancal: () => {
      dispatch({
        type: 'alertOperation/toggleFormModal',
        payload: false
      })
    }
  }

  const chatOpsModalProps = {
    currentData: alertOperation,

    closeChatOpsModal: () => {
      dispatch({
        type: 'alertOperation/toggleChatOpsModal',
        payload: false
      })
    },
    onOk: (value) => {
      dispatch({
        type: 'alertOperation/shareChatOps',
        payload: {
          data: value,
          selectedAlertIds: alertListTable.selectedAlertIds,
          resolve: () => {
            dispatch({ type: 'alertListTable/resetCheckboxStatus' });
          }
        }
      })
    },
    onCancal: () => {
      dispatch({
        type: 'alertOperation/toggleChatOpsModal',
        payload: false
      })
    }
  }

  const timeSliderProps = {
    isShowTimeSliderModal: alertOperation.isShowTimeSliderModal,
    onOk: (time) => {
      dispatch({
        type: "alertOperation/suppressIncidents",
        payload: {
          time: time,
          operateAlertIds: alertListTable.operateAlertIds
        }
      })
      dispatch({
        type: "alertOperation/toggleSuppressTimeSliderModal",
        payload: false
      })
    },
    onCancel: () => {
      dispatch({
        type: "alertOperation/toggleSuppressTimeSliderModal",
        payload: false
      })
    }
  }

  const suppressModalProps = {
    isShowRemindModal: alertOperation.isShowRemindModal,
    onKnow: (checked) => {
      if (checked) {
        localStorage.setItem('__alert_suppress_remind', 'false')
      }
      dispatch({
        type: "alertOperation/toggleRemindModal",
        payload: false
      })
    }
  }

  const notifyModalProps = {
    disableChatOps: alertOperation.disableChatOps,
    isShowNotifyModal: alertOperation.isShowNotifyModal,
    notifyIncident: alertOperation.notifyIncident,
    notifyUsers: alertOperation.notifyUsers,
    userSearch: (value) => {
      dispatch({
        type: 'alertOperation/ownerQuery',
        payload: {
          realName: value
        }
      })
    },
    onOk: (data) => {
      dispatch({
        type: "alertOperation/notyfiyIncident",
        payload: {
          data,
          operateAlertIds: alertListTable.operateAlertIds,
          resolve: (response) => {
            if (response && response.result) {
              refreshListAndResetCheckbox({  });
            }
          }
        }
      })
    },
    onCancel: () => {
      dispatch({
        type: "alertOperation/initManualNotifyModal",
        payload: {
          isShowNotifyModal: false
        }
      })
    }
  }

  const reassignModalProps = {
    isShowReassingModal: alertOperation.isShowReassingModal,
    users: alertOperation.notifyUsers,
    onOk: (selectedUser) => {
      dispatch({
        type: 'alertOperation/submitReassign',
        payload: {
          toWho: selectedUser.key,
          operateAlertIds: alertListTable.operateAlertIds,
          resolve: (response) => {
            if (response && response.result) {
              refreshListAndResetCheckbox({ owner: selectedUser.key, ownerName: selectedUser.label });
            }
          }
        }
      })
    },
    ownerQuery: (value) => {
      dispatch({
        type: 'alertOperation/ownerQuery',
        payload: {
          realName: value
        }
      })
    },
    onCancel: () => {
      dispatch({
        type: 'alertOperation/toggleReassignModal',
        payload: false
      })
    }
  }

  const ticketModalProps = {
    isShowTicketModal: alertOperation.isShowTicketModal,
    ticketUrl: alertOperation.ticketUrl,
    onCloseTicketModal() {
      dispatch({
        type: 'alertOperation/closeTicketModal'
      })
    }
  }

  const relieveProps = {
    isShowRelieveModal: alertOperation.isShowRelieveModal,
    relieveObj: alertOperation.relieveAlert,
    closeRelieveModal: () => {
      dispatch({
        type: 'alertOperation/toggleRelieveModal',
        payload: false
      })
    },
    relieveAlert: () => {
      dispatch({
        type: 'alertOperation/relieveAlert',
        payload: {
          relieveAlert: alertOperation.relieveAlert,
          begin: alertListTable.begin,
          end: alertListTable.end,
          resolve: (response) => {
            if (response && response.result) {
              const relieveAlert = response.relieveAlert
              const childResult = response.childResult;
              dispatch({ type: 'alertListTable/resetCheckedAlert' })
              dispatch({
                type: 'alertListTable/relieveChildAlert', payload: {
                  childs: childResult.data === undefined ? relieveAlert.childrenAlert : childResult.data,
                  relieveId: relieveAlert.id
                }
              })
            }
          }
        }
      })
    }
  }

  const mergeProps = {
    isShowMergeModal: alertOperation.isShowMergeModal,
    originAlert: alertOperation.originAlert,
    mergeInfoList: alertOperation.mergeInfoList,
    selectMergeRows: (selectedRowKeys) => {
      dispatch({
        type: 'alertOperation/selectRows',
        payload: selectedRowKeys,
      })
    },
    removeAlert: (record) => {
      dispatch({
        type: 'alertOperation/removeAlert',
        payload: record.id,
      })
    },
    closeMergeModal: () => {
      dispatch({
        type: 'alertOperation/toggleMergeModal',
        payload: false
      })
      dispatch({
        type: 'alertOperation/selectRows',
        payload: []
      })
    },
    mergeAlert: () => {
      dispatch({
        type: 'alertOperation/mergeAlert',
        payload: {
          resolve: (response) => {
            if (response && response.result) {
              const { pId, cItems, totalItems } = response
              dispatch({ type: 'alertListTable/resetCheckedAlert' })
              dispatch({ type: 'alertListTable/mergeChildAlert', payload: { pId, cItems, totalItems } })
            }
          }
        }
      })
    }
  }

  return (
    <div data-fix-key={topFixKey}>
      <AlertOperation position='list' {...operateProps} />
      <div className={ticketModalProps.isShowTicketModal ? classnames(styles.ticketModal, styles.show) : styles.ticketModal}>
        <div className={styles.detailHead}>
          <p><FormattedMessage {...localeMessage['assign_ticket']} /></p>
          <i className={classnames(styles.shanChu, shanchuClass)} onClick={ticketModalProps.onCloseTicketModal}></i>
        </div>
        <iframe src={ticketModalProps.ticketUrl}>
        </iframe>
      </div>
      <CloseModal {...closeModalProps} />
      <DispatchModal {...dispatchModalProps} />
      <ChatOpshModal {...chatOpsModalProps} />
      <ResolveModal {...resolveModalProps} />
      <SuppressModal {...suppressModalProps} />
      <SuppressTimeSlider {...timeSliderProps} />
      <ManualNotifyModal {...notifyModalProps} />
      <ReassignModal {...reassignModalProps} />
      <RelieveModal {...relieveProps} />
      <MergeModal {...mergeProps} />
    </div>
  )
}

export default injectIntl(connect(state => {
  let alertOperation = state.alertOperation;
  const isButtonLoading = state.alertDetail.isButtonLoading;
  alertOperation.isButtonLoading = isButtonLoading;
  return {
    alertOperation: alertOperation,
    alertListTable: state.alertListTable,
    userInfo: state.app.userInfo
  }
})(AlertOperationWrap))