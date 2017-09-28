import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import LeftMenu from '../components/layout/leftMenu/leftWrap'
import styles from '../components/layout/main.less'
import Bread from '../components/layout/bread/index'
import NotificationApi from '../components/common/webNotification/index.js'
import { classnames } from '../utils'
import '../components/layout/common.less'
import elementResizeEvent from 'element-resize-event';

const claarLocalStorage = () => {
  // 清除一些localstorge存储的用户操作
  localStorage.removeItem('UYUN_Alert_USERINFO')
  localStorage.removeItem('UYUN_Alert_MANAGEFILTER')
}

class App extends Component {

  constructor(props) {
    super(props)
    //this.claarLocalStorage = claarLocalStorage.bind(this)
  }


  componentDidMount() {
    NotificationApi.config({
      placement: 'toopRight',
      threshold: 10
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.app.notifies !== this.props.app.notifies) {
      NotificationApi.update(nextProps.app.notifies)
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.app.notifies !== this.props.app.notifies) {
      return false
    }
    return true
  }

  componentWillUnmount() {
    //console.log('app unmount')
    NotificationApi.destroy();
    this.claarLocalStorage();
  }

  render() {
    const { children, location, dispatch, app, isNeedContent, temp } = this.props;
    const { isShowMask, isFold, userInfo } = app
    // params.isNeedContent确定需不需要content这个容器
    const { params } = children && children.props || {};

    const LeftMenuProps = {
      isFold,
      location,
      supervisor: userInfo.supervisor || '0',
      handleFoldMenu() {
        // 为了让头部的状态也跟着变化 boby 下 expand 和 unexpand 需要在此 trigger
        if (!isFold) {
          document.body.setAttribute('class', 'unexpand')
        } else {
          document.body.setAttribute('class', 'expand')
        }
        dispatch({
          type: 'app/handleFoldMenu'
        })
        // 告警列表柱状图
        dispatch({
          type: 'alertList/updateResize',
          payload: !isFold
        })
        // 告警列表table
        dispatch({
          type: 'alertListTable/updateResize',
          payload: !isFold
        })
        if (location.pathname === '/alertManage' || location.pathname === '/') {
          dispatch({
            type: 'alertManage/queryAlertDashbord',
            payload: {
              isNeedRepaint: true
            }
          })
        }

      }
    }
    return (
      <div>
        {isShowMask && <div className={styles.layer}></div>}
        <div className={classnames(styles.layout, !isFold ? '' : styles.fold)}>
          <LeftMenu {...LeftMenuProps} />
          <div id="topMain" className={styles.main}>
            <Bread location={location} />
            <div className={styles.container} >
              <div className={params && params.isNeedContent === false ? styles.no_content : styles.content} id="content">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// App.contextTypes = {
//   router: React.PropTypes.object
// }
App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  isFold: PropTypes.bool
}


export default connect(({ app }) => ({ app }))(App)
