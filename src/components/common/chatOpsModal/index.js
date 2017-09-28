import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const Option = Select.Option;
const chatOpsModal = ({currentData, closeChatOpsModal, onOk, onCancal, form, intl: {formatMessage}}) => {

    const localeMessage = defineMessages({
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        modal_shareChatOps: {
            id: 'modal.shareChatOps',
            defaultMessage: '分享到ChatOps'
        },
        modal_share: {
            id: 'modal.share',
            defaultMessage: '分享'
        },
        modal_roomName: {
            id: 'modal.roomName',
            defaultMessage: '群组名称'
        },
        modal_validating: {
            id: 'modal.validating',
            defaultMessage: '检验中...'
        },
        modal_noRoomName: {
            id: 'modal.noRoomName',
            defaultMessage: '请选择群组'
        },
    })

    const { isShowChatOpsModal, chatOpsRooms } = currentData;
    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter} key={ 1 }>
      <Button type="primary" onClick={ () => {
        form.validateFieldsAndScroll( (errors, values) => {
            if (!!errors) {
                return;
            }
            const value = form.getFieldValue('roomOption')
            onOk(JSON.parse(value))

            form.resetFields();
        })
      }} ><FormattedMessage {...localeMessage['modal_share']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
        onCancal()
        form.resetFields();
      }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
      </div>
    )

    return (
        <Modal
            title={<FormattedMessage {...localeMessage['modal_shareChatOps']} />}
            maskClosable="true"
            onCancel={ closeChatOpsModal }
            visible={ isShowChatOpsModal }
            footer={ modalFooter }
        >
            <div className={styles.dispatchMain}>
                <Form>
                    <Item
                        label={<FormattedMessage {...localeMessage['modal_roomName']} />}
                        help={isFieldValidating('roomOption') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('roomOption') || []).join(', ')}
                    >
                        {getFieldDecorator('roomOption', {
                            rules: [
                                { required: true, message: formatMessage({...localeMessage['modal_noRoomName']}) }
                            ]
                        })(
                            <Select getPopupContainer={() => {
                              return document.getElementById("content") || document.body
                            }} style={{width: '90%'}} placeholder={formatMessage({...localeMessage['modal_noRoomName']})}>
                                {
                                    chatOpsRooms.map( (item, index) => {
                                        return <Option className={styles.menuItem} key={item._id} value={JSON.stringify({id: item['_id'], roomName: item.topic})}>{item.topic}</Option>
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

chatOpsModal.defaultProps = {
    currentData: {},
    closeChatOpsModal: () => {},
    onOk: () => {},
    onCancal: () => {}
}

chatOpsModal.propTypes = {

}

export default injectIntl(Form.create()(chatOpsModal))