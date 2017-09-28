import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import Close from '../../components/export/close'

function export_close(props){
  return (
      <Close {...props}/>
  )
}
export_close.propTypes = {
  
}
export default connect((state) => {
    return {
        alertExport: state.alertExport
    }
})(export_close)