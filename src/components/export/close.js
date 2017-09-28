import React, { PropTypes, Component } from 'react'
import { classnames, isMobile } from '../../utils'
import styles from './common.less'
import { Button, Form, Select, Row, Col} from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const Option = Select.Option;
const Close = ({dispatch, form, intl: {formatMessage}}) => {

    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const localeMessage = defineMessages({
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
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

    const itemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 },
    }

    const callback = () => {
        console.log('发送成功')
        if (isMobile()) {
          _mobile.dialog.close()
        } else {
          $$.dialog.close()
        }
    }

    return (
        <div className={styles.container}>
            <Form>
                <Item
                    {...itemLayout}
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
                <div className={styles.buttonContainer}>
                    <Row>
                        <Col span='8' offset='5'>
                            <Button type="primary" onClick={ () => {
                                form.validateFieldsAndScroll( (errors, values) => {
                                    if (!!errors) {
                                        return;
                                    }
                                    const formData = form.getFieldsValue()

                                    dispatch({
                                        type: 'alertExport/closeAlert',
                                        payload: {
                                            closeMessage: formData.closeMessage,
                                            callback: callback
                                        }
                                    })
                                    form.resetFields();
                                })
                            }}>
                                <FormattedMessage {...localeMessage['modal_close']} />
                            </Button>
                        </Col>
                        <Col span='11'>
                            <Button type="primary" onClick={ () => {
                                callback();
                                form.resetFields();
                            }}>
                                <FormattedMessage {...localeMessage['modal_cancel']} />
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Form>
        </div>
    )
}

Close.defaultProps = {

}

Close.propTypes = {

}

export default injectIntl(Form.create()(Close))
