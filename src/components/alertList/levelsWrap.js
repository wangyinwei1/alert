import React, { Component } from 'react'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'dva'

import LevelIcon from '../common/levelIcon/index.js'

import styles from './index.less'

const localeMessage = defineMessages({
  tab_list: {
    id: 'alertList.tabs.list',
    defaultMessage: '列表'
  },
  assign_ticket: {
    id: 'alertDetail.ticket.assgin',
    defaultMessage: '派发工单'
  },
  tab_time: {
    id: 'alertList.tabs.timeList',
    defaultMessage: '时间线'
  },
  tab_visual: {
    id: 'alertList.tabs.visual',
    defaultMessage: '可视化分析'
  },
  noAlert: {
    id: 'alertManage.noAlert',
    defaultMessage: '无告警'
  }
})

const LevelsWrap = function ({ alertListLevels }) {
  const { levels } = alertListLevels;
  // 转数字匹配等级，并作排序
  let levels_wapper = {};

  return (
    <ul className={styles.levelBar}>
      {
        levels.map((level, index) => (
          <li key={index}>
            <LevelIcon extraStyle={styles.extraStyle} iconType={level.severity} />
            <p>{`${window['_severity'][level.severity]}（${level.count}）`}</p>
          </li>
        ))

      }
    </ul>
  )
}

export default injectIntl(connect((state) => {
  return {
    alertListLevels: state.alertListLevels
  }
}) (LevelsWrap))