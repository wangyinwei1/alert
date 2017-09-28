import React, { Component, PropTypes } from 'react'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { classnames } from '../../../utils'
import styles from './index.less'
import $ from 'jquery'

class ScrollBar extends Component {
  constructor(props) {
    super(props);
    const { horizonTarget } = this.props;
    const $horizonTarget = $(horizonTarget);
    const containerWidth = $horizonTarget.width();
    const totalWidth = $horizonTarget.children("table").width();
    this.state = { showLeftScrollBar: false, showRightScrollBar: containerWidth != totalWidth };
  }

  componentDidMount() {
    const { horizonTarget } = this.props;

    $(horizonTarget).scroll((e) => {
      this._setVisibleOfScrollBar();
    })
  }

  componentDidUpdate(prevProps, prevState) {
    // 由父级容器重新渲染导致的重新渲染后需要重新计算是否显示左右滚动条
    if(this.props != prevProps) {
      this._setVisibleOfScrollBar();
    }
  }

  _setVisibleOfScrollBar() {
    const { horizonTarget } = this.props;
    const $horizonTarget = $(horizonTarget);
    const scrollLeft = $horizonTarget.scrollLeft();
    const containerWidth = $horizonTarget.width();
    const totalWidth = $horizonTarget.children("table").width();

    let newState = {};

    if (containerWidth == totalWidth) {
      newState.showLeftScrollBar = false;
      newState.showRightScrollBar = false;
    } else if (scrollLeft + containerWidth >= totalWidth - 5) {
      newState.showLeftScrollBar = true;
      newState.showRightScrollBar = false;
    } else if (scrollLeft == 0) {
      newState.showLeftScrollBar = false;
      newState.showRightScrollBar = true;
    } else {
      newState.showLeftScrollBar = true;
      newState.showRightScrollBar = true;
    }

    this.setState({ ...(this.state), ...newState })
  }

  _scrollLeft() {
    const { horizonTarget } = this.props;
    const oldLeft = $(horizonTarget).scrollLeft();
    $(horizonTarget).scrollLeft(oldLeft - 150);
  }

  _scrollRight() {
    const { horizonTarget } = this.props;
    const oldLeft = $(horizonTarget).scrollLeft();
    $(horizonTarget).scrollLeft(oldLeft + 150);
  }

  render() {

    const { showLeftScrollBar, showRightScrollBar } = this.state;
    const { sourceOrigin } = this.props;

    const leftScrollIcon = classnames(
      'iconfont',
      'icon-cebianlanshouqi',
      styles.scroll,
      sourceOrigin=='alertQuery'?styles.leftScroll:styles.moreLeftScroll,
      showLeftScrollBar ? styles.show : styles.hide
    )

    const rightScrollIcon = classnames(
      'iconfont',
      'icon-cebianlanzhankai',
      styles.scroll,
      styles.rightScroll,
      showRightScrollBar ? styles.show : styles.hide
    )


    return (
      <div className={styles.scrollArea}>
        <i onClick={() => { this._scrollLeft() }} className={leftScrollIcon} />
        <i onClick={() => { this._scrollRight() }} className={rightScrollIcon} />
      </div>
    )
  }
}

ScrollBar.propTypes = {
  horizonTarget: PropTypes.string.isRequired, // 水平参照对象的选择字符串
}

export default ScrollBar;