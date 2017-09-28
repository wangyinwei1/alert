import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const Option = Select.Option;
const dispatchModal = ({currentData, closeDispatchModal, onOk, onCancal, form, intl: {formatMessage}}) => {

    const localeMessage = defineMessages({
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        modal_createTicket: {
            id: 'modal.createTicket',
            defaultMessage: '派发工单'
        },
        modal_create: {
            id: 'modal.create',
            defaultMessage: '派发'
        },
        modal_ticketType: {
            id: 'modal.ticketType',
            defaultMessage: '工单类型'
        },
        modal_validating: {
            id: 'modal.validating',
            defaultMessage: '检验中...'
        },
        modal_noTicketType: {
            id: 'modal.noTicketType',
            defaultMessage: '请输选择工单类型'
        },
    })

    const { isShowFormModal, formOptions } = currentData;
    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter} key={ 1 }>
      <Button type="primary" onClick={ () => {
        form.validateFieldsAndScroll( (errors, values) => {
            if (!!errors) {
                return;
            }
            const value = form.getFieldValue('formOption')
            onOk(JSON.parse(value))

            form.resetFields();
        })
      }} ><FormattedMessage {...localeMessage['modal_create']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
        onCancal()
        form.resetFields();
      }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
      </div>
    )

    return (
        <Modal
            title={<FormattedMessage {...localeMessage['modal_createTicket']} />}
            maskClosable="true"
            onCancel={ closeDispatchModal }
            visible={ isShowFormModal }
            footer={ modalFooter }
        >
            <div className={styles.dispatchMain}>
                <Form>
                    <Item
                        label={<FormattedMessage {...localeMessage['modal_ticketType']} />}
                        help={isFieldValidating('formOption') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('formOption') || []).join(', ')}
                    >
                        {getFieldDecorator('formOption', {
                            rules: [
                                { required: true, message: formatMessage({...localeMessage['modal_noTicketType']}) }
                            ]
                        })(
                            <Select getPopupContainer={() => {
                              return document.getElementById("content") || document.body
                            }} style={{width: '90%'}} placeholder={formatMessage({...localeMessage['modal_noTicketType']})}>
                                {
                                    formOptions.map( (item, index) => {
                                        return <Option className={styles.menuItem} key={item.id} value={JSON.stringify({id: item.id, name: item.name})}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </Item>
                </Form>
            </div>
        </Modal>
    )
}

dispatchModal.defaultProps = {
    currentData: {},
    closeDispatchModal: () => {},
    onOk: () => {},
    onCancal: () => {}
}

dispatchModal.propTypes = {

}

export default injectIntl(Form.create()(dispatchModal))