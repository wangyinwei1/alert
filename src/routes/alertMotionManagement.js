import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import AlertMotionManagement from '../components/alertMotionManagement'

function alertMotionManagement(props){
  return (
      <AlertMotionManagement/>
  )
}
alertMotionManagement.propTypes = {
  dispatch: PropTypes.func
}
export default alertMotionManagement;
