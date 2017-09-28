import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './successModal.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import CommonModal from '../common/commonModal'
import { Modal, Button, Row, Col, Checkbox } from 'antd'
import { classnames } from '../../utils/index'
import Cookies from 'js-cookie'

const appDeleteModal = ({ am_addSuccessModal, dispatch, intl: { formatMessage } }) => {
  const { isShow, isChecked } = am_addSuccessModal;
  const localeMessage = defineMessages({
    ActionPlugIn: {
      id: 'alertMotionManagement.ActionPlugIn',
      defaultMessage: '动作插件添加成功！'
    },
    got_it: {
      id: 'modal.got_it',
      defaultMessage: '知道了',
    }
  })
  const cancelProps = () => {
    dispatch({
      type: 'am_addSuccessModal/gotIt',
      payload: {
        status: false
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
  function onChange(e) {
    dispatch({
      type: 'am_addSuccessModal/changeChecked',
      payload: {
        status: e.target.checked
      }
    })
    if (e.target.checked) {
      var expiresDate = new Date();
      expiresDate.setTime(expiresDate.getTime() + (3 * 60 * 60 * 1000));
      Cookies.set('isHiddenSuccessModal', true, { expires: expiresDate });
    } else {
      Cookies.remove('isHiddenSuccessModal');
    }
  }
  return (
    <Modal
      visible={isShow}
      width={458}
      onCancel={cancelProps}
      footer={modalFooter}
    >
      <Row className={styles.modalWrapper}>
        <Col span={5}>
          <span className={styles.modalImage}></span>
        </Col>
        <Col span={18}>
          {<FormattedMessage {...localeMessage['ActionPlugIn']} />}
          <div className={styles.beCareful}>注意：插件包上传完毕后，需要重新启动Alert服务才可以正式生效。</div>
          <div className={styles.OMP}>访问OMP重启Alert服务</div>
          <Checkbox checked={isChecked} className={styles.reminders} onChange={onChange}>不再提醒</Checkbox>
        </Col>
      </Row>
    </Modal>
  )
}

appDeleteModal.propTypes = {

}

export default injectIntl(connect(state => {
  return {
    am_addSuccessModal: state.am_addSuccessModal,
  }
})(appDeleteModal));