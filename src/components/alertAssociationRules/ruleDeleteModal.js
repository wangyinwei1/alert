import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const ruleDeleteModal = ({alertAssociationRules, dispatch}) => {

    const { isShowDeleteModal, currentDeleteRule } = alertAssociationRules;

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
            id: 'modal.rule.deleteTitle',
            defaultMessage: '删除规则'
        },
        deleteMessage: {
            id: 'modal.rule.deleteMessage',
            defaultMessage: '您确定要删除{message}规则吗',
            values: {
                message: Object.keys(currentDeleteRule).length !== 0 ? currentDeleteRule['name'] : ''
            }
        }
    })

    const closeDeleteModal = () => {
        dispatch({
            type: 'alertAssociationRules/toggleDeleteModal',
            payload: {
                currentDeleteRule: {},
                status: false,
            }
        })
    }

    const modalFooter = []
    modalFooter.push(<div key={1} className={styles.modalFooter} key={ 1 }>
      <Button type="primary" onClick={ () => {
        dispatch({
            type: 'alertAssociationRules/deleteRule'
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
          visible={ isShowDeleteModal }
          footer={ modalFooter }
        >
            <div className={styles.delModalMain}>
                <p><FormattedMessage {...localeMessage['deleteMessage']} /></p>
            </div>
        </Modal>
    )
}

ruleDeleteModal.propTypes = {

}

export default connect( state => {
    return {
        alertAssociationRules: state.alertAssociationRules,
    }
})(ruleDeleteModal);