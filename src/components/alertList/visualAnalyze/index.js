import React, { PropTypes, Component } from 'react'
import { Button, Popover } from 'antd';
import { connect } from 'dva'
import VisualAnalyze from './visualAnalyze'
import styles from '../index.less'
import $ from 'jquery'

const VisualAnalyzeWrap = ({ dispatch, visualAnalyze }) => {

  const props = {
    ...visualAnalyze,

    showResList(e) {
      const target = e.target
      if (target.className.indexOf('tagsGroup') > -1) return
      const parentNode = target.parentNode,
        gr2Val = parentNode.getAttribute('data-gr2Val'),
        gr3Val = parentNode.getAttribute('data-gr3Val')

      localStorage.setItem('__alert_visualAnalyze_gr2Val', gr2Val)
      localStorage.setItem('__alert_visualAnalyze_gr3Val', gr3Val)
      const $_parentNode = $(parentNode),
        offset = $_parentNode.offset(),
        left = offset.left,
        width = $_parentNode.width() / 2,
        top = offset.top

      const cloneNode = $('<div/>')
      cloneNode.addClass('tagsGroupAnimation').css({
        left: left + width,
        top: top
      }).appendTo('body')
      const targetEle = visualAnalyze.tags.length === 2 ? $('#visualGr1') : $('#visualGr2'), // hack 三个标签也要动画
        targetLeft = targetEle.offset().left,
        targetTop = targetEle.offset().top

      cloneNode.animate({
        left: targetLeft + 90,
        top: targetTop
      }, 300, () => {
        cloneNode.remove()
        dispatch({
          type: 'visualAnalyze/queryVisualRes'
        })
        dispatch({
          type: 'visualAnalyze/queryResInfo',
          payload: {
            res: parentNode.getAttribute('data-gr3Val')
          }
        })
      })


    },
    detailClick(e) {
      const alertId = e.target.getAttribute('data-id')
      dispatch({
        type: 'alertDetail/openDetailModal',
        payload: {
          alertId
        }
      })
    },
    showAlertList(e) {
      // 首先初始数据
      dispatch({
        type: 'visualAnalyze/updateAlertList',
        payload: ''
      })
      let target = e.target
      while (target.tagName.toLowerCase() != 'li') {
        target = target.parentNode
      }
      if(window.__uyun_showAlertList) {
        clearTimeout(window.__uyun_showAlertList);
      }
      window.__uyun_showAlertList = setTimeout(() => {
        dispatch({
          type: 'visualAnalyze/showAlertList',
          payload: target.getAttribute('data-id')
        })
      }, 300)

    },
    cancelShowAlertList() {
      clearTimeout(window.__uyun_showAlertList)

    },
    handleExpand(e) {
      const target = e.target,
        isExpand = target.getAttribute('data-expand') == 'true' ? false : true,
        index = target.getAttribute('data-index')

      dispatch({
        type: 'visualAnalyze/expandList',
        payload: {
          index,
          isExpand
        }
      })
    },
    redirectTagsList() {
      // localStorage.removeItem('__alert_visualAnalyze_gr4')
      dispatch({
        type: 'visualAnalyze/redirectTagsList'
      })
    },
    gr2Change(value) {
      // 这是个hack,为了后端减少更改，当lessLeavl为2时，即tags === 2时 更改gr2时,和gr3相互置反
      if (visualAnalyze.tags && visualAnalyze.tags.length === 2) {
        localStorage.setItem('__alert_visualAnalyze_gr2', value)
        localStorage.setItem('__alert_visualAnalyze_gr3', visualAnalyze.tags.filter(tag => tag != value).join())
      }
      localStorage.setItem('__alert_visualAnalyze_gr2', value)
      dispatch({
        type: 'visualAnalyze/queryVisualList',
        payload: {
          isFirst: false
        }
      })
    },
    gr3Change(value) {
      localStorage.setItem('__alert_visualAnalyze_gr3', value)
      dispatch({
        type: 'visualAnalyze/queryVisualList',
        payload: {
          isFirst: false
        }
      })
    },
    gr4Change(value) {
      localStorage.setItem('__alert_visualAnalyze_gr4', value)
      dispatch({
        type: 'visualAnalyze/queryVisualRes'
      })
    },

    showIncidentGroup(e) {
      const checked = e.target.checked
      dispatch({
        type: 'visualAnalyze/queryVisualList',
        payload: {
          isFirst: false,
          showIncidentGroup: checked
        }
      })
      dispatch({
        type: 'visualAnalyze/updateIncidentGroup',
        payload: checked
      })


    },
    addNums(e, params) {
      e.stopPropagation();
      dispatch({
        type: 'visualAnalyze/addNums',
        payload: {
          ...params
        }
      })
    }


  }

  return (
    <VisualAnalyze {...props} />
  )
}
export default connect(
  (state) => {
    return {
      visualAnalyze: state.visualAnalyze,
    }
  }
)(VisualAnalyzeWrap)
