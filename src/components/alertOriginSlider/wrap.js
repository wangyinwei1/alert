import React, { Component } from 'react'
import { connect } from 'dva';
import AlertOriginSlider from '../common/alertOriginSlider/index'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const AlertOriginSliderWrap = ({ alertOrigin, intl, dispatch }) => {
  const alertOriginSliderProps = {
    intl,
    onClose: () => {
      dispatch({
        type: 'alertOrigin/toggleVisible',
        payload: {
          visible: false
        }
      })
    },
    onSearch: (searchParam) => {
      dispatch({
        type: 'alertOrigin/queryAlertOrigin',
        payload: {
          searchParam,
          pagination:{ pageNo:1 }
        }
      })
    },
    onPageChange: (pagination, filters, sorter) => {
      const pageIsObj = typeof pagination === 'object';
      dispatch({
        type: 'alertOrigin/changePage',
        payload: {
          pagination: {
            pageNo: pageIsObj ? pagination.current : pagination
          },
          sorter: {
            sortKey: sorter ? sorter.field : undefined,
            sortType: sorter ? (sorter.order == "descend" ? 0 : 1) : undefined
          }
        }
      })
    },
    visible: alertOrigin.visible,
    loading: alertOrigin.loading,
    alertOrigin
  }

  return (
    <AlertOriginSlider { ...alertOriginSliderProps }/>
  )
}

export default injectIntl(connect((state) => {
  return {
    alertOrigin: state.alertOrigin
  }
})(AlertOriginSliderWrap))
