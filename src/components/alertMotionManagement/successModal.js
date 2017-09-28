import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './successModal.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import CommonModal from '../common/commonModal'
import { Modal, Button, Row, Col } from 'antd'
import { classnames } from '../../utils/index'

const appDeleteModal = ({ am_successModal, dispatch, intl: { formatMessage } }) => {

  const { ByIdsData, isShow} = am_successModal;
  const localeMessage = defineMessages({
    importAcitonTotal: {
      id: 'alertMotionManagement.importAcitonTotal',
      defaultMessage: '成功导入{num}条动作'
    },
    importFailAcitonTotal: {
      id: 'alertMotionManagement.importFailAcitonTotal',
      defaultMessage: '成功导入{num}条动作, {failNum}条动作导入失败'
    },
    got_it: {
      id: 'modal.got_it',
      defaultMessage: '知道了',
    }
  })
  const cancelProps = () => {
    dispatch({
      type: 'am_successModal/toggleModal',
      payload: {
        status: false,
      }
    })
  }
  const modalFooter = [];
  modalFooter.push(
    <div className={styles.modalFooter} key={1}>
      <Button type="primary" onClick={() => {
        cancelProps();
      }} >
        {<FormattedMessage {...localeMessage['got_it']} />}
      </Button>
    </div>
  )

  const isShowSuccess = (ByIdsData && ByIdsData.failCount) == 0 ? true : false;

  return (
    <Modal
      visible={isShow}
      width={395}
      onCancel={cancelProps}
      footer={modalFooter}
    >
      <Row className={styles.modalWrapper}>
        <Col span={isShowSuccess ? 10 : 6}>
          <span className={classnames(isShowSuccess ? styles.modalImage : styles.failModalImage)}></span>
        </Col>
        <Col span={isShowSuccess ? 14 : 18}>
          {
            isShowSuccess ?
              <FormattedMessage {...localeMessage['importAcitonTotal']} values={{ num: `${ByIdsData && ByIdsData.successCount || 0}` }} />
              :
              <FormattedMessage {...localeMessage['importFailAcitonTotal']} values={{ failNum: `${ByIdsData && ByIdsData.failCount || 0}`, num: `${ByIdsData && ByIdsData.successCount || 0}` }} />
          }
        </Col>
      </Row>
    </Modal>
  )
}

appDeleteModal.propTypes = {

}

export default injectIntl(connect(state => {
  return {
    am_successModal: state.am_successModal,
  }
})(appDeleteModal));