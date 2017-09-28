import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Tabs, Button } from 'antd'
import { classnames } from '../../utils'
import { Link } from 'dva/router'
import ApplicationList from '../common/configList'
import AppSelectModal from './appSelectModal'
import AppDeleteModal from './appDeleteModal'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const TabPane = Tabs.TabPane;
const alertApplication = ({dispatch, alertConfig, intl: {formatMessage}}) => {

    const { orderType, orderBy, applicationData, applicationType } = alertConfig;

    const tabsChange = (tabKey) => {
        dispatch({
            type: 'alertConfig/queryAplication',
            payload: {
                type: tabKey,
                orderBy: undefined,
                orderType: undefined,
            }
        })
    }

    const openAppModal = (type) => {
        dispatch({
            type: 'alertConfig/beforeQueryApplicationType',
            payload: type
        })
    }

    const appListProps = {
        ...alertConfig,

        pageBy: 'application',

        columns: alertConfig.columns,

        listData: alertConfig.applicationData,

        formatMessages: defineMessages({
            displayName: {
                id: 'alertApplication.List.displayName',
                defaultMessage: '应用显示名',
            },
            name: {
                id: 'alertApplication.List.application',
                defaultMessage: '应用名称',
            },
            createDate: {
                id: 'alertApplication.List.createDate',
                defaultMessage: '添加时间',
            },
            status: {
                id: 'alertApplication.List.onOff',
                defaultMessage: '是否开启',
            },
            operation: {
                id: 'alertApplication.List.actions',
                defaultMessage: '操作',
            },
            action_edit: {
                id: 'alertApplication.List.edit',
                defaultMessage: '编辑',
            },
            action_delete: {
                id: 'alertApplication.List.delete',
                defaultMessage: '删除',
            },
            noData: {
                id: 'alertList.noListData',
                defaultMessage: '暂无数据',
            },
        }),

        orderUp: (e) => {
            const orderKey = e.target.getAttribute('data-key');

            dispatch({
                type: 'alertConfig/orderList',
                payload: {
                    orderBy: orderKey,
                    orderType: 1
                }
            })
        },
        orderDown: (e) => {
            const orderKey = e.target.getAttribute('data-key');

            dispatch({
                type: 'alertConfig/orderList',
                payload: {
                    orderBy: orderKey,
                    orderType: 0
                }
            })
        },
        orderByTittle: (e) => {
            const orderKey = e.target.getAttribute('data-key');

            dispatch({
                type: 'alertConfig/orderByTittle',
                payload: orderKey
            })
        },
        switchClick: (id, status) => {
            dispatch({
                type: 'alertConfig/changeStatus',
                payload: {
                    id: id,
                    status: status === true ? 1 : 0
                }
            })
        },
        deleteClick: (item) => {
            dispatch({
                type: 'alertConfig/toggleDeleteModal',
                payload: {
                    applicationItem: item,
                    status: true,
                }
            })
        }
    }

    const localeMessage = defineMessages({
        newApplication: {
            id: 'alertApplication.newApplication',
            defaultMessage: '添加应用'
        },
        incoming: {
            id: 'alertApplication.incoming',
            defaultMessage: '接入'
        },
        outgoing: {
            id: 'alertApplication.outgoing',
            defaultMessage: '转出'
        },
        incomingTotal: {
            id: 'alertApplication.incomingTotal',
            defaultMessage: '接入应用总数: {num}'
        },
        outgoingTotal: {
            id: 'alertApplication.outgoingTotal',
            defaultMessage: '转出应用总数: {num}'
        }
    })

    return (
        <div className={styles.myAppTabs}>
            <div className={styles.addBtn}>
                <Button type="primary" className={styles.appBtn} onClick={ () => {
                    openAppModal(alertConfig.applicationType) // 1 -> 接出
                }}><span>{formatMessage({...localeMessage['newApplication']})}</span></Button>
                {
                    alertConfig.applicationType == 1 ?
                    <p className={styles.total}><FormattedMessage {...localeMessage['outgoingTotal']} values={{num: alertConfig.applicationData.length}}/></p>
                    :
                    <p className={styles.total}><FormattedMessage {...localeMessage['incomingTotal']} values={{num: alertConfig.applicationData.length}}/></p>
                }
            </div>
            <Tabs defaultActiveKey="0" activeKey={ '' + alertConfig.applicationType } type='line' onChange={ (tabKey) => {tabsChange(tabKey)}}>
                <TabPane tab={formatMessage({...localeMessage['incoming']})} key="0">
                    <ApplicationList {...appListProps} />
                </TabPane>
                <TabPane tab={formatMessage({...localeMessage['outgoing']})} key="1">
                    <ApplicationList {...appListProps} />
                </TabPane>
            </Tabs>
            <AppSelectModal />
            <AppDeleteModal />
        </div>
    )
}

export default injectIntl(connect((state) => {
    return {
        alertConfig: state.alertConfig,
    }
})(alertApplication))