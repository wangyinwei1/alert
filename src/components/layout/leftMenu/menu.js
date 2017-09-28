import React from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
import { menu } from '../../../utils'
import styles from '../common.less'
import menuStyles from './menu.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import ViewMenu from './viewMenu.js'

const messages = defineMessages({
   alertManage:{
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
    alertQueryTitle: {
      id: 'leftMenu.alertQuery',
      defaultMessage: "告警查询",
    },
    alertQuery: {
      id: 'leftMenu.alertQuery.allQuery',
      defaultMessage: "全部告警",
    }
})



const createMenus = (menus, isFold) => {
  return menus.map(item => {
    const path = '/';
    const iconName = `icon-${item.icon}`
    const className = classnames(
      'icon',
      iconName,
      'iconfont'

    )

    return (
      <Menu.Item key={item.key}>
        <Link to={path + item.key}>
          <i className={className}></i>

          {isFold ? '' : <FormattedMessage {...messages[item.key]} />}
        </Link>
      </Menu.Item>
    )
  })
}

function Menus ({ isFold, location,  handleClickNavMenu, className, supervisor }) {
  const menuItems = createMenus(menu, isFold)
  const pathname = location.pathname;
  const selectedMenus = menu.filter((singleMenu) => pathname.indexOf(singleMenu.key) >= 0);
  const selectedMenuKeys = selectedMenus.map((singleMenu) => singleMenu.key);


  return (
    <div>
      <ViewMenu isFold={isFold} menuClassName={className} location={location} supervisor={supervisor}/>
      {
        isFold?
        undefined
        :
        <div className={classnames(menuStyles.menuTitle, menuStyles.notFirstMenuTitle)}>
          <label><FormattedMessage {...messages['alertQueryTitle']}/></label>
        </div>
      }

      <Menu
        className={styles.bottomMenu}
        mode={isFold ? 'vertical' : 'inline'}
        onClick={handleClickNavMenu}
        selectedKeys={ selectedMenuKeys }
        defaultSelectedKeys={[location.pathname.split('/')[location.pathname.split('/').length - 1] || 'alertManage']}>
        {menuItems}
      </Menu>
    </div>
  )
}

export default Menus
