import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col } from 'antd'
import { classnames } from '../../utils'
import { Link } from 'dva/router'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const alertConfig = (props) => {

    const yyjcClass = classnames(
        'icon',
        'iconfont',
        'icon-disanfangyingyongjicheng'
    )

    const glpzClass = classnames(
        'icon',
        'iconfont',
        'icon-gaojingguanlianpeizhi'
    )

    const dzpzClass = classnames(
        'icon',
        'iconfont',
        'icon-gaojingdongzuopeizhi'
    )

    const zxzbClass = classnames(
        'icon',
        'iconfont',
        'icon-zuoxizhibanpeizhi'
    )

    const tjwhClass = classnames(
        'icon',
        'iconfont',
        'icon-tingjiweihupeizhi'
    )

    const localeMessage = defineMessages({
        integrations: {
            id: 'alertConfig.integrations',
            defaultMessage: '第三方应用集成'
        },
        integrationsMessage: {
            id: 'alertConfig.integrations.message',
            defaultMessage: '接入第三方应用，如网络、服务器和应用监控工具、帮助台和客户支持、聊天协同等应用'
        },
        correlationConfiguration: {
            id: 'alertConfig.correlation',
            defaultMessage: '告警关联配置'
        },
        correlationMessage: {
            id: 'alertConfig.correlation.message',
            defaultMessage: '设置告警关联规则'
        },
        actionConfiguration: {
            id: 'alertConfig.action',
            defaultMessage: '告警动作配置'
        },
        actionMessage: {
            id: 'alertConfig.action.message',
            defaultMessage: '设置告警通知相关的配置,告警升级策略'
        },
    })

    return (
        <div className={styles.configHome}>
          <Link to={`/alertConfig/alertApplication`} >
            <div>
                <i className={classnames(yyjcClass, styles.configIcon)}></i>
                <p className={styles.title}><FormattedMessage {...localeMessage['integrations']} /></p>
                <p className={styles.message}><FormattedMessage {...localeMessage['integrationsMessage']} /></p>
            </div>
          </Link>
          <Link to={`/alertConfig/alertAssociationRules`} >
            <div>
                <i className={classnames(glpzClass, styles.configIcon)}></i>
                <p className={styles.title}><FormattedMessage {...localeMessage['correlationConfiguration']} /></p>
                <p className={styles.message}><FormattedMessage {...localeMessage['correlationMessage']} /></p>
            </div>
          </Link>
          <Link to={`/alertConfig/alertMotionManagement`} >
            <div>
                <i className={classnames(dzpzClass, styles.configIcon)}></i>
                <p className={styles.title}><FormattedMessage {...localeMessage['actionConfiguration']} /></p>
                <p className={styles.message}><FormattedMessage {...localeMessage['actionMessage']} /></p>
            </div>
          </Link>
        </div>
    )
          
        //   <Link to={`/alertConfig/alertApplication`} >
        //     <div>
        //         <i className={classnames(dzpzClass, styles.configIcon)}></i>
        //         <p className={styles.title}>告警动作配置</p>
        //         <p className={styles.message}>设置告警通知相关配置，告警升级策略</p>
        //     </div>
        //   </Link>
        //   <Link to={`/alertConfig/alertApplication`} >
        //     <div>
        //         <i className={classnames(zxzbClass, styles.configIcon)}></i>
        //         <p className={styles.title}>坐席值班配置</p>
        //         <p className={styles.message}>配置坐席值班表，以及告警分配规则</p>
        //     </div>
        //   </Link>
        //   <Link to={`/alertConfig/alertApplication`} >
        //     <div>
        //         <i className={classnames(tjwhClass, styles.configIcon)}></i>
        //         <p className={styles.title}>停机维护配置</p>
        //         <p className={styles.message}>设置停机时间，在维护时间内的所有上报的相关告警将被忽略</p>
        //     </div>
        //   </Link>
}

export default alertConfig
