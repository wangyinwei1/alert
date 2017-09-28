import React, { PropTypes, Component } from 'react'
import { Button, Spin, Popover, Checkbox } from 'antd';
import LevelIcon from '../levelIcon/index.js'
import Animate from 'rc-animate'
import styles from './index.less'
import { classnames, groupSort } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import $ from 'jquery'
import WrapableTr from './wrapableTr'
import TopFixedArea from './topFixedArea'
import ScrollBar from './scrollBar'
import Theads from './theads.js'

class Table extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {

  }

  componentDidUpdate(oldProps) {

  }

  componentWillUnMount() {

  }

  render() {
    const tempDate = new Date();
    const {
      sourceOrigin,
      isGroup,
      groupBy,
      groupMap,
      toggleGroupSpread,
      data=[],
      columns,
      checkAlertFunc,
      checkAlert = {},
      detailClick,
      spreadChild,
      noSpreadChild,
      spreadGroup,
      noSpreadGroup,
      selectedAll,
      handleSelectAll,
      relieveClick,
      orderFlowNumClick,
      showAlertOrigin,
      isLoading,
      orderUp,
      orderDown,
      orderBy,
      orderType,
      orderByTittle,
      isNeedCheckOwner,
      userInfo = {},
      begin = 0,
      end = 0,
      intl: { formatMessage },
    } = this.props
    let colsKey = columns.map((item) => item['key'])
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
      },
      description: {
        id: 'alertList.title.description',
        defaultMessage: '告警描述',
      },
      occurTime: {
        id: 'alertList.title.occurTime',
        defaultMessage: '发生时间',
      },
      severity: {
        id: 'alertList.title.severity',
        defaultMessage: '告警级别',
      },
      source: {
        id: 'alertList.title.source',
        defaultMessage: '告警来源',
      },
      description: {
        id: 'alertList.title.description',
        defaultMessage: '告警描述',
      },
    })


    let tbodyCon = [];
    let fixedTbodyCon = [];
    const formatDate = function (time) {
      const d = new Date(time);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let date = d.getDate();
      let hours = d.getHours();
      let mins = d.getMinutes();

      hours = hours < 10 ? '0' + hours : hours
      mins = mins < 10 ? '0' + mins : mins


      return year + '/' + month + '/' + date + ' ' + hours + ':' + mins
    }

    //  生成时间线
    const genDots = ({ item, begin, end }) => {
      let dots = null
      let dotsLine = []
      let lineDotLeft = 0
      let lineDotW = 0

      const gridWidth = 1 / 10
      const countMins = (end - begin) / (60 * 1000)
      const minuteToWidth = 100 / countMins

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
              <span style={{ left: left + '%' }} className={styles[iconColor]} data-id={itemDot.id} onClick={detailClick}></span>
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

    // 生成每一列的参数
    // 生成一行
    const getTds = (item, keys, target = 'parent', classify) => {
      let tds = [];
      const relieveIcon = classnames(
        'iconfont',
        'icon-zaixian',
        styles.relieveIcon
      )
      keys.forEach((key, index) => {
        let data = item[key];
        let td;
        if (sourceOrigin !== 'alertQuery' && (target === 'parent') && index == 0) {
          tds.push(
            <td key='sourceAlert' style={{cursor: 'pointer'}} data-no-need-wrap={true} data-id={item.id} className={styles.moreLittle} onClick={(e) => {
                if(item['hasChild'] === true && item['isSpread'] === true) {
                  noSpreadChild(e);
                } else if(item['hasChild'] === true && item['isSpread'] !== true) {
                  spreadChild(e);
                }
              }
            }>
              {
                item['hasChild'] === true
                  ? item['isSpread'] === true
                    ? <span data-no-need-wrap={true} className={styles.triangleUp} data-id={item.id}></span>
                    : <span data-no-need-wrap={true} className={styles.triangleDown} data-id={item.id}></span>
                  : undefined
              }
            </td>
          )
        }
        switch (key) {
          case 'name':
            td = (<td key={key} title={data} className={styles.tdBtn} data-id={item.id} data-no-need-wrap={true} onClick={detailClick} >
              <div className={styles.nameContainer}>
                <div className={styles.relieveDiv}>
                <span data-no-need-wrap={true} onClick={detailClick} data-id={item.id}>{data && data != ''?data:formatMessage({...formatMessages['Unknown']})}</span>
                </div>
                <div className={styles.relieveIconDiv}>
                {
                  sourceOrigin !== 'alertQuery' && item['hasChild'] === true && target === 'parent' ?
                      <span className={relieveIcon} data-id={classify ? JSON.stringify({ classify: classify, id: item.id }) : JSON.stringify({ id: item.id })} onClick={relieveClick}></span>
                    :
                    undefined
                }
                </div>
              </div>
            </td>)
            break;
          case 'orderFlowNum':
            if (typeof item['itsmDetailUrl'] != 'undefined') {
              td = <td key={key} title={data} style={{ width: item.isFixed ? '150px' : undefined }}><a target='_blank' href={item['itsmDetailUrl']}>{data}</a></td>
            } else {
              td = <td key={key} title={data} style={{ width: item.isFixed ? '150px' : undefined }}><a href='javascript:;' onClick={orderFlowNumClick} data-flow-num={data} data-id={item['id']}>{data}</a></td>
            }
            break;
          case 'owner':
            const ownerName = item['ownerName'];
            td = <td key={key} title={ownerName} style={{ width: item.isFixed ? '150px' : undefined }}>{ownerName}</td>
            break;
          case 'notifyList':
            if (item['isNotify'] && data && data.length > 0) {
              let temp = data.map((key) => {
                return window.__alert_appLocaleData.messages[`alertList.notifyList.${key}`]
              })
              data = temp.join(' / ')
            }
            td = <td key={key} style={{ width: item.isFixed ? '150px' : undefined }}>{data}</td>
            break;
          case 'firstOccurTime':
            td = <td key={key} style={{ width: item.isFixed ? '150px' : undefined }}>{formatDate(new Date(data))}</td>
            break;
          case 'lastOccurTime':
            td = <td key={key} style={{ width: item.isFixed ? '150px' : undefined }}>{formatDate(new Date(data))}</td>
            break;
          case 'lastTime':
            // 如果小于1小时 显示分钟
            let hours = 60 * 60 * 1000
            if (data < hours) {
              td = <td key={key} style={{ width: item.isFixed ? '150px' : undefined }}>{`${+(data / (60 * 1000)).toFixed(1)}m`}</td>
            } else {
              td = <td key={key} style={{ width: item.isFixed ? '150px' : undefined }}>{`${+(data / hours).toFixed(1)}h`}</td>
            }
            break;
          case 'status':
            td = <td key={key} style={{ width: item.isFixed ? '150px' : undefined }}>{window['_status'][Number(data)] || data}</td>
            break;
          case 'tags':
            if (data && data.length > 0) {
              td = <td key={key} className={styles.tagsKey} style={{ width: item.isFixed ? '200px' : undefined }}>
                {/*<Popover placement='top' overlayClassName={styles.popover} trigger="hover" mouseEnterDelay={0.5} content={
                        <div>
                          {data.map( (item, index) => { return <p key={item.key}>{`${item.keyName}${item.value ? ` : ${item.value}` : undefined}`}</p>})}
                        </div>
                      } >*/}
                {
                  data.map(tag => {
                    const { key, keyName, value } = tag;
                    if (key == 'severity' || key == 'status') {
                      return <span key={JSON.stringify({ key, value })} className={styles.tag}>{`${keyName} : ` + window[`_${key}`][value]}</span>
                    } else if (value == '') {
                      return <span key={JSON.stringify({ key, value })} className={styles.tag}>{keyName}</span>
                    } else {
                      return <span key={JSON.stringify({ key, value })} className={styles.tag}>{`${keyName} : ${value}`}</span>
                    }
                  })
                }
                {/*</Popover>*/}
              </td>
            } else {
              td = <td key={key} style={{ width: item.isFixed ? '150px' : undefined }}>{data}</td>
            }
            break;
          case 'count':
            td = <td key={key} title={data} style={{ width: item.isFixed ? '150px' : undefined }}><a href="javascript:;" data-id={item.id} data-no-need-wrap={true} data-name={item.name} onClick={showAlertOrigin}>{data}</a></td>
            break;
          case 'suppressionFlag':
            td = <td key={key} title={data} style={{ width: item.isFixed ? '150px' : undefined }}>{data ? <FormattedMessage { ...(formatMessages['suppressionYesFlag']) } /> : ''}</td>
            break;
          default:
            td = <td key={key} title={data} style={{ width: item.isFixed ? '150px' : undefined }}>{data}</td>
            break;
        }
        tds.push(td)
      })
      if (begin && end) {
        const dotsInfo = genDots({ item: item.timeLine, begin, end })
        const dots = dotsInfo.dots
        const lineDotW = dotsInfo.lineDotW
        const lineDotLeft = dotsInfo.lineDotLeft
        const td = (
          <td key="timeDot">
            <div className={styles.timeLineDot}>
              <div className={styles.lineDot} style={{ width: lineDotW + '%', left: lineDotLeft + '%' }}></div>
              {dots}
            </div>
          </td>
        )
        tds.push(td)
      }

      if (target === 'parent') {
        tds.unshift(<td className={sourceOrigin !== 'alertQuery' ? styles.moreLittle : styles.little} style={{ width: item.isFixed ? '20px' : undefined }} width="20" key='icon-col-td' colSpan={sourceOrigin !== 'alertQuery' ? '1' : '2'} ><LevelIcon extraStyle={sourceOrigin === 'alertQuery' && styles.alertQueryIcon} iconType={item['severity']} /></td>)
      } else if (target === 'child') {
        let leftTdCols = sourceOrigin == 'alertQuery' ? 1 : 2;
        // if (isGroup) {
        //   tds.unshift(<td className={styles.moreLittle} width="20" style={{ width: item.isFixed ? '25px' : undefined }} key='icon-col-td'><LevelIcon iconType={item['severity']} /></td>)
        //   if (sourceOrigin == 'alertQuery') {
        //     tds.unshift(<td className={styles.moreLittle} style={{ width: item.isFixed ? '25px' : undefined }} colSpan={leftTdCols} key='space-col-td'></td>)
        //   }
        // } else {
          tds.unshift(<td className={styles.moreLittle} width="20" style={{ width: item.isFixed ? '25px' : undefined }} key='icon-col-td'><LevelIcon iconType={item['severity']} /></td>)
          tds.unshift(<td className={styles.moreLittle} style={{ width: item.isFixed ? '25px' : undefined }} colSpan={leftTdCols} key='space-col-td'></td>)
        // }
      } else {
        let leftTdCols = sourceOrigin == 'alertQuery' ? 1 : 2;
        tds.unshift(<td className={styles.moreLittle} width="20" style={{ width: item.isFixed ? '25px' : undefined }} key='icon-col-td'><LevelIcon iconType={item['severity']} /></td>)
        tds.unshift(<td className={styles.moreLittle} style={{ width: item.isFixed ? '25px' : undefined }} colSpan={leftTdCols} key='space-col-td'></td>)
      }
      return tds
    }

    // 生成子告警行
    const getchildTrs = (childItem, childIndex, keys, item, isGroup, isParentAlert = true) => {

      const trKey = childItem.id + '_' + childIndex
      const childTds = getTds(childItem, keys, isParentAlert ? 'child' : 'childInChild')

      return (
        <WrapableTr contentData={{ ...childItem }} columnsLength={columns.length} isSuppressed={childItem.suppressionFlag} isRemoved={childItem.isRemoved} trId={trKey} key={trKey} className={!item.isSpread ? styles.hiddenChild : !isGroup ? styles.noSpread : styles.groupSpread}>
          {childTds}
        </WrapableTr>
      )
    }

    if (isGroup) {
      groupSort()(data, groupBy).forEach((item, index) => {
        const keys = colsKey
        let childtrs = []
        if (item.isRemoved) {
          return;
        }
        if(typeof item.isGroupSpread == 'boolean') {
          console.log(item.isGroupSpread, item.isGroupSpread === false);
        }

        let groupTitle = ((groupMap[index] === false) ?
          (<WrapableTr noNeedWrap={true} contentData={{ groupBy, classify: item.classify }} columnsLength={columns.length} isSuppressed={item.suppressionFlag} isRemoved={item.isRemoved} className={classnames(styles.trGroup, 'noGroupSpread')} key={index}>
            <td colSpan={keys.length + 3} data-no-need-wrap={true}>
              <span className={styles.expandIcon} data-classify={item.classify} data-groupIndex={ index }  onClick={toggleGroupSpread}>+</span>
              {
                groupBy && groupBy == 'status' ?
                  window['_status'][item.classify]
                  :
                  groupBy && groupBy == 'severity' ?
                    window['_severity'][item.classify]
                    :
                    item.classify ? item.classify : <FormattedMessage {...formatMessages['Unknown']} />
              }
            </td>
          </WrapableTr>)
          :
          (<WrapableTr noNeedWrap={true} contentData={{ groupBy, classify: item.classify }} columnsLength={columns.length} isSuppressed={item.suppressionFlag} isRemoved={item.isRemoved} className={styles.trGroup} key={index}>
            <td colSpan={keys.length + 3}>
              <span className={styles.expandIcon} data-classify={item.classify} data-groupIndex={ index } onClick={toggleGroupSpread}>-</span>
              {
                groupBy && groupBy == 'status' ?
                  window['_status'][item.classify]
                  :
                  groupBy && groupBy == 'severity' ?
                    window['_severity'][item.classify]
                    :
                    item.classify ? item.classify : <FormattedMessage {...formatMessages['Unknown']} />
              }
            </td>
          </WrapableTr>)
        )

        item.children !== undefined && item.children.forEach((childItem, itemIndex) => {

          const tds = getTds(childItem, keys, 'parent', item.classify)

          // 如果有子告警
          let childs = []
          if (sourceOrigin !== 'alertQuery' && childItem.childrenAlert && item.isGroupSpread !== false && !childItem.isRemoved) {

            childs = childItem.childrenAlert.map((childAlertItem, childIndex) => {
              if (!childAlertItem.isRemoved) {
                return getchildTrs(childAlertItem, itemIndex + "_" + childIndex, keys, childItem, isGroup, false)
              } else {
                return undefined;
              }

            })
          } else {
            childs = []
          }
          const trKey = `tr_${index}_${itemIndex}`
          const tdKey = `td_${index}_${itemIndex}`
          if (!childItem.isRemoved && groupMap[index] !== false) {
            childtrs.push(
              <WrapableTr contentData={{ ...childItem, checked: checkAlert[childItem.id] && checkAlert[childItem.id].checked }} columnsLength={columns.length} isSuppressed={childItem.suppressionFlag} isRemoved={childItem.isRemoved} trId={trKey} key={trKey} className={item.isGroupSpread !== undefined && !item.isGroupSpread ? styles.hiddenChild : styles.groupSpread}>
                {
                  //<input type="checkbox" checked={checkAlert[childItem.id].checked} data-id={childItem.id} data-all={JSON.stringify(childItem)} onClick={checkAlertFunc} />
                  sourceOrigin !== 'alertQuery' ?
                    <td key={tdKey} className={classnames(styles.checkstyle, styles.little)}><Checkbox checked={checkAlert[childItem.id] && checkAlert[childItem.id].checked} data-id={childItem.id} data-no-need-wrap={true} onClick={checkAlertFunc} /></td>
                    :
                    undefined
                }
                {tds}
              </WrapableTr>
            )
          }
          childtrs.push(childs.filter((child) => child))
        })
        childtrs.unshift(groupTitle)
        tbodyCon.push(childtrs)

      })

    } else {

      data.length > 0 && data.children === undefined && data.forEach((item, index) => {

        if (item.isRemoved) {
          return;
        }

        const keys = colsKey
        const tds = getTds(item, keys)
        let commonTrs = []

        // 如果有子告警
        let childs = []
        if (sourceOrigin !== 'alertQuery' && item.childrenAlert) {

          childs = item.childrenAlert.map((childItem, childIndex) => {

            if (!childItem.isRemoved) {
              return getchildTrs(childItem, index + "_" + childIndex, keys, item, isGroup)
            } else {
              return undefined;
            }
          })
        } else {
          childs = []
        }

        commonTrs.push(
          <WrapableTr contentData={{ ...item, checked: checkAlert[item.id] && checkAlert[item.id].checked }} columnsLength={columns.length} isSuppressed={item.suppressionFlag} isRemoved={item.isRemoved} trId={item.id + "_" + index} key={item.id + "_" + index} className={classnames(styles.noSpread)}>
            {
              //<input type="checkbox" checked={checkAlert[item.id].checked} data-id={item.id} data-all={JSON.stringify(item)} onClick={checkAlertFunc} />
              sourceOrigin !== 'alertQuery' && Object.keys(checkAlert).length !== 0 ?
                <td className={classnames(styles.checkstyle, styles.little)} style={{ width: item.isFixed ? '50px' : undefined }}>
                  <Checkbox checked={checkAlert[item.id] && checkAlert[item.id].checked} data-id={item.id} data-no-need-wrap={true} onClick={checkAlertFunc} disabled={isNeedCheckOwner && userInfo.userId ? !(userInfo.userId == item.owner) : undefined} />
                </td>
                :
                undefined
            }
            {tds}
          </WrapableTr>
        )

        tbodyCon.push(commonTrs, childs)
      })

    }

    // const loadingIcon = classnames({})

    return (
      <table className={styles.listTable}>
        <Theads columns={columns}
          sourceOrigin={sourceOrigin}
          isGroup={isGroup}
          columns={columns}
          selectedAll={selectedAll}
          handleSelectAll={handleSelectAll}
          orderUp={orderUp}
          orderDown={orderDown}
          orderBy={orderBy}
          orderType={orderType}
          orderByTittle={orderByTittle}
          begin={begin}
          end={end}
        />
        <Animate
          transitionName="fade"
          component='tbody'
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {
            data.length > 0 ?
              tbodyCon
              :
              <WrapableTr columnsLength={columns.length}>
                <td colSpan={columns.length + 3} style={{ textAlign: 'center' }}>{this.props.isShowNoDataTip ? <FormattedMessage {...formatMessages['noData']} /> : undefined}</td>
              </WrapableTr>
          }
        </Animate>
      </table >
    )
  }
}

Table.defaultProps = {
  target: 'div#topMain', // 用于设置参考对象
  isShowNoDataTip: true, // 是否显示“无数据”状态的提示
  checkAlertFunc: () => { },
  spreadChild: () => { },
  noSpreadChild: () => { },
  handleSelectAll: () => { },
  relieveClick: () => { },
  orderFlowNumClick: () => { }
}

Table.propTypes = {
  sourceOrigin: PropTypes.string.isRequired
}

export default injectIntl(Table)
