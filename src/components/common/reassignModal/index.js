import React, { PropTypes, Component } from 'react'
import { Modal, Button, Checkbox, Form, Input, Select, Row, Col } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { message } from 'antd';
import _ from 'lodash'

const localMessage = defineMessages({
  modal_cancel: {
    id: 'modal.cancel',
    defaultMessage: '取消'
  },
  modal_reassign: {
    id: 'modal.ok',
    defaultMessage: '转派',
  },
  modal_reassignTitle: {
    id: 'modal.reassignTitle',
    defaultMessage: '转派指定人员'
  },
  modal_specificUser: {
    id: 'modal.specificUser',
    defaultMessage: '指定人员'
  },
  modal_mustSelectAnUser: {
    id: 'modal.mustSelectAnUser',
    defaultMessage: '必须指定一个转派的用户'
  }

})
const Option = Select.Option;

class ReassignModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.state = {
      selectedUser: {key: '', label: ''}
    }
  }
  componentWillReceiveProps(nextProps) {
    //关闭时清空掉selectedUser
    if (this.props.isShowReassingModal === true && nextProps.isShowReassingModal === false) {
      this.setState({ selectedUser: {key: '', label: ''} })
    }
  }
  handleChange(value) {
    this.setState({ selectedUser: value })
  }
  handleOk() {
    const { onOk, intl: { formatMessage } } = this.props;
    const { selectedUser } = this.state;
    if (selectedUser) {
      onOk(this.state.selectedUser);
    } else {
      message.info(formatMessage(localMessage['modal_mustSelectAnUser']))
    }
  }

  render() {
    const { isShowReassingModal, onOk, onCancel, users, intl: { formatMessage } } = this.props;
    const footer = (
      <div className={styles.modalFooter}>
        <Button type="primary" onClick={this.handleOk}><FormattedMessage {...localMessage['modal_reassign']} /></Button>
        <Button type="primary" onClick={onCancel}><FormattedMessage {...localMessage['modal_cancel']} /></Button>
      </div>
    )
    const selectProps = {
      size: 'large',
      style: { width: '100%' },
      value: this.state.selectedUser,
      onChange: this.handleChange,
      filterOption: false
    }

    return (
      <Modal
        title={formatMessage(localMessage['modal_reassignTitle'])}
        visible={isShowReassingModal}
        onOk={this.handleOk}
        onCancel={onCancel}
        footer={footer}
      //wrapClassName={styles.reassignModal}
      >
        <div className={styles.reassignModalMain}>
          <Row>
            <Col span='7' style={{ lineHeight: '32px' }} className={styles.specificUser}>{formatMessage(localMessage['modal_specificUser']) + ': '}</Col>
            <Col span='17'>
              <Select {...selectProps} showSearch labelInValue onSearch={ _.debounce( (value) => {
                this.props.ownerQuery(value)
              }, 500)}>
                {users.map(user => (<Option key={user.userId}>{user.realName}</Option>))}
              </Select>
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

ReassignModal.propTypes = {

}

export default injectIntl(ReassignModal);
