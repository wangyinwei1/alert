import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import styles from '../common.less'
import menuStyles from './menu.less'
import { classnames } from '../../../utils'
import AlertViewModal from '../../alertViewModal/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Menu, Button } from 'antd'
import { Link } from 'dva/router'

const MenuItem = Menu.Item;

const messages = defineMessages({
  alertManage: {
    id: 'leftMenu.alertManage',
    defaultMessage: '告警管理',
  },
  alertQuery: {
    id: 'leftMenu.alertQuery',
    defaultMessage: '告警查询',
  },
  alertConfig: {
    id: 'leftMenu.alertConfig',
    defaultMessage: '告警配置',
  },
  watchManage: {
    id: 'leftMenu.watchManage',
    defaultMessage: '值班管理',
  },
  sceneMonitor: {
    id: 'leftMenu.sceneMonitor',
    defaultMessage: '场景监控'
  },
  sceneMonitorDefault: {
    id: 'leftMenu.sceneMonitor.default',
    defaultMessage: '默认场景'
  },
  addSceneMonitor: {
    id: 'leftMenu.sceneMonitor.add',
    defaultMessage: "添加视图"
  },
  alertQueryTitle: {
    id: 'leftMenu.alertQuery',
    defaultMessage: "告警查询",
  },
  allAlertQuery: {
    id: 'leftMenu.alertQuery.allQuery',
    defaultMessage: "全部告警",
  }
})

const editIcon = classnames(
  'icon',
  'iconfont',
  'icon-bianji'
)

const addIcon = classnames(
  'icon',
  'iconfont',
  'icon-tianjiashitu'
)

class ViewMenu extends Component {
  createMenus(menus, isFold) {
    const { dispatch, supervisor } = this.props;
    return menus.map(item => {
      const path = '/alertManage/';
      const iconName = `icon-${item.icon}`
      const className = classnames(
        'icon',
        iconName,
        'iconfont'
      )

      return (
        <Menu.Item key={item.id} className={menuStyles.menuItem}>
          <Link to={path + item.id}>
            <i className={classnames(className, isFold ? 'foldIcon' : '')}></i>

            {isFold ? ' ' : item.name}
          </Link>
          {
            parseInt(supervisor, 10) > 0 ?
              <a onClick={() => {
                dispatch({
                  type: 'alertView/toEditView',
                  payload: {
                    id: item.id
                  }
                })
              }} className={menuStyles.menuEdit}><i className={editIcon} /></a>
              :
              undefined
          }
        </Menu.Item>
      )
    })
  }

  showAddModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alertView/toAddView',
    })
  }

  showEditModal(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'alertView/toEditView',
    })
  }

  render() {
    const { alertView, isFold, location, menuClassName, supervisor } = this.props;
    const views = alertView.views || [];
    const pathname = location.pathname;
    const selectedMenus = views.filter((singleMenu) => pathname.indexOf("/alertManage/" + singleMenu.id) >= 0);
    const selectedMenuKeys = selectedMenus.map((singleMenu) => singleMenu.id);
    if (selectedMenuKeys.length == 0 && views.length > 0 && pathname.indexOf("/alertManage") >= 0 && pathname.indexOf("/alertList") < 0) {
      selectedMenuKeys.push(views[0].id);
    }

    const menuItems = this.createMenus(views, isFold);
    const selectedKey = pathname;

    return (
      <div>
        {
          isFold ?
            undefined
            :
            <div className={menuStyles.menuTitle}>
              <label><FormattedMessage {...messages['sceneMonitor']} /></label>
            </div>
        }
        <div className={menuStyles.menuContent}>
          <Menu
            className={menuClassName}
            mode={isFold ? 'vertical' : 'inline'}
            selectedKeys={selectedMenuKeys}>
            {menuItems}
          </Menu>
        </div>
        {
          parseInt(supervisor, 10) > 0 ?
            (
              <div className={classnames(menuStyles.menuOperate, isFold ? menuStyles.foldOperate : '')}>
                <Button onClick={(e) => this.showAddModal()} className={styles.addBtn} type="info">
                  {
                    isFold ?
                      <i className={addIcon} />
                      :
                      <FormattedMessage {...messages['addSceneMonitor']} />
                  }
                </Button>
              </div>
            )
            :
            undefined
        }

        <AlertViewModal alertView={alertView} dispatch={this.props.dispatch} />
      </div>
    )
  }
}

export default injectIntl(connect(state => {
  return {
    alertView: state.alertView || {}
  }
})(ViewMenu))