import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';
import classnames from 'classnames';
import { getUUID } from '../../utils'
import $ from 'jquery'
import styles from './index.less'

// class Message extends Component {
//   constructor(props) {
//     super(props)
//     this.closeTimer = null
//     this.clearTimer = this.clearTimer.bind(this)
//   }

//   static propTypes = {
//     content: React.PropTypes.string,
//     delayS: React.PropTypes.number,
//     onClose: React.PropTypes.func,
//   }
//   static defaultProps = {
//     delayS: 1, // s
//     onClose: () => {}
//   }

//   componentDidMount() {
//     if (this.props.delayS) {
//       this.closeTimer = setTimeout(() => {
//         this.clearTimer();
//         this.props.onClose();
//       }, this.props.delayS * 1000)
//     }
//   }

//   componentWillReceiveProps(nextProps) {
//     if (nextProps.key !== this.props.key && nextProps.delayS) {
//       this.closeTimer = setTimeout(() => {
//         this.clearTimer();
//         nextProps.onClose();
//       }, nextProps.delayS * 1000)
//     }
//   }

//   componentWillUnmount() {
//     this.clearTimer();
//   }

//   clearTimer() {
//     if (this.closeTimer) {
//       clearTimeout(this.closeTimer)
//       this.closeTimer = null
//     }
//   }

//   midTopOrLeft(startTopOrLeft, target) {
//     console.log($(target).offset().left)
//     console.log($(target).offset().top)
//     let left = startTopOrLeft.left + ($(target).offset().left - startTopOrLeft.left) / 2;
//     let top = $(target).offset().top + (startTopOrLeft.top - $(target).offset().top) / 2
//     if ($(target).offset().top < 0) {
//       top = 55 + (startTopOrLeft.top - 55) / 2; // 头部55px
//     }
//     return {
//       top: top,
//       left: left
//     }
//   }

//   render() {
//     const props = this.props
//     const style = {
//       left: this.midTopOrLeft(startTopOrLeft, props.node).left,
//       top: this.midTopOrLeft(startTopOrLeft, props.node).top
//     }
//     return (
//       <div className={styles.easeAnimate} style={style}>
//         <svg viewBox="0 0 200 100" width='200' height="100">
//           <text x='100' y='50'>{ props.content }</text>
//         </svg>
//       </div>
//     )
//   }
// }


// class AnimateRoot extends Component {

//   constructor(props) {
//     super(props)
//     this.update = this.update.bind(this)
//     this.state = {
//       message: null,
//       delayS: 1 //s
//     }
//   }

//   update(props) {
//     if (!React.isValidElement(this.state.message)) {
//       this.setState({
//         message: React.cloneElement(<Message />, {
//           key: getUUID(8),
//           onClose: this.remove.bind(this),
//           ...props
//         }),
//         delayS: props.delayS || 1,
//         node: props.node
//       })
//       this.callback = props.callback.bind(null, arguments)
//     }
//   }

//   animateEnter(node, done) {
//     let ok = false;

//     function complete() {
//       if (!ok) {
//         ok = 1;
//         done();
//       }
//     }
//     $(node).animate({
//       opacity: 1,
//       top: $(node).offset().top,
//       left: $(node).offset().left
//     }, this.state.delayS * 1000)
//     return {
//       stop: function() {
//         $(node).stop();
//         complete()
//       }
//     }
//   }

//   animateAppear(node, done) {
//     this.animateEnter.bind(this, arguments)
//   }

//   animateLeave(node, done) {
//     let ok = false;

//     function complete() {
//       if (!ok) {
//         ok = 1;
//         done();
//       }
//     }
//     $(node).animate({
      // opacity: 0,
      // top: $(this.state.node).offset().top > 0 ? $(this.state.node).offset().top : 55,
      // left: $(this.state.node).offset().left - 100 // svg的宽度
//     }, this.state.delayS * 1000, () => {
//       //$(node).remove()
//     })
//     return {
//       stop: function() {
//         $(node).stop();
//         complete()
//       }
//     }
//   }

//   remove() {
//     this.setState({
//       message: null
//     })
//   }

//   render() {
//     const isReactElement = React.isValidElement(this.state.message)
//     let animate = {
//       appear: this.animateAppear.bind(this),
//       enter: this.animateEnter.bind(this),
//       leave: this.animateLeave.bind(this)
//     }
//     return (
//         <Animate animation={animate} exclusive={true}>
//           {
//             isReactElement ? this.state.message : null
//           }
//         </Animate>
//     )
//   }
// }
let animateContainer = null
let instance = null
const startTopOrLeft = {
  top: Math.max(document.body.clientHeight, document.documentElement.clientHeight) * 0.8,
  left: document.documentElement.clientWidth * 0.1
} // 先利用定位定死吧

class Message extends Component {
  render() {
    return (
      <div className={styles.easeAnimate} style={this.props.style}>
        <svg viewBox="0 0 200 100" width='200' height="100">
          <text x='100' y='50'>{ this.props.content }</text>
        </svg>
      </div>
    )
  }
}

function destroy() {
  if (animateContainer) {
    ReactDOM.unmountComponentAtNode(animateContainer)
    document.body.removeChild(animateContainer)
  }
}

function midTopOrLeft(startTopOrLeft, target) {
  let left = startTopOrLeft.left + ($(target).offset().left - startTopOrLeft.left - 100) / 2; // svg的100
  let top = $(target).offset().top + (startTopOrLeft.top - $(target).offset().top) / 2
  if ($(target).offset().top < 0) {
    top = 55 + (startTopOrLeft.top - 55) / 2; // 头部55px
  }
  return {
    top: top,
    left: left
  }
}

function motionInstance(props) {
  animateContainer = document.createElement('div')
  document.body.appendChild(animateContainer)
  const root = ReactDOM.render(React.cloneElement(<Message />, {
    style: {...startTopOrLeft, opacity: '0'},
    content: props.content
  }), animateContainer)
  $(ReactDOM.findDOMNode(root)).animate({
    opacity: 1,
    top: midTopOrLeft(startTopOrLeft, props.node).top,
    left: midTopOrLeft(startTopOrLeft, props.node).left,
  }, (props.delayS || 1) * 1000, () => {
    $(ReactDOM.findDOMNode(root)).animate({
      opacity: 0,
      top: $(props.node).offset().top > 0 ? $(props.node).offset().top : 55,
      left: $(props.node).offset().left - 100 // svg的宽度
    }, (props.delayS || 1) * 1000, () => {
      destroy()
      props.callback && props.callback(props.node)
    })
  })
}
/**
 * rc-animate 的animation方式有局限性，做起来太坑，用Jquery吧
 */
const api = {
  generate: (props) => {
    if (props.node && props.content.length) {
      motionInstance(props)
    }
  }
}

export default api