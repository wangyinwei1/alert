import React, { PropTypes, Component } from 'react'
//import PureRender from '../../../utils/PureRender.js'
import Gradation from './gradation.js'
import TagAssociate from './tagAssociate.js'
import * as Constants from '../propTypes.js'
import TopologyAssociate from './topologyAssociate.js'
import styles from './index.less'

class WrapperCondition extends Component {
  constructor(props) {
    super(props)
    this.renderCondition = this.renderCondition.bind(this)
    this.changeAssociation = this.changeAssociation.bind(this)
  }

  // 修改条件配置
  changeAssociation(key, typeOrValue, value) {
    if (arguments.length === 3) { // 修改部分配置
      this.props.changeCondition('condition', {
        ...this.props.condition,
        [key]: {
          ...this.props.condition[key],
          [typeOrValue]: value
        }
      })
    } else if (arguments.length === 2) {
      this.props.changeCondition('condition', {
        ...this.props.condition,
        [key]: typeOrValue
      })
    }
  }

  renderCondition({userInfo, associatedFlag, condition, codewords}) {
    let nodeComponent = React.cloneElement(<Gradation />, {
      _type: 'noAssociation',
      _key: 'ruleData',
      condition: condition.noAssociation.ruleData,
      changeCondition: this.changeAssociation,
      codewords
    })
    switch (associatedFlag) {
      case 1:
        nodeComponent = React.cloneElement(<TagAssociate />, {
          _type: 'tagAssociation',
          condition: condition.tagAssociation,
          changeCondition: this.changeAssociation,
          codewords
        })
        break;
      case 2:
        nodeComponent = React.cloneElement(<TopologyAssociate />, {
          _type: 'topologyAssociation',
          userInfo: userInfo,
          condition: condition.topologyAssociation,
          changeCondition: this.changeAssociation,
          codewords
        })
        break;
      default:
        break;
    }
    return nodeComponent
  }

  render() {
    return (
      <div className={styles.wrapper}>
        { this.renderCondition(this.props) }
      </div>
    )
  }
}

WrapperCondition.defaultProps = {
  associatedFlag: Constants.DefaultConditionProps.associatedFlag,
  condition: Constants.DefaultConditionProps
}

WrapperCondition.propTypes = {
  associatedFlag: PropTypes.number.isRequired,
  condition: PropTypes.shape({
    ...Constants.ConditionPropTypes
  })
};

export default WrapperCondition