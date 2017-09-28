import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom';
import styles from './index.less'
import KeyCode from 'rc-util/lib/KeyCode';
import scrollIntoView from 'dom-scroll-into-view';
import { classnames, browser } from '../../../utils'

class DOMWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: props.selectList || [], // 当前数组行
      currentIndex: 0 // 当前活跃行
    }
    this.scrollTimer = null;
    this.changeBykeyBoard = this.changeBykeyBoard.bind(this)
    this.scrollLoadMore = this.scrollLoadMore.bind(this)
  }

  scrollLoadMore(event) {
    let scrollTop = 0
        , scrollHeight = 0
        , offsetHeight = 0
        , bro = browser();
    if (bro === 'Firefox') {
      scrollTop = event.target.scrollTop
      scrollHeight = event.target.scrollHeight
      offsetHeight = event.target.offsetHeight
    } else {
      scrollTop = event.srcElement.scrollTop
      scrollHeight = event.srcElement.scrollHeight
      offsetHeight = event.srcElement.offsetHeight
    }

    clearTimeout(this.scrollTimer);
    //console.log(scrollTop + '==>' + scrollHeight + '==>' + offsetHeight)
    this.scrollTimer = setTimeout(() => {
      if (scrollTop + 30 > scrollHeight - offsetHeight) {
        this.props.loadMore()
      }
    }, 50)
  }

  changeBykeyBoard(event) {
    if (this.state.current.length > 0) {
      let currentIndex = this.state.currentIndex;
      switch (event.keyCode) {
        case KeyCode.UP:
          if(currentIndex < 1) {
            currentIndex = this.state.current.length - 1;
          } else {
            currentIndex--
          }
          this.setState({ currentIndex })
          break;
        case KeyCode.DOWN:
          if(currentIndex < this.state.current.length - 1) {
            currentIndex++
          } else {
            currentIndex = 0;
          }
          this.setState({ currentIndex })
          break;
        case KeyCode.ENTER:
          this.props.selectList && this.props.onkeyEnter(this.props.selectList[currentIndex])
          break;
        default:
          break;
      }
      if (this.refs[`menu_${currentIndex}`]) {
        scrollIntoView(this.refs[`menu_${currentIndex}`], findDOMNode(this.content), {
          onlyScrollIfNeeded: true,
        })
      }
    }
    return
  }

  componentDidMount() {
    this.content.addEventListener('scroll', this.scrollLoadMore, false)
    document.addEventListener('keydown', this.changeBykeyBoard, false)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectList !== this.props.selectList) {
      this.setState({
        current: nextProps.selectList || [],
        currentIndex: 0
      })
    }
  }

  componentWillUnmount() {
    this.content.removeEventListener('scroll', this.scrollLoadMore, false)
    document.removeEventListener('keydown', this.changeBykeyBoard, false)
  }

  render() {
    const { tag: Tag, onMouseLeave, selectList, tagGroup, selectHandler } = this.props;

    const wancheng = classnames(
        'icon',
        'iconfont',
        'icon-dui'
    );

    const renderName = (key, name) => {
        if (key == 'severity' || key == 'status') {
            return window[`_${key}`][name]
        } else {
            return name
        }
    };

    return (
      <Tag ref={content => this.content = content} className={styles.tags_query_content} onMouseLeave={ (e) => {
        // 有时候e.target会是LI,猜测这里mouseLeave在react的事件系统中是由mouseout实现的，以致会产生冒泡,e.nativeEvent.type是mouseout
        if (e.target.nodeType && e.target.nodeName.toLocaleUpperCase() === 'LI') {
          return;
        }
        onMouseLeave();
      } }>
          {
              selectList.length > 0 ? selectList.map( (item, itemIndex) => {
                  return (
                      <li
                        className={this.state.currentIndex === itemIndex && styles.active}
                        ref={`menu_${itemIndex}`}
                        key={item.id}
                        data-id={JSON.stringify(item)}
                        onClick={selectHandler}
                      >
                          {renderName(item.key, item.value)}{item.checked && <i className={wancheng}></i>}
                      </li>
                  )
              }) : <li>Not Found</li>
          }
      </Tag>
    )

  }
}

export default DOMWrap
