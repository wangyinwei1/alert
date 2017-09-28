import React, { PropTypes, Component } from 'react'
import { Button, Spin, Checkbox, Tooltip } from 'antd';
import { connect } from 'dva'
import { Popover } from 'antd'
import Animate from 'rc-animate'
import styles from '../index.less'
import LevelIcon from '../../common/levelIcon/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { classnames, groupSort } from '../../../utils'
class ListTimeTable extends Component {
  componentDidMount() {

    const { setTimeLineWidth, begin, end } = this.props

    const table = document.getElementById('listTimeTable')
    const width = table.offsetWidth
    const timeLine = document.getElementById('timeLine')
    // 500                                                                                                                                                                  表格左侧宽度
    // 100 是最后一点预留位置
    const lineW = width - 500 - 80

    timeLine.style.width = lineW + 'px'
    const gridWidth = lineW / 10
    const countMins = (end - begin) / (60 * 1000)
    const minuteToWidth = lineW / countMins

    setTimeLineWidth(gridWidth, minuteToWidth, lineW)

  }

  render() {
    const {
        isGroup,
      groupBy,
      gridWidth,
      minuteToWidth,
      begin,
      end,
      data,
      columns,
      loadMore,
      isShowMore,
      checkAlertFunc,
      checkAlert,
      detailClick,
      spreadChild,
      noSpreadChild,
      spreadGroup,
      noSpreadGroup,
      selectedAll,
      // toggleSelectedAll,
      relieveClick,
      isLoading,
      selectedTime,
      handleSelectAll,
      userInfo = {},
      isNeedCheckOwner
      } = this.props

    let colsKey = []
    const formatMessages = defineMessages({
      entityName: {
        id: 'alertList.title.enityName',
        defaultMessage: '对象',
      },
      name: {
        id: 'alertList.title.name',
        defaultMessage: '告警名称',
      },
      showMore: {
        id: 'alertList.showMore',
        defaultMessage: '显示更多',
      },
      noData: {
        id: 'alertList.noListData',
        defaultMessage: '暂无数据',
      },
      Unknown: {
        id: 'alertList.unknown',
        defaultMessage: '未知',
      },
      source: {
        id: 'alertList.title.source',
        defaultMessage: '告警来源',
      },
      description: {
        id: 'alertList.title.description',
        defaultMessage: '告警描述',
      },
      occurTime: {
        id: 'alertList.title.occurTime',
        defaultMessage: '发生时间',
      },
      incidentId: {
        id: 'alertList.title.id',
        defaultMessage: '告警ID',
      },
      severity: {
        id: 'alertList.title.severity',
        defaultMessage: '告警级别',
      },
      ownerCheckMsg: {
        id: 'alertList.tooltip.ownerWarn',
        defaultMessage: '无法操作负责人不是您的告警'
      }
    })

    const theads = columns.filter(item => (item['key'] == 'entityName' || item['key'] == 'name')).map((item) => {
      //const width = item.width || 'auto'
      colsKey.push(item['key'])
      return (
        <th key={item.key}>
          {item.title === undefined ? <FormattedMessage {...formatMessages[item['key']]} /> : `${item.title}`}
        </th>
      )
    })


    const defaultShowNums = 10; //默认显示10个点
    const gridTime = (end - begin) / defaultShowNums //间隔时间戳

    let timeTH = []

    const formatDate = function (date) {
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
    for (let i = 0; i < defaultShowNums; i++) {

      const timstamp = begin + gridTime * i
      const date = formatDate(timstamp)
      const left = gridWidth * i
      timeTH.push(
        <div key={i}>
          <span className={styles.timePos} style={{ left: left + 'px' }}>
            {date}
          </span>
          <span className={styles.timeSep} style={{ left: left + 'px' }}>
          </span>
        </div>
      )
      // 添加最后时间点的显示
      if (i == (defaultShowNums - 1)) {
        const lastTimeLeft = gridWidth * defaultShowNums
        const lastTime = formatDate(end)
        timeTH.push(
          <div key={defaultShowNums}>
            <span className={styles.timePos} style={{ left: lastTimeLeft + 'px' }}>
              {lastTime}
            </span>
            <span className={styles.timeSep} style={{ left: lastTimeLeft + 'px' }}>
            </span>
          </div>
        )


      }

    }


    let tbodyCon = []

    // 生成列
    const genTds = (item, keys, target = 'parent', classify) => {
      let TDS = []
      const relieveIcon = classnames(
        'iconfont',
        'icon-zaixian',
        styles.relieveIcon
      )
      keys.forEach((key, index) => {
        // const tdKey = item.date + key
        const className = key == 'name' ? 'tdBorderRight' : ''
        if (index == 0 && target === 'parent') {
          TDS.push(
            <td key='sourceAlert'>
              {
                item['hasChild'] === true
                  ? item['isSpread'] === true
                    ? <span className={styles.triangleUp} data-id={item.id} onClick={noSpreadChild}></span>
                    : <span className={styles.triangleDown} data-id={item.id} onClick={spreadChild}></span>
                  : undefined
              }
            </td>
          )
        }
        if (key == 'name') {
          TDS.push(<td key={key} className={styles[className]} width="200" data-id={item.id} onClick={detailClick} >
            <div key='nameDiv' title={item[key]} className={styles['name']} data-id={item.id}>{item[key]}</div>
            {
              item['hasChild'] === true && target === 'parent' ?
                <span className={relieveIcon} data-id={classify ? JSON.stringify({ id: item.id, classify: classify }) : JSON.stringify({ id: item.id })} onClick={relieveClick}></span>
                :
                undefined
            }
          </td>)
        } else if (key == 'entityName') {
          TDS.push(<td key={key} title={item[key]} className={styles[className]} width="200"><div key='entityNameDiv' className={styles['entityName']}>{item[key]}</div></td>)
        } else {
          TDS.push(<td key={key} className={styles[className]}>{item[key]}</td>)
        }

      })
      if (target === 'parent') {
        TDS.unshift(<td width="20" key='icon-col-td'><LevelIcon iconType={item['severity']} /></td>)
      } else {
        TDS.unshift(<td width="20" key='icon-col-td'><LevelIcon iconType={item['severity']} /></td>)
        TDS.unshift(<td key='space-col-td'></td>)
      }
      return TDS
    }

    //  生成时间线
    const genDots = (item, keys) => {
      let dots = null
      let dotsLine = []
      let lineDotLeft = 0
      let lineDotW = 0

      if (item !== undefined && item.length !== 0) {
        lineDotLeft = (item[0].occurTime - begin) / (60 * 1000) * minuteToWidth
        const len = item.length
        lineDotW = (item[len - 1]['occurTime'] - item[0]['occurTime']) / (60 * 1000) * minuteToWidth

        dots = item.map((itemDot, idx) => {
          const left = (itemDot.occurTime - begin) / (60 * 1000) * minuteToWidth
          const iconColor = itemDot['severity'] == 3 ?
            'jjLevel' : itemDot['severity'] == 2 ?
              'gjLevel' : itemDot['severity'] == 1 ?
                'txLevel' : itemDot['severity'] == 0 ?
                  'hfLevel' : undefined
          let newDate = new Date(+itemDot['occurTime'])
          const content = (
            <div>
              <p><FormattedMessage {...formatMessages['severity']} />{`：${window['_severity'][itemDot['severity']]}`}</p>
              <p><FormattedMessage {...formatMessages['name']} />{`：${itemDot['name']}`}</p>
              <p><FormattedMessage {...formatMessages['occurTime']} />{`：${newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDate() + ' ' + newDate.getHours() + ':' + newDate.getMinutes()}`}</p>
              <p><FormattedMessage {...formatMessages['description']} />{`：${itemDot['description']}`}</p>
              <p><FormattedMessage {...formatMessages['source']} />{`：${itemDot['source']}`}</p>
            </div>
          );
          return (
            <Popover content={content} overlayClassName={styles.popover} key={`dot-${idx}`}>
              <span style={{ left: left + 'px' }} className={styles[iconColor]} data-id={itemDot.id} onClick={detailClick}></span>
            </Popover>

          )
        })

        return {
          dots,
          lineDotW,
          lineDotLeft
        }

      } else {
        return {
          dots: [],
          lineDotW: 0,
          lineDotLeft: 0
        }
      }
    }

    // 生成子告警行
    const genchildTrs = (childItem, childIndex, keys, item, isGroup, lineDotW, lineDotLeft) => {
      const childTds = genTds(childItem, keys, 'child')
      const childDotsInfo = genDots(childItem.timeLine, keys)
      const childDots = childDotsInfo.dots
      const childLineDotW = childDotsInfo.lineDotW
      const childLineDotLeft = childDotsInfo.lineDotLeft
      const trKey = childItem.id || 'chTd' + childIndex
      return (
        <tr key={trKey} className={!item.isSpread ? styles.hiddenChild : !isGroup ? styles.noSpread : styles.groupSpread}>
          <td key="checkbox"></td>
          {childTds}
          <td key="timeDot">
            <div className={styles.timeLineDot}>
              <div className={styles.lineDot} style={{ width: childLineDotW + 'px', left: childLineDotLeft + 'px' }}></div>
              {childDots}
            </div>
          </td>
        </tr>
      )
    }

    if (isGroup) {
      groupSort()(data, groupBy).forEach((groupItem, index) => {
        let keys = colsKey;

        let groupTr = null
        let commonTrs = []
        let childTrs = []
        // 分组行
        groupTr = groupItem.isGroupSpread === false ?
          (<tr className={styles.trGroup} key={index}>
            <td colSpan={6}>
              <span className={styles.expandIcon} data-classify={groupItem.classify} onClick={spreadGroup}>+</span>
              {
                groupBy && groupBy == 'status' ?
                  window['_status'][groupItem.classify]
                  :
                  groupBy && groupBy == 'severity' ?
                    window['_severity'][groupItem.classify]
                    :
                    groupItem.classify ? groupItem.classify : <FormattedMessage {...formatMessages['Unknown']} />
              }
            </td>
          </tr>)
          :
          (<tr className={styles.trGroup} key={index}>
            <td colSpan={6}>
              <span className={styles.expandIcon} data-classify={groupItem.classify} onClick={noSpreadGroup}>-</span>
              {
                groupBy && groupBy == 'status' ?
                  window['_status'][groupItem.classify]
                  :
                  groupBy && groupBy == 'severity' ?
                    window['_severity'][groupItem.classify]
                    :
                    groupItem.classify ? groupItem.classify : <FormattedMessage {...formatMessages['Unknown']} />
              }
            </td>
          </tr>)

        if (groupItem.children !== undefined) {

          groupItem.children.forEach((item, itemIndex) => {

            const tds = genTds(item, keys, _, groupItem.classify)
            const dotsInfo = genDots(item.timeLine, keys)
            const dots = dotsInfo.dots
            const lineDotW = dotsInfo.lineDotW
            const lineDotLeft = dotsInfo.lineDotLeft

            if (item.childrenAlert && groupItem.isGroupSpread !== false) {
              childTrs = item.childrenAlert.map((childItem, childIndex) => {
                //keys = Object.keys(childItem);
                return genchildTrs(childItem, childIndex, keys, item, isGroup, lineDotW, lineDotLeft)

              })
            } else {
              childTrs = null
            }

            let trKey = item.id || `tr_${index}_`
            let tdKey = item.id || `td_${index}_`

            commonTrs.push(
              <tr key={trKey} className={groupItem.isGroupSpread !== undefined && !groupItem.isGroupSpread ? styles.hiddenChild : styles.groupSpread}>
                <td key="checkbox" className={styles.checkstyle}>
                  {/*{
                    isNeedCheckOwner ?
                      <Tooltip placement="left" getPopupContainer={() => document.getElementById("content")} title={<FormattedMessage {...formatMessages[item.ownerCheckMsg]} />}>
                        <Checkbox checked={checkAlert[item.id] && checkAlert[item.id].checked} data-id={item.id} data-no-need-wrap={true} onClick={checkAlertFunc} disabled={isNeedCheckOwner && userInfo.userId ? !(userInfo.userId == item.ownerId || userInfo.realName == item.ownerName) : undefined} />
                      </Tooltip>
                      :
                      <Checkbox checked={checkAlert[item.id] && checkAlert[item.id].checked} data-id={item.id} data-no-need-wrap={true} onClick={checkAlertFunc} />
                  }*/}
                  <Checkbox checked={checkAlert[item.id] && checkAlert[item.id].checked} data-id={item.id} data-no-need-wrap={true} onClick={checkAlertFunc} disabled={ isNeedCheckOwner && userInfo.userId?!(userInfo.userId == item.owner || userInfo.realName == item.ownerName):undefined } />
                </td>
                {tds}
                <td key="timeDot">
                  <div className={styles.timeLineDot}>
                    <div className={styles.lineDot} style={{ width: lineDotW + 'px', left: lineDotLeft + 'px' }}></div>
                    {dots}
                  </div>
                </td>
              </tr>,
              childTrs
            )


          })

        }
        tbodyCon.push(
          groupTr,
          commonTrs
        )



      })

    } else {

      if (data.length > 0 && data.children === undefined) {

        data.forEach((item, index) => {

          let keys = colsKey;

          const tdCheck = Object.keys(checkAlert).length !== 0 ?
            <td key="checkbox" className={styles.checkstyle}>
              {/*{
                (isNeedCheckOwner && userInfo.userId ? !(userInfo.userId == item.ownerId || userInfo.realName == item.ownerName) : undefined)?
                  <Tooltip placement="right" getPopupContainer={() => document.getElementById("content")} title={<FormattedMessage {...formatMessages['ownerCheckMsg']} />}>
                    <Checkbox checked={checkAlert[item.id] && checkAlert[item.id].checked} data-id={item.id} data-no-need-wrap={true} onClick={checkAlertFunc} disabled={isNeedCheckOwner && userInfo.userId ? !(userInfo.userId == item.ownerId || userInfo.realName == item.ownerName) : undefined} />
                  </Tooltip>
                  :
                  <Checkbox checked={checkAlert[item.id] && checkAlert[item.id].checked} data-id={item.id} data-no-need-wrap={true} onClick={checkAlertFunc} />
              }*/}

              <Checkbox checked={checkAlert[item.id] && checkAlert[item.id].checked} data-id={item.id} data-no-need-wrap={true} onClick={checkAlertFunc} disabled={ isNeedCheckOwner && userInfo.userId?!(userInfo.userId == item.owner || userInfo.realName == item.ownerName):undefined } />

            </td>
            :
            undefined
          const tds = genTds(item, keys)
          const dotsInfo = genDots(item.timeLine, keys)
          const dots = dotsInfo.dots
          const lineDotW = dotsInfo.lineDotW
          const lineDotLeft = dotsInfo.lineDotLeft

          // 如果有子告警
          let childTrs = []

          if (item.childrenAlert) {

            childTrs = item.childrenAlert.map((childItem, childIndex) => {
              keys = colsKey
              return genchildTrs(childItem, childIndex, keys, item, isGroup, lineDotW, lineDotLeft)

            })
          } else {
            childTrs = null
          }
          let trKey = item.id || `tr_${index}`
          tbodyCon.push(
            <tr key={trKey} className={styles.noSpread}>
              {tdCheck}
              {tds}
              <td key="timeDot">
                <div className={styles.timeLineDot}>
                  <div className={styles.lineDot} style={{ width: lineDotW + 'px', left: lineDotLeft + 'px' }}></div>
                  {dots}
                </div>
              </td>
            </tr>,
            childTrs
          )
        })
      }
    }


    return (
      <div>
        <Spin spinning={isLoading}>
          <table width='100%' id="listTimeTable" className={styles.listTimeTable}>
            <thead>
              <tr>
                <th key="checkAll" width='48' className={styles.checkstyle}><Checkbox onClick={handleSelectAll} checked={selectedAll} /></th>
                <th width="20" key='space-col'></th>
                <th width='10'></th>
                {theads}
                <th key="timeLine" id="timeLine">
                  <div className={styles.relPos}>{timeTH}</div>
                </th>
              </tr>
            </thead>
            <Animate
              transitionName="fade"
              component='tbody'
              transitionEnterTimeout={500}
              transitionLeaveTimeout={1000}
            >
              {
                data.length > 0 ? tbodyCon :
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}><FormattedMessage {...formatMessages['noData']} /></td>
                  </tr>
              }
            </Animate>
          </table>
        </Spin>
        {isShowMore && <div className={styles.loadMore}><Button onClick={loadMore}><FormattedMessage {...formatMessages['showMore']} /></Button></div>}
      </div>
    )
  }
}
export default ListTimeTable
