import React, { Component } from 'react'
import { Dropdown, Button } from 'antd'
import icons from '../../../config/menuIcons.json'
import { classnames } from '../../../utils/index.js'
import styles from './index.less'

const DropdownBtn = Dropdown.Button;
const spreadIcon = classnames(
  'icon',
  'iconfont',
  'icon-xialasanjiao'
)


class IconSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { onChange } = this.props;
    onChange && onChange(icons[0]);
  }
  componentWillReceiveProps(newProps) {
    if(newProps.value) {
      this.setState({value: newProps.value});
    }
  }
  onChange(value) {
    const { onChange } = this.props;
    this.setState({value})
    onChange && onChange(value);
  }
  render() {
    const { value=icons[0] } = this.state;
    return (
      <div>
        <div className={ styles.topArea }>
          <div className={ styles.selectedIcon }><i className={classnames('icon', 'iconfont', 'icon-' + value)}/></div>
          <Button className={ styles.spreadBtn }><i className={spreadIcon}/></Button>
        </div>
        <div className={ styles.bottomArea }>
          {
            icons.map((iconClass, index) => (
              <div key={ index } onClick={() => this.onChange(iconClass)} className={classnames(styles.iconItem, value==iconClass?styles.iconItemActive:'')}><i className={classnames('icon', 'iconfont', 'icon-' + iconClass)}/></div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default IconSelect;