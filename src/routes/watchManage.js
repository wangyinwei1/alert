import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'

function watchManage(dispatch){
  return (
    <div></div>
  )
}
watchManage.propTypes = {
  dispatch: PropTypes.func
}
export default connect()(watchManage)
