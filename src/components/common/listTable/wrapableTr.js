import React, { Component, PropTypes } from 'react'
import { classnames } from '../../../utils'
import styles from './index.less'
import $ from 'jquery'

class WrapableTr extends Component {
  constructor(props) {
    super(props);
    this.state = { wrapped: this.props.wrapped || true };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.wrapped != this.state.wrapped || nextState.forceUpdate) {
      return true;
    }
    if (nextProps.trId != this.props.trId) {
      return true;
    }

    if (nextProps.columnsLength != this.props.columnsLength) {
      return true;
    }

    if (nextProps.checked != this.props.checked) {
      return true;
    }

    if (nextProps.className != this.props.className) {
      return true;
    }

    const { contentData: oldContentData = {} } = this.props;
    const { contentData: newContentData = {} } = nextProps;

    let isNeedUpdate = false;
    Object.keys(newContentData).forEach((key) => {
      if (oldContentData[key] != newContentData[key]) {
        isNeedUpdate = true;
      }
    })

    return isNeedUpdate;
  }
  componentDidUpdate() {
    const { trId } = this.props;
    const { wrapped } = this.state;
    if (trId) {
      const $trs = $("tr[data-link-tr-id='" + trId + "']");
      $trs.removeAttr("style");
      if (!wrapped) {
        $trs.removeClass(styles.showSome)
        $trs.addClass(styles.showAll);
        let height = this.refs.tr.clientHeight;
        $trs.each((index, e) => {
          if (e.clientHeight > height) {
            height = e.clientHeight;
          }
        })
        $("tr[data-link-tr-id='" + trId + "']").css('height', height);
      } else {
        $trs.removeClass(styles.showAll);
        $trs.addClass(styles.showSome);
      }
      // this.refs.tr.removeAttribute("style")
    }
  }
  _toggleWrap(e) {
    const target = e.target;
    const noNeedWrap = target.getAttribute("data-no-need-wrap");
    const $tr = $(target).closest('tr');
    // 真实的展开收缩情况，一些行是由于连带行展开而通过jquery来展开的，此时他们的state是不变的
    const actualIsWraped = $tr.attr("class").indexOf(styles.showSome) >= 0;
    if (!noNeedWrap) {
      this.setState({ wrapped: !actualIsWraped, forceUpdate: true });
    }
  }
  render() {
    const { children, className, contentData, trId, isSuppressed = false, isRemoved = false, columnsLength, noNeedWrap, ...restProps } = this.props;
    const { wrapped } = this.state;
    return (
      <tr ref="tr" {...restProps} data-link-tr-id={trId} onClick={(e) => { !noNeedWrap && this._toggleWrap(e) }} className={classnames(className, wrapped ? styles.showSome : styles.showAll, isSuppressed ? styles.suppressed : '', isRemoved ? styles.removed : '')}>
        {children}
      </tr>
    )
  }
}

export default WrapableTr;