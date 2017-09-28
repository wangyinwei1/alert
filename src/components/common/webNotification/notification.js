import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';
import classnames from 'classnames';
import Notice from './notice.js'
import styles from './index.less'
import _ from 'lodash'

let seed = 0;
const now = Date.now();

function getUUID() {
  return `rcNotification_${now}_${seed++}`;
}
class Notification extends Component {
  constructor(props) {
    super(props)
    this.threshold = props.threshold;
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
    this.batchAdd = this.batchAdd.bind(this)
    this.state = {
      notices: []
    }
  }
  static propTypes = {
    threshold: React.PropTypes.number,
  }
  add(notice) {
    const key = notice.key = notice.key || getUUID();
    this.setState(previousState => {
      const notices = previousState.notices;
      if (!notices.filter(v => v.key === key).length) {
        return {
          notices: notices.concat(notice),
        };
      }
    });
  }
  batchAdd(notices) {
    notices.forEach( (notice, index) => {
      setTimeout(() => {
        this.add(notice)
      }, 30 * index)
    })
  }
  remove(key) {
    this.setState(previousState => {
      return {
        notices: previousState.notices.filter(notice => notice.key !== key),
      };
    });
  }
  // when trigger loop return
  update(notices) {
    if (this.state.notices && notices.length > 0) {
      const less = Number(this.threshold) - this.state.notices.length
      const equal = notices.length - less;
      if (equal < 0) {
        // should not remove notices
        this.batchAdd(notices)
      } else {
        // remove some notices
        let _notices = _.cloneDeep(this.state.notices)
        let count = equal;
        while(count > 0) {
          let operate = _notices.shift()
          typeof operate !== 'undefined' && setTimeout(() => {
            this.remove(operate.key)
          }, 30 * count)
          count--
        }
        this.batchAdd(notices.slice(0, less))
      }
    }
  }

  render() {
    const props = this.props;
    const noticeNodes = this.state.notices.map((notice) => {
      const onClose = this.remove.bind(this, notice.key)
      return (
        <Notice
          {...notice}
          onClose={onClose}
          prefix={props.prefix}
        />
      )
    })
    const className = [
      styles[props.prefix]
    ]
    return (
      <div className={classnames(...className)} style={props.style}>
        <Animate transitionName={{
          enter: 'enter',
          enterActive: 'enterActive',
          leave: 'leave',
          leaveActive: 'leaveActive',
          appear: 'appear',
          appearActive: 'appearActive'
        }}>{noticeNodes}</Animate>
      </div>
    )
  }
}

Notification.newInstance = function(properties) {
  const { getContainer, ...props } = properties || {}
  let div
  if (getContainer) {
    div = getContainer();
  } else {
    div = document.createElement('div')
    document.body.appendChild(div)
  }
  const notification = ReactDOM.render(<Notification {...props} />, div)
  return {
    // new notices by server query not this.state.notices
    update(newNotices) {
      notification.update(newNotices)
    },

    component: notification,

    destroy() {
      ReactDOM.unmountComponentAtNode(div)
      document.body.removeChild(div)
    }
  }
}

export default Notification