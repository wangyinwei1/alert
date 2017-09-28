import React from 'react'
import { connect } from 'dva'
import styles from '../main.less'
import Menus from './menu'
import FoldBar from './menuHelper'

function LeftWrap ({isFold, handleFoldMenu, supervisor, location}) {
  // menu props
  const menuProps = {
    isFold,
    location,
    supervisor
  }

  // foldBar props
  const foldBarProps = {
    isFold,
    handleFoldMenu,
    location,
    supervisor
  }

  return (
    <div className={styles.leftMenu}>
      <div className={styles.menuContent}>
        <Menus {...menuProps} className={styles.siderMenu} />
        <FoldBar {...foldBarProps} />
      </div>
    </div>
  )
}
export default connect( state => {
  return {
    supervisor: state.app.userInfo.supervisor
  }
})(LeftWrap)
