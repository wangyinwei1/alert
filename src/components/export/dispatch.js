import React, { PropTypes, Component } from 'react'
import { classnames, isMobile } from '../../utils'
import styles from './common.less'
import { Button, Form, Select, Row, Col} from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const Option = Select.Option;
class Dispatch extends Component{

    constructor(props) {
        super(props)
        this.callback = this.callback.bind(this)
    }

    componentDidMount() {
      const {dispatch} = this.props;
      window.addEventListener('message', (e) => {
        if(e.data.createTicket !== undefined && e.data.createTicket === 'success') {
            if (isMobile()) {
              _mobile.dialog.close()
            } else {
              $$.dialog.close()
            }
            dispatch({
                type: 'alertExport/closeTicketModal',
            })
        }
      }, false)
    }

    callback() {
        console.log('发送成功')
        if (isMobile()) {
          _mobile.dialog.close()
        } else {
          $$.dialog.close()
        }
    }

    render() {
        const { dispatch, alertExport, form, intl: {formatMessage} } = this.props
        const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;
        const { formOptions, isShowTicketModal, ticketUrl } = alertExport;

        const localeMessage = defineMessages({
            modal_cancel: {
                id: 'modal.cancel',
                defaultMessage: '取消'
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

        const itemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        }

        return (
            <div className={styles.container}>
                {
                    isShowTicketModal ?
                    <iframe src={ticketUrl} />
                    :
                    <Form>
                        <Item
                            {...itemLayout}
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
                                            return <Option key={item.id} value={JSON.stringify({id: item.id, name: item.name})}>{item.name}</Option>
                                        })
                                    }
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
                                            const value = form.getFieldValue('formOption')

                                            dispatch({
                                                type: 'alertExport/dispatchForm',
                                                payload: {
                                                    formOption: JSON.parse(value),
                                                }
                                            })
                                            form.resetFields();
                                        })
                                    }}>
                                        <FormattedMessage {...localeMessage['modal_create']} />
                                    </Button>
                                </Col>
                                <Col span='11'>
                                    <Button type="primary" onClick={ () => {
                                        this.callback();
                                        form.resetFields();
                                    }}>
                                        <FormattedMessage {...localeMessage['modal_cancel']} />
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                }
            </div>
        )

    }
}

Dispatch.defaultProps = {

}

Dispatch.propTypes = {

}

export default injectIntl(Form.create()(Dispatch))
