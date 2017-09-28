import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import Resolve from '../../components/export/resolve'

function export_resolve(props){
  return (
      <Resolve {...props}/>
  )
}
export_resolve.propTypes = {
  
}
export default connect((state) => {
    return {
        alertExport: state.alertExport
    }
})(export_resolve)