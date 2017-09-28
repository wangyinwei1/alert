import React, { PropTypes, Component } from 'react'
import { Button, Spin, Popover, Checkbox } from 'antd';
import LevelIcon from '../levelIcon/index.js'
import Animate from 'rc-animate'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import $ from 'jquery'
import WrapableTr from './wrapableTr'
import TopFixedArea from './topFixedArea'
import ScrollBar from './scrollBar'

const defaultShowNums = 10;

const formatDate = function (date, selectedTime) {
  const d = new Date(date)
  let month = d.getMonth() + 1;
  let dates = d.getDate()
  let hours = d.getHours()
  let mins = d.getMinutes()

  month = month < 10 ? '0' + month : month
  dates = dates < 10 ? '0' + dates : dates
  hours = hours < 10 ? '0' + hours : hours
  mins = mins < 10 ? '0' + mins : mins

  let result = hours + ':' + mins;

  switch (selectedTime) {
    case 'lastOneWeek':
      result = month + '-' + dates;
      break;
    case 'lastFifteenDay':
      result = month + '-' + dates;
      break;
    case 'lastOneMonth':
      result = month + '-' + dates;
      break;
    default:
      break;
  }

  return result;
}

const getTimeTh = ({ begin, end }) => {
  const timeTH = [];

  const gridWidth = 100 / 11;
  const gridTime = (end - begin) / 11;
  const countMins = (end - begin) / (60 * 1000)
  const minuteToWidth = 100 / countMins

  for (let i = 0; i < defaultShowNums; i++) {

    const timstamp = begin + gridTime * i
    const date = formatDate(timstamp)
    const left = gridWidth * i
    timeTH.push(
      <div key={i}>
        <span className={styles.timePos} style={{ left: left + '%' }}>
          {date}
        </span>
        <span className={styles.timeSep} style={{ left: left + '%' }}>
        </span>
      </div>
    )
    // 添加最后时间点的显示
    if (i == (defaultShowNums - 1)) {
      const lastTimeLeft = gridWidth * defaultShowNums
      const lastTime = formatDate(end)
      timeTH.push(
        <div key={defaultShowNums}>
          <span className={styles.timePos} style={{ left: lastTimeLeft + '%' }}>
            {lastTime}
          </span>
          <span className={styles.timeSep} style={{ left: lastTimeLeft + '%' }}>
          </span>
        </div>
      )
    }
  }

  return timeTH;
}

class Theads extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {

  }

  componentDidUpdate(oldProps) {

  }

  componentWillUnMount() {
    clearTimeout(this.autoLoad);
    this._cancelAutoLoadMore();
  }

  render() {
    const {
      sourceOrigin,
      isGroup,
      columns,
      selectedAll,
      handleSelectAll,
      orderUp,
      orderDown,
      orderBy,
      orderType,
      orderByTittle,
      timeNodeInfo,
      begin,
      end,
      intl: { formatMessage }
    } = this.props
    let colsKey = []
    let theads = []

    const formatMessages = defineMessages({
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
      status: {
        id: 'alertList.title.status',
        defaultMessage: '告警状态',
      },
      description: {
        id: 'alertList.title.description',
        defaultMessage: '告警描述',
      },
      count: {
        id: 'alertList.title.count',
        defaultMessage: '次数',
      },
      classCode: {
        id: 'alertList.title.classCode',
        defaultMessage: '资源类型',
      },
      tags: {
        id: 'alertList.title.tags',
        defaultMessage: '标签',
      },
      lastTime: {
        id: 'alertList.title.lastTime',
        defaultMessage: '持续时间',
      },
      lastOccurTime: {
        id: 'alertList.title.lastOccurTime',
        defaultMessage: '最后发送时间',
      },
      firstOccurTime: {
        id: 'alertList.title.firstOccurTime',
        defaultMessage: '首次发生时间',
      },
      entityAddr: {
        id: 'alertList.title.entityAddr',
        defaultMessage: 'IP地址',
      },
      orderFlowNum: {
        id: 'alertList.title.orderFlowNum',
        defaultMessage: '关联工单',
      },
      notifyList: {
        id: 'alertList.title.notifyList',
        defaultMessage: '是否分享',
      },
      suppressionFlag: {
        id: 'alertList.title.suppressionFlag',
        defaultMessage: '是否被抑制'
      },
      suppressionYesFlag: {
        id: 'alertList.title.suppressionFlag.yes',
        defaultMessage: '已被抑制'
      },
      showMore: {
        id: 'alertList.showMore',
        defaultMessage: '显示更多',
      },
      noData: {
        id: 'alertList.noListData',
        defaultMessage: '暂无数据',
      },
      owner: {
        id: 'alertDetail.owner',
        defaultMessage: '负责人'
      },
      Unknown: {
        id: 'alertList.unknown',
        defaultMessage: '未知',
      }
    })

    columns.forEach((item) => {
      const isOrder = item.order || false
      //const width = item.width || 'auto'
      const orderTriangle = orderBy !== undefined && item['key'] == orderBy ? styles['orderTriang-active'] : undefined
      const orderTh_active = orderBy !== undefined && item['key'] == orderBy ? styles['orderTh-active'] : undefined

      colsKey.push(item['key'])

      theads.push(
        <th key={item.key} className={item.key === 'tags' ? styles.tagsKey : ''} style={{ width: item.isFixed ? (item.key === 'tags' ? '200px' : '150px') : undefined }}>
          {
            !isGroup && isOrder ?
              <span className={orderType !== undefined ? classnames(styles.orderTh, orderTh_active) : styles.orderTh} data-key={item['key']} onClick={orderByTittle}>
                {item.title === undefined ? formatMessage({ ...formatMessages[item['key']] }) : `${item.title}`}
              </span>
              : item.title === undefined ? <FormattedMessage {...formatMessages[item['key']]} /> : `${item.title}`
          }
          {
            !isGroup && isOrder &&
            [
              <span className={orderType !== undefined && orderType === 1 ? classnames(styles.orderTriangleUp, orderTriangle) : styles.orderTriangleUp} data-key={item['key']} key={1} onClick={orderUp}></span>,
              <span className={orderType !== undefined && orderType === 0 ? classnames(styles.orderTriangleDown, orderTriangle) : styles.orderTriangleDown} data-key={item['key']} key={0} onClick={orderDown}></span>
            ]
          }
        </th>
      )
    })

    theads.unshift(<th className={styles.moreLittle} style={{ width: columns[0].isFixed ? '25px' : undefined }} key="blank"></th>);
    theads.unshift(<th className={styles.moreLittle} style={{ width: columns[0].isFixed ? '25px' : undefined }} key='spread'></th>);
    if (sourceOrigin !== 'alertQuery') {
      theads.unshift(<th key="checkAll" className={classnames(styles.checkstyle, styles.little)} style={{ width: columns[0].isFixed ? '50px' : undefined }}><Checkbox onClick={(e) => { handleSelectAll(!selectedAll) }} checked={selectedAll} /></th>)
    }
    if (begin && end) {
      const timeTh = getTimeTh({ begin, end });
      theads.push(<th key="timeDot">{timeTh}</th>);
    }

    return (
      <thead>
        <tr>
          {theads}
        </tr>
      </thead>
    )
  }
}

Theads.defaultProps = {
  target: 'div#topMain', // 用于设置参考对象
  handleSelectAll: () => { },
}

Theads.propTypes = {
  sourceOrigin: PropTypes.string.isRequired
}

export default injectIntl(Theads)
