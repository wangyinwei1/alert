import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import CommonModal from '../common/commonModal'

const appDeleteModal = ({ alertMotionManagement, dispatch, intl: { formatMessage } }) => {

  const { isShowDeteleModal, currentDeleteApp } = alertMotionManagement;

  const localeMessage = defineMessages({
    deleteOperate: {
      id: 'alertApplication.modal.deleteTitle',
      defaultMessage: '删除应用'
    },
    deleteMessage: {
      id: 'alertApplication.modal.deleteMessage',
      defaultMessage: '您确定要删除{message}应用吗',
      values: {
        message: Object.keys(currentDeleteApp).length !== 0 ? currentDeleteApp['actionName'] : ''
      }
    }
  })
  const okProps = {
    onClick: () => {
      dispatch({
        type: 'alertMotionManagement/deleteApp'
      })
    }
  }
  const cancelProps = {
    onClick: () => {
      dispatch({
        type: 'alertMotionManagement/toggleDeleteModal',
        payload: {
          applicationItem: {},
          status: false,
        }
      })
    }
  }
  return (
    <CommonModal
      title={formatMessage({ ...localeMessage['deleteOperate'] })}
      isShow={isShowDeteleModal}
      okProps={okProps}
      cancelProps={cancelProps}
    >
      <div className={styles.delModalMain}>
        <p><FormattedMessage {...localeMessage['deleteMessage']} /></p>
      </div>
    </CommonModal>
  )
}

appDeleteModal.propTypes = {

}

export default injectIntl(connect(state => {
  return {
    alertMotionManagement: state.alertMotionManagement,
  }
})(appDeleteModal));