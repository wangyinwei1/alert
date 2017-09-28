import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import Dispatch from '../../components/export/dispatch'

function export_dispatch(props){
  return (
      <Dispatch {...props}/>
  )
}
export_dispatch.propTypes = {

}
export default connect((state) => {
    return {
        alertExport: state.alertExport
    }
})(export_dispatch)