import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Row, Col, Input } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const resolveModal = ({currentData, onOk, onCancal, form, intl: {formatMessage}}) => {

    const localeMessage = defineMessages({
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        modal_resolveIncident: {
            id: 'modal.resolveIncident',
            defaultMessage: '解决告警'
        },
        modal_resolve: {
            id: 'modal.resolve',
            defaultMessage: '解决'
        },
        modal_resolveReason: {
            id: 'modal.resolveReason',
            defaultMessage: '解决理由'
        },
        modal_noResolveReason: {
            id: 'modal.noResolveReason',
            defaultMessage: '请输入解决理由'
        },
        modal_validating: {
            id: 'modal.validating',
            defaultMessage: '检验中...'
        }
    })

    const { isShowResolveModal, isButtonLoading } = currentData;
    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter}  key={ 1 }>
      <Button type="primary" loading={isButtonLoading || false} onClick={ () => {
        onOk(form)
      }} ><FormattedMessage {...localeMessage['modal_resolve']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
        onCancal(form)
      }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
      </div>
    )
    return (
        <Modal
            title={<FormattedMessage {...localeMessage['modal_resolveIncident']} />}
            maskClosable="true"
            onCancel={ () => { onCancal(form) } }
            visible={ isShowResolveModal }
            footer={ modalFooter }
        >
            <div className={styles.resolveMain}>
                <Form>
                    <Item
                        label={<FormattedMessage {...localeMessage['modal_resolveReason']} />}
                        help={isFieldValidating('resolveMessage') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('resolveMessage') || []).join(', ')}
                    >
                        {getFieldDecorator('resolveMessage', {
                            rules: [
                                { required: true, message: formatMessage({...localeMessage['modal_noResolveReason']})}
                            ]
                        })(
                            <Input placeholder={formatMessage({...localeMessage['modal_noResolveReason']})} />
                        )}
                    </Item>
                </Form>
            </div>
        </Modal>
    )
}

resolveModal.defaultProps = {
    currentData: {},
    onOk: () => {},
    onCancal: () => {},
}

resolveModal.propTypes = {

}

export default injectIntl(Form.create()(resolveModal))