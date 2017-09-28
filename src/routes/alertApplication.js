import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import AlertApplication from '../components/alertApplication'

function alertApplication(dispatch){
  return (
      <AlertApplication />
  )
}
alertApplication.propTypes = {
  dispatch: PropTypes.func
}
export default connect(({alertConfig}) => ({alertConfig}))(alertApplication)
