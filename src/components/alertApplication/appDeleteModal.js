import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const appDeleteModal = ({alertConfig, dispatch}) => {

    const { isShowDeteleModal, currentDeleteApp } = alertConfig;

    const localeMessage = defineMessages({
        delete: {
            id: 'modal.delete',
            defaultMessage: '删除'
        },
        cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        deleteOperate: {
            id: 'alertApplication.modal.deleteTitle',
            defaultMessage: '删除应用'
        },
        deleteMessage: {
            id: 'alertApplication.modal.deleteMessage',
            defaultMessage: '您确定要删除{message}应用吗',
            values: {
                message: Object.keys(currentDeleteApp).length !== 0 ? currentDeleteApp['applyType']['name'] : ''
            }
        }
    })

    const closeDeleteModal = () => {
        dispatch({
            type: 'alertConfig/toggleDeleteModal',
            payload: {
                applicationItem: {},
                status: false,
            }
        })
    }

    const modalFooter = []
    modalFooter.push(<div key={1} className={styles.modalFooter} key={ 1 }>
      <Button type="primary" onClick={ () => {
        dispatch({
            type: 'alertConfig/deleteApp'
        })
      }} ><FormattedMessage {...localeMessage['delete']} /></Button>
      <Button type="primary" onClick={ () => {
        closeDeleteModal()
      }}><FormattedMessage {...localeMessage['cancel']} /></Button>
      </div>
    )

    return (
        <Modal
          title={<FormattedMessage {...localeMessage['deleteOperate']} />}
          maskClosable="true"
          onCancel={ closeDeleteModal }
          visible={ isShowDeteleModal }
          footer={ modalFooter }
        >
            <div className={styles.delModalMain}>
                <p><FormattedMessage {...localeMessage['deleteMessage']} /></p>
            </div>
        </Modal>
    )
}

appDeleteModal.propTypes = {

}

export default connect( state => {
    return {
        alertConfig: state.alertConfig,
    }
})(appDeleteModal);