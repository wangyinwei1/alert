import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'
import { Link } from 'dva/router'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const appSelectModal = ({alertConfig, dispatch}) => {

    const { isShowTypeModal, applicationTypeData } = alertConfig;

    const closeTypeModal = () => {
        dispatch({
            type: 'alertConfig/toggleTypeModal',
            payload: false
        })
    }

    const lis = applicationTypeData.map( (appGroup, index) => {
        const appDetail = appGroup.children.map( (app, index) => {
            return (
                <Link to={`alertConfig/alertApplication/applicationView/add/${app.uniqueCode}`} key={index}>
                    <span key={index} className={styles.appItem}>{app.name}</span>
                </Link>
            )
        })
        return (
            <li key={index}>
                <p className={styles.appTitle}>{appGroup.appType}</p>
                {appDetail}
            </li>
        )
    })

    const localeMessage = defineMessages({
        newApplication: {
            id: 'alertApplication.newApplication',
            defaultMessage: '添加应用'
        },
        applicationMessage: {
            id: 'alertApplication.modal.message',
            defaultMessage: '请选择一款应用'
        },
    })

    return (
        <Modal
          title={<FormattedMessage {...localeMessage['newApplication']} />}
          maskClosable="true"
          onCancel={ closeTypeModal }
          visible={ isShowTypeModal }
          footer={ null }
          width={650}
        >
            <div className={styles.appModalMain}>
                <p><FormattedMessage {...localeMessage['applicationMessage']} /></p>
                <ul>
                    {lis}
                </ul>
            </div>
        </Modal>
    )
}

appSelectModal.defaultProps = {

}

appSelectModal.propTypes = {

}

export default connect( state => {
    return {
        alertConfig: state.alertConfig,
    }
})(appSelectModal);