import React, { PropTypes, Component } from 'react'
import { Button, Popover, Select, Checkbox } from 'antd';
import { connect } from 'dva'
import ListTable from '../common/listTable'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import styles from './index.less'
import { classnames } from '../../utils/'

const Option = Select.Option;
// function ListTimeTableWrap({dispatch, alertListTimeTable}){
const ListTableWrap = ({ dispatch, alertQuery, topHeight, intl: { formatMessage } }) => {
  const { haveQuery, queryCount, selectGroup, extendColumnList, extendTagsKey, columnList, isShowBar } = alertQuery

  const setClass = classnames(
    'icon',
    'iconfont',
    'icon-bushu'
  )

  const switchClass = classnames(
    'icon',
    'iconfont',
    'icon-anonymous-iconfont'
  )

  const zhankaiClass = classnames(
    'iconfont',
    'icon-xialasanjiao'
  )

  const shouqiClass = classnames(
    'iconfont',
    'icon-xialasanjiao-copy'
  )

  const toggleBarButtonClick = (e) => {
    const isShowAlertBar = !isShowBar;
    dispatch({
      type: 'alertQuery/toggleBar',
      payload: isShowAlertBar,
    })
  }

  const localeMessage = defineMessages({
    owner: {
      id: 'alertDetail.owner',
      defaultMessage: '负责人'
    },
    occurTime: {
      id: 'alertList.title.occurTime',
      defaultMessage: '发生时间',
    },
    severity: {
      id: 'alertList.title.severity',
      defaultMessage: '告警级别',
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
      id: 'alertQuery.label.lastOccurTime',
      defaultMessage: '最后发生时间',
    },
    firstOccurTime: {
      id: 'alertQuery.label.firstOccurTime',
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
    basic: {
      id: 'alertList.title.basic',
      defaultMessage: '常规',
    },
    additional: {
      id: 'alertList.title.additional',
      defaultMessage: '扩展',
    },
    suppressionFlag: {
      id: 'alertList.title.suppressionFlag',
      defaultMessage: '是否被抑制'
    },
    columns: {
      id: 'alertOperate.columns',
      defaultMessage: '列定制',
    },
    groupBy: {
      id: 'alertOperate.groupBy',
      defaultMessage: '分组显示',
    },
    groupByEnityName: {
      id: 'alertOperate.groupByEnityName',
      defaultMessage: '按对象分组',
    },
    groupBySource: {
      id: 'alertOperate.groupBySource',
      defaultMessage: '按来源分组',
    },
    groupByStatus: {
      id: 'alertOperate.groupByStatus',
      defaultMessage: '按状态分组',
    },
    groupBySeverity: {
      id: 'alertOperate.groupBySeverity',
      defaultMessage: '按级别分组',
    },
    groupByIPAddress: {
      id: 'alertOperate.groupByIPAddress',
      defaultMessage: '按IP地址分组'
    },
    groupByOther: {
      id: 'alertOperate.groupByOther',
      defaultMessage: '按{other}分组',
    },
    noQueryData: {
      id: 'alertQuery.noQueryData',
      defaultMessage: '暂无数据，请先选择查询条件',
    },
    result: {
      id: 'alertQuery.result',
      defaultMessage: "共{total}个结果（紧急{critical}个，警告{warning}个，提醒{information}个，正常{ok}个）",
    },
  })
  const props = {
    ...alertQuery,
    loadMore() {
      dispatch({
        type: 'alertQuery/loadMore'
      })
    },

    detailClick(e) {
      const alertId = e.target.getAttribute('data-id');

      dispatch({
        type: 'alertDetail/openDetailModal',
        payload: {
          alertId
        }
      })
    },
    // 分组展开
    spreadGroup(e) {
      const groupClassify = e.target.getAttribute('data-classify')

      dispatch({
        type: 'alertQuery/spreadGroup',
        payload: groupClassify
      })
    },
    noSpreadGroup(e) {
      const groupClassify = e.target.getAttribute('data-classify')

      dispatch({
        type: 'alertQuery/noSpreadGroup',
        payload: groupClassify
      })
    },
    // 升序
    orderUp(e) {
      const orderKey = e.target.getAttribute('data-key');

      dispatch({
        type: 'alertQuery/orderList',
        payload: {
          orderBy: orderKey,
          orderType: 1
        }
      })
    },
    // 降序
    orderDown(e) {
      const orderKey = e.target.getAttribute('data-key');

      dispatch({
        type: 'alertQuery/orderList',
        payload: {
          orderBy: orderKey,
          orderType: 0
        }
      })
    },
    orderByTittle(e) {
      const orderKey = e.target.getAttribute('data-key');

      dispatch({
        type: 'alertQuery/orderByTittle',
        payload: orderKey
      })
    },
    orderFlowNumClick(e) {
      const orderFlowNum = e.target.getAttribute('data-flow-num');
      const id = e.target.getAttribute('data-id');
      dispatch({
        type: 'alertQuery/orderFlowNumClick',
        payload: { orderFlowNum, id }
      })
    },
    showAlertOrigin(e) {
      const alertId = e.target.getAttribute('data-id');
      const alertName = e.target.getAttribute('data-name');
      dispatch({
        type: 'alertOrigin/toggleVisible',
        payload: {
          visible: true,
          alertName
        }
      })

      dispatch({
        type: 'alertOrigin/initPage'
      })

      dispatch({
        type: 'alertOrigin/queryAlertOrigin',
        payload: {
          alertId,
          alertName
        }
      })
    }
  }

  const popoverContent = <div className={styles.popoverMain}>
    {
      columnList.map((group, index) => {
        return (
          <div key={index} className={styles.colGroup}>
            <p>{group.type == 0 ? <FormattedMessage {...localeMessage['basic']} /> : <FormattedMessage {...localeMessage['additional']} />}</p>
            {
              group.cols.map((item, index) => {
                if (item.id === 'entityName' || item.id === 'name') {
                  return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={true} disabled={true} >
                    {item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}
                  </Checkbox></div>
                } else {
                  return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={item.checked} onChange={(e) => {
                    dispatch({
                      type: 'alertQuery/checkColumn',
                      payload: e.target.value,
                    })
                  }}>{item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}</Checkbox></div>
                }
              })
            }
          </div>
        )
      })
    }
  </div>

  const topFixArea = (
    <div className={styles.queryOperate} data-fix-key="queryOperate">
      <div className={styles.count}>
        <FormattedMessage {...localeMessage['result']}
          values={{
            total: queryCount.total !== undefined ? '' + queryCount.total : '0',
            critical: queryCount.critical !== undefined ? '' + queryCount.critical : '0',
            warning: queryCount.warning !== undefined ? '' + queryCount.warning : '0',
            information: queryCount.information !== undefined ? '' + queryCount.information : '0',
            ok: queryCount.ok !== undefined ? '' + queryCount.ok : '0'
          }}
        />

      </div>
      <div className={styles.groupMain}>
        <Select getPopupContainer={() => document.getElementById("content")} className={classnames(styles.setGroup, styles.selectSingle)} placeholder={formatMessage({ ...localeMessage['groupBy'] })} value={selectGroup} onChange={(value) => {
          dispatch({
            type: 'alertQuery/groupView',
            payload: value,
          })
        }}>
          <Option key={'severity'} className={styles.menuItem} value="severity"><FormattedMessage {...localeMessage['groupBySeverity']} /></Option>
          <Option key={'entityName'} className={styles.menuItem} value="entityName"><FormattedMessage {...localeMessage['groupByEnityName']} /></Option>
          <Option key={'source'} className={styles.menuItem} value="source"><FormattedMessage {...localeMessage['groupBySource']} /></Option>
          <Option key={'status'} className={styles.menuItem} value="status"><FormattedMessage {...localeMessage['groupByStatus']} /></Option>
          <Option key={'IPAddress'} className={styles.menuItem} value="entityAddr"><FormattedMessage {...localeMessage['groupByIPAddress']} /></Option>
          {
            extendColumnList && extendColumnList.length !== 0 ? extendColumnList.map((col, index) => {
              return <Option key={col.id} className={styles.menuItem} value={col.id}><FormattedMessage {...localeMessage['groupByOther']} values={{ other: col.name }} /></Option>
            }) : []
          }
          {
            extendTagsKey && extendTagsKey.length > 0 ? extendTagsKey.map((tag, index) => {
              return <Option key={tag} className={styles.menuItem} value={tag}><FormattedMessage {...localeMessage['groupByOther']} values={{ other: tag }} /></Option>
            }) : []
          }
        </Select>
        <i className={selectGroup !== undefined && classnames(switchClass, styles.switch)} onClick={() => {
          dispatch({
            type: 'alertQuery/noGroupView',
          })
        }}></i>
      </div>
      <Popover placement='bottomRight' overlayClassName={styles.popover} content={popoverContent} >
        <div className={classnames(styles.button, styles.rightBtn)}>
          <i className={classnames(setClass, styles.setCol)}></i>
          <p className={styles.col}><FormattedMessage {...localeMessage['columns']} /></p>
        </div>
      </Popover>
    </div>
  )


  return (
    <div>
      <Button className={classnames(styles.toggleBarButton, zhankaiClass)} onClick={toggleBarButtonClick} size="small"><i className={classnames(isShowBar ? shouqiClass : zhankaiClass, styles.toggleBarButtonIcon)} /></Button>
      <div className={styles.wrapBorder}>
        {
          !haveQuery ?
            <div className={styles.alertListInfo}><FormattedMessage {...localeMessage['noQueryData']} /></div>
            :
            <div>
              {topFixArea}
              <ListTable extraArea={topFixArea} extraAreaKey="queryOperate" topHeight={isShowBar ? 285 : 95} sourceOrigin='alertQuery' {...props} />
            </div>
        }
      </div>
    </div>
  )
}
export default injectIntl(connect(
  (state) => {
    return {
      alertQuery: state.alertQuery
    }
  }
)(ListTableWrap));
