import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames, browser } from '../../../utils'

class DOMWrap extends Component {
  constructor(props) {
    super(props);
    this.scrollTimer = null;
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

  componentDidMount() {
      this.content.addEventListener('scroll', this.scrollLoadMore, false)
  }

  componentWillUnmount() {
      this.content.removeEventListener('scroll', this.scrollLoadMore, false)
  }

  getInnerMenu(currentIndex) {
      return this.refs[`menu_${currentIndex}`]
  }

  render() {
    const { tag: Tag, selectList, currentIndex, changeHandler } = this.props;
    const wancheng = classnames(
        'icon',
        'iconfont',
        'icon-dui'
    )

    const renderName = (key, name) => {
        if (key == 'severity' || key == 'status') {
            return <p>{ window[`_${key}`][name] }</p>
        } else {
            return <p>{ name }</p>
        }
    }

    return (
      <Tag ref={content => this.content = content} >
          {
              selectList.length > 0 ? selectList.map( (item, index) => {
                  return (
                    <li className={currentIndex === index && styles.active} ref={`menu_${index}`} key={item.id} data-id={JSON.stringify(item)} onClick={ (e) => {
                        e.stopPropagation();
                        let target = JSON.parse(e.currentTarget.getAttribute('data-id'));
                        changeHandler(target)
                    }}>{renderName(item.key, item.value)}{item.checked && <i className={wancheng}></i>}</li>
                  )
              }) : <li>Not Found</li>
          }
      </Tag>
    )
  }
}

export default DOMWrap