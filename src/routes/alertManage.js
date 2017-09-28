import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import Chart from '../components/alertManage/alertDashbord'
import AlertSet from '../components/alertManage/alertSet'
import AlertManageHead from '../components/alertManage/alertManageHead'
import AlertTagsSet from '../components/alertManage/alertTagsSet'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';


function AlertManage({ location }){

  return (
    <div>
      <AlertTagsSet  />
      <AlertManageHead />
      <Chart location={location} />
    </div>
  )
}

// function mapStateToProps ({ alertManage }) {
//   return { alertManage }
// }
export default AlertManage
