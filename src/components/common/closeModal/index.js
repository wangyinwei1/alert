import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col, Input } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const Option = Select.Option;
const closeModal = ({currentData, onOk, onCancal, form, intl: {formatMessage}}) => {

    const localeMessage = defineMessages({
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        modal_closeIncident: {
            id: 'modal.closeIncident',
            defaultMessage: '关闭告警'
        },
        modal_close: {
            id: 'modal.close',
            defaultMessage: '关闭'
        },
        modal_closeReason: {
            id: 'modal.closeReason',
            defaultMessage: '关闭理由'
        },
        modal_noCloseReason: {
            id: 'modal.noCloseReason',
            defaultMessage: '请选择关闭理由'
        },
        modal_validating: {
            id: 'modal.validating',
            defaultMessage: '检验中...'
        },
        modal_closeReason_1: {
            id: 'modal.closeReason.1',
            defaultMessage: '故障已解决'
        },
        modal_closeReason_2: {
            id: 'modal.closeReason.2',
            defaultMessage: '计划停机'
        },
        modal_closeReason_3: {
            id: 'modal.closeReason.3',
            defaultMessage: '监控系统误报'
        },
    })

    const { isShowCloseModal } = currentData;
    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter} key={ 1 }>
      <Button type="primary" onClick={ () => {
        onOk(form)
      }} ><FormattedMessage {...localeMessage['modal_close']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
        onCancal(form)
      }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
      </div>
    )

    return (
        <Modal
            title={<FormattedMessage {...localeMessage['modal_closeIncident']} />}
            maskClosable="true"
            onCancel={ () => { onCancal(form) } }
            visible={ isShowCloseModal }
            footer={ modalFooter }
        >
            <div className={styles.closeMain}>
                <Form>
                    <Item
                        label={<FormattedMessage {...localeMessage['modal_closeReason']} />}
                        help={isFieldValidating('closeMessage') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('closeMessage') || []).join(', ')}
                    >
                        {getFieldDecorator('closeMessage', {
                            rules: [
                                { required: true, message: formatMessage({...localeMessage['modal_noCloseReason']})}
                            ]
                        })(
                            <Select getPopupContainer={() => {
                              return document.getElementById("content") || document.body
                            }} mode='combobox' placeholder={formatMessage({...localeMessage['modal_noCloseReason']})}>
                                <Option value={formatMessage({...localeMessage['modal_closeReason_1']})}>{formatMessage({...localeMessage['modal_closeReason_1']})}</Option>
                                <Option value={formatMessage({...localeMessage['modal_closeReason_2']})}>{formatMessage({...localeMessage['modal_closeReason_2']})}</Option>
                                <Option value={formatMessage({...localeMessage['modal_closeReason_3']})}>{formatMessage({...localeMessage['modal_closeReason_3']})}</Option>
                            </Select>
                        )}
                    </Item>
                </Form>
            </div>
        </Modal>
    )
}

closeModal.defaultProps = {
    currentData: {},
    onOk: () => {},
    onCancal: () => {},
}

closeModal.propTypes = {

}

export default injectIntl(Form.create()(closeModal))