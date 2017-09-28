import React, { PropTypes, Component } from 'react'
import { Form, Select } from 'antd';
import * as Constants from '../propTypes.js'
import PureRender from '../../../utils/PureRender.js'

const FormItem = Form.Item;
const Option = Select.Option;
// layout
const itemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 4 }
}

@PureRender
class Source extends Component {
  constructor(props) {
    super(props)
  }

  changeSource(type, value) {
    this.props.commonSetState(type, { source: value })
  }

  render() {
    return (
      <div>
        <FormItem
          {...itemLayout}
          label={window.__alert_appLocaleData.messages['ruleEditor.source']}
        >
          <Select
            getPopupContainer={() => document.getElementById("content") || document.body }
            style={{ width: 200 }}
            value={this.props.sourceValue.source}
            onChange={this.changeSource.bind(this, 'source')}
          >
            <Option value=''>{window.__alert_appLocaleData.messages['ruleEditor.phSource']}</Option>
            {
              this.props.source.map(item => <Option key={item.key}>{item.value}</Option>)
            }
          </Select>
        </FormItem>
      </div>
    )
  }
}

Source.defaultProps = {
  sourceValue: Constants.DefaultSourceProps
}

Source.propTypes = {
  sourceValue: PropTypes.shape({
    ...Constants.SourcePropTypes
  })
};

export default Source