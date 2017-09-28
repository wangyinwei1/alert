import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './successModal.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import CommonModal from '../common/commonModal'
import { Modal, Button, Row, Col } from 'antd'
import { classnames } from '../../utils/index'

const comfirmModal = ({ form, am_addActionModal, dispatch, intl: { formatMessage } }) => {
  const { isShowReplaceModal } = am_addActionModal;
  const localeMessage = defineMessages({
    replace: {
      id: 'alertMotionManagement.modal.replace',
      defaultMessage: '替换',
    },
    repalceRemindes: {
      id: 'alertMotionManagement.modal.repalceRemindes',
      defaultMessage: '存在同名动作，需要替换吗？',
    }
  })

  const okProps = {
    title: formatMessage({ ...localeMessage['replace'] }),
    onClick: () => {
      dispatch({
        type: 'am_addActionModal/isReplaceActionName',
        payload: {
          status: true,
          form
        }
      })
    }
  }
  const cancelProps = {
    onClick: () => {
      dispatch({
        type: 'am_addActionModal/toggleReplaceModal',
        payload: {
          status: false,
        }
      })
    }
  }

  return (
    <CommonModal
      isShow={isShowReplaceModal}
      okProps={okProps}
      cancelProps={cancelProps}
      width={458}>
      <div style={{"padding": "40px 0px","textAlign": "center","fontSize": "16px"}}>
        <FormattedMessage {...localeMessage['repalceRemindes']} />
      </div>
    </CommonModal>
  )
}

export default injectIntl(connect(state => {
  return {
    am_addActionModal: state.am_addActionModal,
  }
})(comfirmModal));