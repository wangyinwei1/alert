import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const RelieveModal = ({ isShowRelieveModal, relieveObj, relieveAlert, closeRelieveModal }) => {
    const localeMessage = defineMessages({
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        modal_unrollup: {
            id: 'modal.unrollup',
            defaultMessage: '解除告警'
        },
        modal_unrollupMessage: {
            id: 'modal.unrollupMessage',
            defaultMessage: '解除{name}的合并告警',
            values: {
                name: relieveObj.name
            }
        },

    })

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter} key={ 1 }>
      <Button type="primary" onClick={ () => {
        relieveAlert();
      }} ><FormattedMessage {...localeMessage['modal_unrollup']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
        closeRelieveModal();
      }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
      </div>
    )

    return (
        <Modal
            title={<FormattedMessage {...localeMessage['modal_unrollup']} />}
            maskClosable="true"
            onCancel={ closeRelieveModal }
            visible={ isShowRelieveModal }
            footer={ modalFooter }
        >
            <div className={styles.relieveMain}>
                <p><FormattedMessage {...localeMessage['modal_unrollupMessage']} /></p>
            </div>
        </Modal>
    )
}

RelieveModal.defaultProps = {
  isShowRelieveModal: false,
  relieveAlert: () => {},
  closeRelieveModal: () => {}
}

RelieveModal.propTypes = {
  isShowRelieveModal: PropTypes.bool, // 是否显示
  relieveAlert: PropTypes.func, // 解除告警组
  closeRelieveModal: PropTypes.func, // 取消
}

export default injectIntl(RelieveModal)
