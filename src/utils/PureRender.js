/* pureRenderDecorator */
function shallowEqual(a, b) {
  for(const key in a) {
    if ({}.hasOwnProperty.call(a, key) &&
        (!{}.hasOwnProperty.call(b, key) || a[key] !== b[key])) {
      return false
    }
  }
  for(const key in b) {
    if ({}.hasOwnProperty.call(b, key) && !{}.hasOwnProperty.call(a, key)) {
      return false
    }
  }
  return true
}

function shouldComponentUpdate(props, state) {
  return !shallowEqual(props, this.props) || !shallowEqual(state, this.state);
}

export default function pureRenderDecorator(component) {
  component.prototype.shouldComponentUpdate = shouldComponentUpdate
}