import React, { PropTypes, Component } from 'react'
import Animate from 'rc-animate'
import Search from './Search.js'
import styles from './index.less'
import { classnames } from '../../../utils'
import PureRender from '../../../utils/PureRender.js'

const wancheng = classnames( 'icon', 'iconfont', 'icon-dui' )

@PureRender
class SearchBuilder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      popupVisible: false,
    }
    this.delayTimer = null
    this.clearDelayTimer = this.clearDelayTimer.bind(this)
    this.renderValueBuilder = this.renderValueBuilder.bind(this)
  }

  clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer)
      this.delayTimer = null
    }
  }

  delay(callback, delayS) {
    const delay = delayS * 1000;
    this.clearDelayTimer();
    if (delay) {
      this.delayTimer = setTimeout(() => {
        callback();
        this.clearDelayTimer();
      }, delay);
    } else {
      callback();
    }
  }

  setKeys(popupVisible) {
    const { keyArray } = this.props
    if (popupVisible && !keyArray.length) {
      this.props.openKeyBuilder( this.setPopupVisible.bind(this, popupVisible) )
    } else {
      this.setPopupVisible(popupVisible)
    }
  }

  // 更改key值
  changeKeyHandler(event) {
    event.stopPropagation();
    let key = JSON.parse(event.currentTarget.getAttribute('data-key'));
    this.props.changeKeyHandler(key)
  }

  // 是否展开key选择器
  setPopupVisible(popupVisible) {
    this.clearDelayTimer();
    if (this.state.popupVisible !== popupVisible) {
      this.setState({
        popupVisible,
      });
    }
  }

  // -----------------------------------------------------------

  // 修改value调用
  changeValueHandler(value) {
    this.props.changeValueHandler(value)
  }

  // 移除value调用
  removeValueHandler(event) {
    event.stopPropagation();
    let value = JSON.parse(event.currentTarget.getAttribute('data-id'))
    this.props.removeValueHandler(value)
  }

  // 查询标签值
  queryValue(key, message = '', callback = () => {}) {
    this.props.queryValue(key, message, callback)
  }

  // 滚动加载更多
  loadMore(key, message = '') {
    this.props.loadMore(key, message)
  }

  renderValueBuilder(array, list) {
    return array.map( (group, index) => {
      return (
        <Search
          key={group.key}
          haveTags={typeof group.values !== 'undefined' && group.values.length !== 0 ? true : false}
          content={group}
          changeValueHandler={this.changeValueHandler.bind(this)}
          removeValueHandler={this.removeValueHandler.bind(this)}
          queryValue={this.queryValue.bind(this)}
          selectList={list}
          loadMore={this.loadMore.bind(this)}
        />
      )
    })
  }

  render() {
    return (
      <div className={styles.builder}>
        <div
          className={classnames(styles.keyBuilder, this.props.className)}
          onMouseEnter={ this.delay.bind(this, this.setKeys.bind(this, true), 0.2) }
          onMouseLeave={ this.delay.bind(this, this.setKeys.bind(this, false), 0.2) }
        >
          {this.props.keyLabel}
          <Animate
            component='div'
            transitionName="tags"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            {
              this.state.popupVisible &&
              <ul className={styles.content}>
                {
                  this.props.keyArray.map( key => (
                    <li
                      key={ key.key + key.keyName }
                      data-key={ JSON.stringify(key) }
                      onClick={this.changeKeyHandler.bind(this)}
                    >
                      { key.keyName }
                      { key.checked && <i className={wancheng}></i> }
                    </li>
                  ))
                }
              </ul>
            }
          </Animate>
        </div>
        { this.renderValueBuilder(this.props.valueArray, this.props.selectList) }
      </div>
    )
  }
}

SearchBuilder.defaultProps = {
  className: '', // 额外的修改key选择器button的样式
  keyLabel: <span></span>,
  keyArray: [],
  valueArray: [], // 用于展示的value group
  selectList: [], // value 可以选择列表
  openKeyBuilder: () => {}, // 打开key选择器
  changeKeyHandler: () => {}, // 更改key值
  queryValue: () => {}, // 查询selectList
  changeValueHandler: () => {}, // 更改value的值
  removeValueHandler: () => {}, // 移除value的值
  loadMore: () => {} // 加载更多
}

SearchBuilder.propTypes = {
  className: PropTypes.string.isRequired,
  keyLabel: PropTypes.element.isRequired,
  keyArray: PropTypes.array.isRequired,
  selectList: PropTypes.array.isRequired,
  valueArray: PropTypes.array.isRequired,
  openKeyBuilder: PropTypes.func.isRequired,
  changeKeyHandler: PropTypes.func.isRequired,
  queryValue: PropTypes.func.isRequired,
  changeValueHandler: PropTypes.func.isRequired,
  removeValueHandler: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired
}

export default SearchBuilder