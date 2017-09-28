import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const trapDeleteModal = ({snmpTrapRules, onOk, onCancel, dispatch}) => {

    const { isShowTrapDeleteModal, operateDeleteRule } = snmpTrapRules;

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
                message: operateDeleteRule.name
            }
        }
    })

    const modalFooter = []
    modalFooter.push(<div key={1} className={styles.modalFooter} key={ 1 }>
      <Button type="primary" onClick={ () => {
        onOk()
      }} ><FormattedMessage {...localeMessage['delete']} /></Button>
      <Button type="primary" onClick={ () => {
        onCancel()
      }}><FormattedMessage {...localeMessage['cancel']} /></Button>
      </div>
    )

    return (
        <Modal
          title={<FormattedMessage {...localeMessage['deleteOperate']} />}
          maskClosable="true"
          onCancel={ onCancel }
          visible={ isShowTrapDeleteModal }
          footer={ modalFooter }
        >
            <div className={styles.delModalMain}>
                <p><FormattedMessage {...localeMessage['deleteMessage']} /></p>
            </div>
        </Modal>
    )
}

trapDeleteModal.propTypes = {

}

export default trapDeleteModal;