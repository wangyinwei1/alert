import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import AlertAssociationRules from '../components/alertAssociationRules'

function alertAssociationRules(props){
  return (
    <AlertAssociationRules {...props}/>
  )
}
alertAssociationRules.propTypes = {
  dispatch: PropTypes.func
}
export default connect(({alertAssociationRules}) => ({alertAssociationRules}))(alertAssociationRules)
