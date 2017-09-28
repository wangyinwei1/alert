import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Table } from 'antd';
import styles from './index.less'
import LevelIcon from '../levelIcon/index.js'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const MergeModal = ({ isShowMergeModal, mergeInfoList, originAlert, selectMergeRows, removeAlert, closeMergeModal, mergeAlert }) => {

  const localeMessage = defineMessages({
    modal_cancel: {
      id: 'modal.cancel',
      defaultMessage: '取消'
    },
    modal_operate: {
      id: 'modal.operation',
      defaultMessage: '操作'
    },
    modal_rollup: {
      id: 'modal.rollup',
      defaultMessage: '合并告警'
    },
    modal_remove: {
      id: 'modal.remove',
      defaultMessage: '移除'
    },
    modal_rollupTitle: {
      id: 'modal.rollupTitle',
      defaultMessage: '合并告警前，请选择一条告警做源告警'
    },
    entityName: {
      id: 'alertList.title.enityName',
      defaultMessage: '对象',
    },
    name: {
      id: 'alertList.title.name',
      defaultMessage: '告警名称',
    },
    source: {
      id: 'alertList.title.source',
      defaultMessage: '告警来源',
    },
    description: {
      id: 'alertList.title.description',
      defaultMessage: '告警描述',
    },
    lastTime: {
      id: 'alertList.title.lastTime',
      defaultMessage: '持续时间',
    },
  })

  const modalFooter = []
  modalFooter.push(<div className={styles.modalFooter} key={1}>
    <Button type="primary" disabled={
      originAlert !== undefined
        && originAlert.length == 0
        || (mergeInfoList !== undefined
          && mergeInfoList.length < 2)
        ? true : false} onClick={() => {
          mergeAlert();
        }} ><FormattedMessage {...localeMessage['modal_rollup']} /></Button>
    <Button type="ghost" className={styles.ghostBtn} onClick={() => {
      closeMergeModal();
    }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
  </div>
  )

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: originAlert,
    onChange: selectMergeRows
  }

  return (
    <Modal
      title={<FormattedMessage {...localeMessage['modal_rollup']} />}
      maskClosable="true"
      onCancel={closeMergeModal}
      visible={isShowMergeModal}
      footer={modalFooter}
      width={900}
    >
      <div className={styles.mergeTable}>
        <p className={styles.title}><FormattedMessage {...localeMessage['modal_rollupTitle']} /></p>
        <Table
          columns={[
            {
              key: 'icon',
              dataIndex: 'severity',
              render: (text, record, index) => {
                return <LevelIcon key={index} iconType={text} />
              }
            },
            {
              title: <FormattedMessage {...localeMessage['entityName']} />,
              key: 'entityName',
              dataIndex: 'entityName'
            },
            {
              title: <FormattedMessage {...localeMessage['name']} />,
              key: 'name',
              dataIndex: 'name'
            },
            {
              title: <FormattedMessage {...localeMessage['source']} />,
              key: 'source',
              dataIndex: 'source'
            },
            {
              title: <FormattedMessage {...localeMessage['description']} />,
              key: 'description',
              dataIndex: 'description'
            },
            {
              title: <FormattedMessage {...localeMessage['lastTime']} />,
              key: 'lastTime',
              dataIndex: 'lastTime',
              render: (data) => {
                return <span>{`${Math.floor(data / (60 * 60 * 1000))}h`}</span>
              }
            },
            {
              title: <FormattedMessage {...localeMessage['modal_operate']} />,
              key: 'operation',
              render: (text, record) => {
                return <a className={styles.remove} href="javascript:void(0)" onClick={() => {
                  removeAlert(record);
                }} ><FormattedMessage {...localeMessage['modal_remove']} /></a>
              }
            }
          ]}

          rowKey={record => record.id}
          dataSource={mergeInfoList}
          rowSelection={rowSelection}
          pagination={false}

        ></Table>
      </div>
    </Modal>
  )
}

MergeModal.defaultProps = {

}

MergeModal.propTypes = {

}

export default connect(state => {
  return {
    alertOperation: state.alertOperation,
  }
})(MergeModal);