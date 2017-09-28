import React, { Component, PropTypes } from 'react'
import $ from 'jquery'
import styles from './index.less'
import { classnames } from '../../../utils'
import ScrollBar from './scrollBar';
import Theads from './theads'


class TopFixedArea extends Component {
  constructor(props) {
    super(props);
    this.state = { isShow: false, scrollLeft: 0 };
  }

  componentDidMount() {
    const { target, parentTarget, topHeight, onShow, onHide, extraAreaKey } = this.props;
    $(target).scroll((e) => {
      if (!this.unmount) {
        const $target = $(e.target);
        if ($target.scrollTop() > this.props.topHeight) {
          // $(parentTarget).find("thead").css("opacity", "0")
          $("table[data-fixed!=true] > thead").css("opacity", "0").css("height", "0px");
          if(extraAreaKey) {
            $("[data-fix-key='" + extraAreaKey + "']").css("display", "none");
          }
          $(this.refs.topContainer).find("[data-fix-key='" + extraAreaKey + "']").removeAttr("style");

          // $(this.refs.thead).css("display", 'block')
          this.setState({ isShow: true });
          onShow && onShow();
        } else {
          $("table[data-fixed!=true] > thead").removeAttr("style");
          if(extraAreaKey) {
            $("[data-fix-key='" + extraAreaKey + "']").removeAttr("style");
          }
          this.setState({ isShow: false });
          onHide && onHide();
        }
      }
    })

    $(parentTarget).scroll((e) => {
      const $target = $(e.target);
      if(!this.unmount) {
        this.setState({ ...(this.state), scrollLeft: $target.scrollLeft()});
      }
    })
  }

  componentWillUnmount() {
    this.unmount = true;
    $(this.props.target).unbind("scroll");
    $(this.props.parentTarget).unbind("scroll");
  }

  render() {
    const { theads, extraArea, topHeight, parentTarget, isShowScrollBar, sourceOrigin } = this.props;
    const { isShow, scrollLeft } = this.state;

    // 获取肤色主题
    const theme = window.document.getElementsByTagName('html')[0].getAttribute('class');
    // 白色皮肤比蓝色皮肤多出一块高度（24px）
    let extraHeight = (theme == 'white')?24:0;

    return (
      <div ref="topContainer" className={classnames(styles.topFixedArea, isShow ? styles.showTopFixed : '')} style={{ top: $(this.props.target).scrollTop() - topHeight + 10 - extraHeight || 0 }}>
        <div className={ styles.extraArea } style={{ left: scrollLeft, minHeight: extraArea?'0px':'60px' }}>
          {extraArea}
        </div>
        <table data-fixed={ true } className={classnames(styles.listTable, styles.topFixed)}>
          { theads }
        </table>
        {
          isShowScrollBar?
          <div className={ styles.fixScrollBar } style={{ left: scrollLeft }}>
            <ScrollBar sourceOrigin={sourceOrigin} horizonTarget="div.listContainer" />
          </div>
          :
          undefined
        }
      </div>
    )
  }
}

TopFixedArea.defaultProps = {
  target: 'div#topMain',
  topHeight: 397,
  isShowScrollBar: true
}

TopFixedArea.propTypes = {
  extraArea: PropTypes.node,
  target: PropTypes.string,
  parentTarget: PropTypes.string, // 父级容器，需要监听它的左右滚动
  topHeight: PropTypes.number,
}

export default TopFixedArea;