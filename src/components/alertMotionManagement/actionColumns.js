import React, { PropTypes, Component } from 'react'
import { Switch, Button } from 'antd'
import styles from './table.less'
import { injectIntl, FormattedMessage } from 'react-intl';

/**
 * {anction表格的culumns}
 * @param {formatMessage, localeMessage} 国际化信息 
 * @param {deleteClick} 删除按钮的回调 
 * @param {switchClick} 切换按钮的回调 
 * @return {array}
 */
const columns = ({sortOrder, switchClick, deleteClick, editClick, I18: { formatMessage, localeMessage } }) => {
  return [
    {
      key: 'actionName',
    },
    {
      key: 'description'
    },
    {
      key: 'scope',
      html: (scope, row, index) => {
        let text;
        switch (scope && scope.length) {
          case 1:
            scope[0] == 1 ? text = '新产生的告警' : text = '已存在的告警'
            break;
          case 2:
            text = '新产生的告警/已存在的告警'
            break;
          default:
            text = '';
            break;
        }
        return (
          <span className="ant-table-row-indent indent-level-0" style={{ 'paddingLeft': '0px' }}>{text}</span>
        )
      },
    },
    {
      key: 'builtIn',
      //将布尔值转换为是Or否
      conversion: true,
    },
    {
      key: 'opened',
      sorter: true,
      sortOrder: sortOrder,
      html: (bOK, row, index) => {
        return (
          <Switch checked={bOK} onChange={(state) => {
            switchClick && switchClick(bOK, row, index);
          }} />
        )
      },
    },
    {
      key: 'operation',
      html: (text, row, index) => {
        return (
          <div>
            <Button size='small' disabled={row['builtIn']} onClick={() => { editClick && editClick(text, row, index) }} className={styles.editBtn} >{formatMessage({ ...localeMessage['action_edit'] })}</Button>
            &nbsp;&nbsp;
            <Button size='small' disabled={row['builtIn']}  onClick={() => { deleteClick && deleteClick(text, row, index) }} className={styles.delBtn} >{formatMessage({ ...localeMessage['action_delete'] })}</Button>
          </div>
        )
      },
    },
  ]
}
//模态框的表格
const modalColumns = () => {
  return [
    {
      key: 'actionName',
      html: (text, row, index) => {
        const hasSameName = row.hasSameName;
        return (
          <span className="ant-table-row-indent indent-level-0" style={
            hasSameName ? Object.assign({ color: '#ff522a' }, { 'paddingLeft': '0px' }) : { 'paddingLeft': '0px' }
          }>{text}</span>
        )
      },
    },
    {
      key: 'description',
      html: (text, row, index) => {
        const hasSameName = row.hasSameName;
        return (
          <span className="ant-table-row-indent indent-level-0" style={
            hasSameName ? Object.assign({ color: '#ff522a' }, { 'paddingLeft': '0px' }) : { 'paddingLeft': '0px' }
          }>{text}</span>
        )
      },
    },
  ]
}
export default {
  columns,
  modalColumns
};