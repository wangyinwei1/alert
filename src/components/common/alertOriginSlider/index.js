import React, { PropTypes, Component } from 'react'
import { Button, Table } from 'antd';
import styles from './index.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { classnames } from '../../../utils'
import $ from 'jquery'
import DatePeriodPicker from '../datePeriodPicker/index'

class AlertOriginSlider extends Component {
  componentWillMount() {
    this.unmounted = false;
    this.headerHeight = 30;
    this.totalTipHeight = 31;
    this.paginationHeight = 51;
    this.thHeight = 80;
  }

  componentDidMount() {
    this.tableContentHeight = this._computerTableContentHeight();
    this._setAutoHide();
    this._setAutoTableHeight();
  }

  componentWillReceiveProps() {
    this.tableContentHeight = this._computerTableContentHeight();
    // $("th.ant-table-column-sort").bind('click', function() {
    //   console.log("click");
    //   const $this = $(this).closest("th.ant-table-column-sort");
    //   $this.find("span > .ant-table-column-sorter").children('span.off').trigger("click");
    // })
  }

  componentWillUnmount() {
    this._cancelAutoHide();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  // 窗口改变大小后自动设置Table可视高度
  _setAutoTableHeight() {
    $(window).resize(() => {
      this.tableContentHeight = this._computerTableContentHeight();
      if (!this.unmounted) {
        this.setState({});
      }
    })
  }

  _cancelAutoTableHeight() {
    $(window).unbind("resize");
  }

  // 动态计算表格应该占据的高度
  _computerTableContentHeight() {
    const ele = document.getElementById("alertOriginSlider");
    if (ele) {
      const totalHeight = ele.offsetHeight;
      const tableContentHeight = totalHeight - this.headerHeight - this.totalTipHeight - this.paginationHeight - this.thHeight;
      return tableContentHeight;
    } else {
      return 0;
    }
  }

  // 设置当鼠标点击不处于本区域时隐藏右侧滑动栏的全局事件
  _setAutoHide() {
    $(window.document.body).on("click", (e) => {
      const $target = $(e.target);
      const $toCloseSlider = $target.closest("div#alertOriginSlider");
      const $toClosePopover = $target.closest("div.ant-popover")

      // 如果点击的组件补上下拉框选项或者不在弹出框上或者不在右侧滑动栏上，则隐藏右侧滑动栏
      if ($toCloseSlider.length == 0 && $toClosePopover.length == 0 && this.props.visible) {
        this.props.onClose();
      }
    })
  }

  // 接触当鼠标点击不处于本区域时隐藏右侧滑动栏的全局事件
  _cancelAutoHide() {
    $(window.document.body).unbind("click");
  }

  render() {
    const { onSearch, onClose, alertOrigin, currentAlertDetail = {}, onPageChange, visible, loading, intl: { formatMessage } } = this.props;
    const localeMessage = defineMessages({
      occurTime: {
        id: "alertList.title.occurTime",
        defaultMessage: "发生时间"
      },
      entityName: {
        id: "alertList.title.enityName",
        defaultMessage: "对象"
      },
      entityAddress: {
        id: "alertList.title.entityAddr",
        defaultMessage: "IP地址"
      },
      description: {
        id: "alertList.title.description",
        defaultMessage: "告警描述"
      },
      alertTimesDescription: {
        id: "alertList.detailHistory.alertTimesDescription",
        defaultMessage: "累计发生告警次数{ times }次"
      },
      alertStartTimePlaceholder: {
        id: "alertList.detailHistory.alertStartTime.placeholder",
        defaultMessage: "请点击选择告警发生的时间范围"
      }
    })

    const shanchuClass = classnames(
      'iconfont',
      'icon-shanchux',
      styles.close
    )

    const pagination = alertOrigin.pagination || {};
    const sorter = alertOrigin.sorter || {};

    const period = alertOrigin.period;
    const times = pagination.total;
    const records = alertOrigin.records;
    const name = alertOrigin.alertName;
    const columns = [
      {
        title: (
          <span className={styles.sorter} onClick={() =>
            onPageChange(1, undefined, { field: 'occurTime', order: sorter.sortType <= 0 ? 'ascend' : 'descend' })
          }
          > {formatMessage({ ...localeMessage['occurTime'] })}</span>
        ),
        dataIndex: 'occurTime',
        key: 'occurTime',
        sorter: true,
        sortOrder: sorter.sortKey == 'occurTime' ? (sorter.sortType > 0 ? 'ascend' : 'descend') : true,
        width: "25%",
        // onCellClick: function(record, e) {
        //   console.log("cellClick");
        // }
      },
      {
        title: formatMessage({ ...localeMessage['entityName'] }),
        dataIndex: 'entityName',
        key: 'entityName',
        width: "25%"
      },
      {
        title: formatMessage({ ...localeMessage['entityAddress'] }),
        dataIndex: 'entityAddr',
        key: 'entityAddr',
        width: "25%"
      },
      {
        title: formatMessage({ ...localeMessage['description'] }),
        dataIndex: 'description',
        key: 'description',
        width: "25%"
      },
    ]

    // console.log(loading, "loading");

    return (
      <div id="alertOriginSlider" className={classnames(styles.alertOriginSlider, visible ? styles.show : '')}>
        <div className={styles.main}>
          <div className={styles.header}>
            <p>{name || '-'}</p>
            <i onClick={onClose} className={shanchuClass} />
          </div>
          <div className={styles.line} ></div>
          <div className={styles.totalTip}>
            <p>
              <FormattedMessage {...localeMessage['alertTimesDescription']}
                values={{
                  times: <span className={styles.totalNum}><b>{times || '-'}</b></span>
                }}
              />
            </p>
            <div className={styles.startTimePeriod}>
              <DatePeriodPicker value={visible ? '' : undefined} placeholder={formatMessage({ ...localeMessage['alertStartTimePlaceholder'] })} onChange={([startTime, endTime]) => {
                onSearch({ startTime, endTime })
              }} />
            </div>
          </div>
          <div className={styles.tableContent}>
            <Table size="middle" scroll={{ y: this.tableContentHeight }} loading={loading} columns={columns} dataSource={records} onChange={onPageChange} pagination={{
              showQuickJumper: true,
              current: pagination.pageNo,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }} />
          </div>
        </div>
      </div>

    )
  }
}


AlertOriginSlider.defaultProps = {
  onClose: () => { },
  onPageChange: () => { },
  onSearch: () => { },
  visible: false,
  alertOrigin: {}
}

AlertOriginSlider.PropTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  onClose: PropTypes.func,
  onPageChange: PropTypes.func,
  onSearch: PropTypes.func,
  alertOrigin: PropTypes.shape({
    pagination: PropTypes.shape({
      pageNo: PropTypes.number,
      pageSize: PropTypes.number,
      totalPage: PropTypes.number,
      total: PropTypes.number,
    }),
    searchParam: PropTypes.shape({
      startTime: PropTypes.number,
      endTime: PropTypes.number
    }),
    period: PropTypes.string,
    records: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      occurTime: PropTypes.string,
      entityName: PropTypes.string,
      entityAddress: PropTypes.string,
      description: PropTypes.string
    }))
  })
}

export default AlertOriginSlider;
