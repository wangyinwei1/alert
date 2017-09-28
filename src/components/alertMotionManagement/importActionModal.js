import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { indexMessages } from './I18Message'
import CommonModal from '../common/commonModal'
import actionColumns from './actionColumns'
import Table from './table'
import { Spin } from 'antd' 
import SuccessModal from './successModal'

const appDeleteModal = ({ am_importActionModal, dispatch, intl: { formatMessage } }) => {
  const { isLoading, sameNameCount, count, isShow, saveImportSelectedRowIds, actionImportListData } = am_importActionModal;
  const localeMessage = defineMessages({
    importAction: {
      id: 'alertMotionManagement.modal.importAction',
      defaultMessage: '导入动作'
    },
    replace: {
      id: 'alertMotionManagement.modal.replace',
      defaultMessage: '替换',
    },
    nominalNumber: {
      id: 'alertMotionManagement.modal.nominalNumber',
      defaultMessage: '导入包里有 {count}条动作，列表已存在 {sameNameCount} 条，请确认是否替换'
    }
  })
  const okProps = {
    title: formatMessage({ ...localeMessage['replace'] }),
    onClick: () => {
      dispatch({
        type: 'am_importActionModal/importActionByIds',
        payload: {
          ids: saveImportSelectedRowIds.split(','),
        }
      })
    }
  }
  const cancelProps = {
    onClick: () => {
      dispatch({
        type: 'am_importActionModal/toggleModal',
        payload: {
          status: false,
        }
      })
    }
  }
  const saveImportSelectedRowId = (ids) => {
    dispatch({
        type: 'am_importActionModal/setSaveImportSelectedRowIds',
        payload: {
          ids
        }
      })
  }
  const actionListProps = {
    columns: actionColumns.modalColumns(),
    listData: actionImportListData,
    //表格国际化信息
    formatMessages: indexMessages.formatMessages,
    selectedRowKeys: saveImportSelectedRowIds.split(','),
    onChange(selectedRowKeys, selectedRows) {
      //存选择的导入id
      saveImportSelectedRowId(selectedRowKeys.join(","))
    },
    getCheckboxProps(record) {
      return {
        checked: record.hasSameName
      }
    },
  }
  return (
    <div>
      <CommonModal
        title={formatMessage({ ...localeMessage['importAction'] })}
        isShow={isShow}
        okProps={okProps}
        cancelProps={cancelProps}
      >
        <div>
          <span className={styles.nominalNumber}><FormattedMessage {...localeMessage['nominalNumber']} values={{ count: `${count}`, sameNameCount: `${sameNameCount}` }} /></span>
          <Spin spinning={isLoading}>
            <Table {...actionListProps} />
          </Spin>
        </div>
      </CommonModal>
      <SuccessModal />
    </div>
  )
}

appDeleteModal.propTypes = {

}

export default injectIntl(connect(state => {
  return {
    am_importActionModal: state.am_importActionModal,
  }
})(appDeleteModal));