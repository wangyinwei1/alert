import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import AlertConfig from '../components/alertConfig'

function alertConfig(){
  return (
    <div>
      <AlertConfig />
    </div>
  )
}
alertConfig.propTypes = {
  
}
export default alertConfig
