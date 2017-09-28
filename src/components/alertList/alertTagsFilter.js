import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import SearchBuilder from '../common/tagSearchBuilder/index.js'
import { classnames } from '../../utils'

const arrClass = classnames( 'switchMenu', 'iconfont', 'icon-xialasanjiao' )
const switchClass = classnames( 'icon', 'iconfont', 'icon-guolv' )

class alertTagsFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shareSelectTags: props.tagListFilter.shareSelectTags || [],
      selectList: props.tagListFilter.selectList || []
    }
    this.openKeyBuilder = this.openKeyBuilder.bind(this)
    this.changeKeyHandler = this.changeKeyHandler.bind(this)
    this.queryValue = this.queryValue.bind(this)
    this.changeValueHandler = this.changeValueHandler.bind(this)
    this.removeValueHandler = this.removeValueHandler.bind(this)
    this.loadMore = this.loadMore.bind(this)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      shareSelectTags: nextProps.tagListFilter.shareSelectTags,
      selectList: nextProps.tagListFilter.selectList
    })
  }

  // key 选择器打开
  openKeyBuilder(callback) {
    const { dispatch } = this.props
    dispatch({
      type: 'tagListFilter/openSelectModal',
      payload: callback
    })
  }

  // key 改变触发
  changeKeyHandler(key) {
    const { dispatch } = this.props
    dispatch({
      type: 'tagListFilter/changeTags',
      payload: key
    })
  }

  // 查询selectList的值
  queryValue(key, message, callback) {
    const {dispatch} = this.props;
    dispatch({
      type: 'tagListFilter/queryTagValues',
      payload: {
        key: key,
        value: message,
        callback: callback
      }
    })
  }

  // value 改变触发
  changeValueHandler(value) {
    const { dispatch } = this.props
    dispatch({
      type: 'tagListFilter/addTag',
      payload: value
    })
  }

  // value 移除触发
  removeValueHandler(value) {
    const { dispatch } = this.props
    dispatch({
      type: 'tagListFilter/removeTag',
      payload: value
    })
  }

  // 加载更多
  loadMore(key, message) {
    const { dispatch } = this.props
    dispatch({
      type: 'tagListFilter/loadMore',
      payload: {
        key: key,
        value: message
      }
    })
  }

  render() {
    const { tagsKeyList } = this.props.tagListFilter
    const { shareSelectTags, selectList } = this.state

    return (
      <SearchBuilder
        keyLabel={
          <div>
            <i className={classnames(switchClass, styles.hopper)}></i>
            <i className={classnames(arrClass, styles.iconDiv)}></i>
          </div>
        }
        openKeyBuilder={this.openKeyBuilder}
        changeKeyHandler={this.changeKeyHandler}
        queryValue={this.queryValue}
        changeValueHandler={this.changeValueHandler}
        removeValueHandler={this.removeValueHandler}
        loadMore={this.loadMore}
        keyArray={ tagsKeyList }
        selectList={ selectList }
        valueArray={ shareSelectTags }
      />
    )
  }
}

export default connect(({tagListFilter}) => ({tagListFilter}))(alertTagsFilter)