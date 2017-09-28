import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Tabs, Button, Upload, message, Spin } from 'antd'
import { classnames } from '../../utils'
import { Link } from 'dva/router'
import ApplicationList from '../common/configList'
import Table from './table'
import { indexMessages } from './I18Message'
import actionColumns from './actionColumns'
import ActionDeleteModal from './actionDeleteModal'
import AddActionModal from './addActionModal'
import ImportActionModal from './importActionModal'
import { indexDispatch } from './dispatch'
import AddSuccessModal from './addSuccessModal'
import constants from '../../utils/constants'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const alertMotionManagement = ({ dispatch, alertMotionManagement, intl: { formatMessage } }) => {
  const {sortOrder,
    isShowImportModal,
    saveImportSelectedRowIds,
    currentDeleteApp,
    actionImportListData, 
    actionListData,
    saveExportSelectedRowIds,
    actionManagementTotal,
    isLoading } = alertMotionManagement;
  //统一dispatch
  const { editClick, switchClick, deleteClick, addActionClick, exportFileClick, importFileClick, saveExportSelectedRowId, sortClick } = indexDispatch(dispatch);
  //本地使用国际化信息
  const localeMessage = indexMessages.localeMessages;
  //表格参数
  const actionListProps = {
    columns: actionColumns.columns({sortOrder, I18: { formatMessage, localeMessage }, switchClick, deleteClick, editClick }),
    listData: actionListData,
    //表格国际化信息
    formatMessages: indexMessages.formatMessages,
    selectedRowKeys: saveExportSelectedRowIds.split(','),
    onChange(selectedRowKeys, selectedRows) {
      //存选择的导出id
      saveExportSelectedRowId(selectedRowKeys.join(","))
    },
    getCheckboxProps(record) {
      return {
        disabled: record.builtIn,
      }
    },
    //排序
    onSortChange(pagination, filters, sorter){
      sortClick(sorter)
    }
  }

  //上传文件属性参数
  const importProps = {
    name: 'file',
    action: constants['api_root'] + '/action/importFile',
    multiple: false,
    accept: '.bin',
    showUploadList: false,
    onChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        importFileClick((info.file && info.file.response) || {});
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  }
  return (
    <div className={styles.myAppTabs}>
      <div className={styles.btnWtrapper}>
        <Button type="primary" className={styles.appBtn} onClick={() => {
          addActionClick();
        }}><span>{formatMessage({ ...localeMessage['addAction'] })}</span></Button>
        <Upload {...importProps}>
          <Button type="primary" className={styles.importBtn} ><span>{formatMessage({ ...localeMessage['actionImport'] })}</span></Button>
        </Upload>
        <Button type="primary" className={styles.exportBtn} onClick={() => {
          if (!saveExportSelectedRowIds)
            message.error(formatMessage({ ...localeMessage['selectExportAction'] }));
          else
            exportFileClick(saveExportSelectedRowIds);
        }}><span>{formatMessage({ ...localeMessage['actionExport'] })}</span></Button>
        <p className={styles.total}><FormattedMessage {...localeMessage['motionTotal']} values={{ num: `${actionManagementTotal}` }} /></p>
        { window.__alert_appLocaleData.locale != 'en-us'?<div className={styles.twoDevelopment} ><a target="_blank" href="help/chapter5/5-2.html">动作插件二次开发指南</a></div>:undefined}
      </div>
      <Spin spinning={isLoading}>
        <Table {...actionListProps} />
      </Spin>
      <ActionDeleteModal />
      <AddActionModal />
      <ImportActionModal />
      <AddSuccessModal />
    </div>
  )
}

export default injectIntl(connect((state) => {
  return {
    alertMotionManagement: state.alertMotionManagement,
  }
})(alertMotionManagement));