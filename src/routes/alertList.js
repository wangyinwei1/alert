import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import AlertListManage from '../components/alertList'



function alertList(location,dispatch,alertList){
  // const { loading, pagination, dataSource } = alertList

  // const alertListProps = {
  //   dataSource,
  //   loading,
  //   pagination: pagination,
  //   onPageChange(page){
  //     dispatch(routeRedux.push({
  //       pathname: 'alertList',
  //       query:{
  //
  //       }
  //     }))
  //   }
  // }

  return (

    <div>
      <AlertListManage />
    </div>

  )
}
alertList.propTypes = {
  dispatch: PropTypes.func,
  location: PropTypes.object,
  alertList: PropTypes.object
}
export default connect(({alertList}) => ({alertList}))(alertList)
