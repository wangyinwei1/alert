import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import AlertDetailWrap from '../../components/alertDetail/wrap.js'

function ViewDetail(props){
  return (
      <AlertDetailWrap {...props}/>
  )
}
ViewDetail.propTypes = {
  
}
export default ViewDetail