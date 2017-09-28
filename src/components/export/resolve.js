import React, { PropTypes, Component } from 'react'
import { classnames, isMobile } from '../../utils'
import styles from './common.less'
import { Button, Form, Input, Row, Col} from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const Resolve = ({dispatch, form, intl: {formatMessage}}) => {

    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const localeMessage = defineMessages({
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
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
                                        type: 'alertExport/resolveAlert',
                                        payload: {
                                            resolveMessage: formData.resolveMessage,
                                            callback: callback
                                        }
                                    })
                                    form.resetFields();
                                })
                            }}>
                                <FormattedMessage {...localeMessage['modal_resolve']} />
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

Resolve.defaultProps = {
    
}

Resolve.propTypes = {

}

export default injectIntl(Form.create()(Resolve))
