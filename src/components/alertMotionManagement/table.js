import React, { PropTypes, Component } from 'react';
import { Table } from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import styles from './table.less';

const commonTable = ({ selectedRowKeys, formatMessages, columns, listData, onChange, onSortChange, getCheckboxProps }) => {
  let actionColumns = [];
  _.map(columns, (cd) => {
    const actionKey = cd.key;
    //转化为ant所需要的格式
    let obj = {};
    obj['title'] = <FormattedMessage {...formatMessages[actionKey]} />;
    obj['dataIndex'] = actionKey;
    cd.sorter && (obj['sorter'] = cd.sorter);
    cd.sortOrder && (obj['sortOrder'] = cd.sortOrder);
    cd.html && (obj['render'] = (text, row, index) => { return cd.html(text, row, index) })
    //返回false or true转换为是否
    cd.conversion && (obj['render'] = (bOk) => {
      let text; bOk ? text = '是' : text = '否';
      return <span className="ant-table-row-indent indent-level-0" style={{ 'paddingLeft': '0px' }}>{text}</span>
    })
    actionColumns.push(obj);
  });

  return (
    <div className={styles.tableWrapper}>
      <Table rowKey={record => { return record.id }} loading={false} onChange={onSortChange || (() => { })} rowSelection={{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          onChange && onChange(selectedRowKeys, selectedRows);
        },
        getCheckboxProps: record => {
          return getCheckboxProps && getCheckboxProps(record);
        },
      }} pagination={false} columns={actionColumns} dataSource={listData} />
    </div>
  )
}

export default injectIntl(commonTable);