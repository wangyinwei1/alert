import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import styles from './index.less'

const localeMessages = defineMessages({
  modal_ok: {
    id: 'modal.ok',
  },
  modal_cancel: {
    id: 'modal.cancel'
  }
})

const CommonModal = function ({ title, width, data, iconClass, buttons, okProps = {}, cancelProps = {}, isShow, children, localeMessage }) {

  const modalFooter = []
  if (!buttons) {
    modalFooter.push(
      <div className={styles.modalFooter} key={1}>
        <Button type="primary" disabled={okProps.disabled || undefined} className={okProps.className || ''} onClick={() => {
          okProps.onClick && okProps.onClick(data);
        }} >
          {okProps.title || <FormattedMessage {...localeMessages['modal_ok']} />}
        </Button>
        <Button type="ghost" disabled={cancelProps.disabled} className={styles.ghostBtn + (cancelProps.className || '')} onClick={() => {
          cancelProps.onClick && cancelProps.onClick(data);
        }}>
          {cancelProps.title || <FormattedMessage {...localeMessages['modal_cancel']} />}
        </Button>
      </div>
    )
  } else {
    modalFooter.push(
      <div className={styles.modalFooter} key={1}>
        {buttons}
      </div>
    )
  }
console.log(isShow);

  return (
    <Modal
      title={title}
      width={width}
      maskClosable="true"
      onCancel={() => { cancelProps.onClick && cancelProps.onClick() }}
      visible={isShow || false}
      footer={modalFooter}
    >
      {
        iconClass?
        <div className={ styles.withIconDiv }>
          <i className={ iconClass }/>
          <div>
            { children }
          </div>
        </div>
        :
        children
      }
    </Modal>
  )
}

CommonModal.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object, // 弹出框用到的数据，用于确认和取消按钮点击后的回调
  buttons: PropTypes.arrayOf(PropTypes.node),
  okProps: PropTypes.shape({
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string, // 按钮标题
    disabled: PropTypes.bool
  }),
  cancelProps: PropTypes.shape({
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string, // 按钮标题
    disabled: PropTypes.bool
  }),
  isShow: PropTypes.bool.isRequired,
  iconClass: PropTypes.string
}

export default injectIntl(CommonModal)