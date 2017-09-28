import React from 'react'
import styles from '../main.less'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
import { classnames, bottomMenus } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const formatMessages = defineMessages({
  alertConfig: {
    id: 'leftMenu.set',
    defaultMessage: '设置',
  },
  help: {
    id: 'lefeMenu.help',
    defaultMessage: '帮助',
  }
})

const createMenus = (menus, isFold, supervisor) => {
  return menus.filter(item => item.key !== 'help').map(item => {
    const path = '/';
    const iconName = `icon-${item.icon}`
    const className = classnames(
      'icon',
      iconName,
      'iconfont'
    )

    return (
      parseInt(supervisor, 10) > 0 ?
        <Menu.Item key={item.key}>
          <Link to={path + item.key}>
            <i className={className}></i>

            {isFold ? '' : <FormattedMessage {...formatMessages[item.key]} />}
          </Link>
        </Menu.Item>
        :
        undefined
    )
  })
}

function FoldBar({ isFold, handleFoldMenu, handleClickNavMenu, supervisor, className }) {
  // const handleFoldMenu = () => {
  //   const isExpand = isFold ? true : fasle
  //   handleFoldMenu(isExpand)
  // }
  const menuClass = !isFold ? 'icon-cebianlanshouqi' : 'icon-cebianlanzhankai';
  const arrClass = classnames(
    styles['switchMenu'],
    'iconfont',
    menuClass
  )
  const setClass = classnames(
    'icon',
    'iconfont',
    'icon-bushu'
  )
  const helpClass = classnames(
    'icon',
    'iconfont',
    'icon-bangzhu'
  )

  const menuItems = createMenus(bottomMenus, isFold, supervisor);
  const pathname = location.pathname;
  const hash = location.hash;
  const selectedMenus = bottomMenus.filter((singleMenu) => pathname.indexOf(singleMenu.key) >= 0 || hash.indexOf(singleMenu.key) > 0);
  const selectedMenuKeys = selectedMenus.map((singleMenu) => singleMenu.key);

  return (
    <div className={styles.menuAssist}>
      <div onClick={handleFoldMenu} className={styles.foldBar}>
        <div className={styles.foldBarLine}></div>
        <i className={arrClass}></i>
      </div>
      <Menu
        className={className}
        mode={isFold ? 'vertical' : 'inline'}
        onClick={handleClickNavMenu}
        selectedKeys={selectedMenuKeys}
        defaultSelectedKeys={[location.pathname.split('/')[location.pathname.split('/').length - 1] || 'alertManage']}>
        {menuItems}
      </Menu>
      {window.__alert_appLocaleData.locale != 'en-us' ? <div className={styles.menuHelp}><a target="_blank" href="help/index.html"><i className={helpClass}></i>{!isFold ? <FormattedMessage {...formatMessages['help']} /> : ''}</a></div> : undefined}
    </div>
  )
}
export default FoldBar
