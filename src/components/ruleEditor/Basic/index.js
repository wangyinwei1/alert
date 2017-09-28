import React, { PropTypes, Component } from 'react'
import { default as cls } from 'classnames'
import { Form, Input, Select } from 'antd';
import * as Constants from '../propTypes.js'
import { injectIntl, defineMessages } from 'react-intl';
import TimeCycle from './timeCycle.js'
import * as Services from '../service.js'

import styles from './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const localeMessage = defineMessages({
  inputNotify: {
    id: 'ruleEditor.validator.inputNotify',
    defaultMessage: "请输入{field}",
  },
  maxFieldLength: {
    id: 'ruleEditor.validator.maxFieldLength',
    defaultMessage: "{field}字符长度不超过{length}个",
  }
})

// layout
const itemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 4 }
};
const desLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 10 }
};

// Association
const flagsByNewIncidents = [
  { label: window.__alert_appLocaleData.messages['ruleEditor.associateTypes.noWay'], value: '0'},
  { label: window.__alert_appLocaleData.messages['ruleEditor.associateTypes.tags'], value: '1'},
  { label: window.__alert_appLocaleData.messages['ruleEditor.associateTypes.topology'], value: '2'}
]

const flagsByHistoryIncidents = [
  { label: window.__alert_appLocaleData.messages['ruleEditor.associateTypes.noWay'], value: '0'},
]

class Basic extends Component {

  constructor(props) {
    super(props)
  }

  changeField(type, args) {
    let _base = _.cloneDeep(this.props.base)
    switch (type) {
      case 'name':
        _base.name = args.target.value
        this.props.commonSetState('base', _base)
        break;
      case 'description':
        _base.description = args.target.value
        this.props.commonSetState('base', _base)
        break;
      case 'associatedFlag':
        this.props.commonSetState('associatedFlag', Number(args))
        break;
      default:
        break;
    }
  }

  render() {
    const { base, target, intl: { formatMessage } } = this.props

    let timeCycleProps = {
      target,
      moment: this.props.moment,
      time: this.props.time,
      timeStart: this.props.timeStart,
      timeEnd: this.props.timeEnd,
      commonSetState: this.props.commonSetState
    }

    return (
      <div className={styles.baseInfo}>
        {
          Services.wrapperValidator({
            code: 'name',
            param: base.name,
            trigger: 'onChange',
            itemProps: {
              ...itemLayout,
              required: true,
              label: window.__alert_appLocaleData.messages['ruleEditor.ruleName'],
              rules: [
                { type: 'string', required: true, message: formatMessage({ ...localeMessage['inputNotify'] }, { field: window.__alert_appLocaleData.messages['ruleEditor.ruleName'] }) },
                { type: 'string', max: 20, message: formatMessage({ ...localeMessage['maxFieldLength'] }, { field: window.__alert_appLocaleData.messages['ruleEditor.ruleName'], length: '20' }) }
              ]
            }
          })(
            <Input style={{ width: 200 }} value={base.name} onChange={this.changeField.bind(this, 'name')} placeholder={window.__alert_appLocaleData.messages['ruleEditor.phRuleName']} />
          )
        }
        {
          Services.wrapperValidator({
            code: 'description',
            param: base.description,
            trigger: 'onChange',
            itemProps: {
              ...desLayout,
              required: true,
              label: window.__alert_appLocaleData.messages['ruleEditor.description'],
              rules: [
                { type: 'string', required: true, message: formatMessage({ ...localeMessage['inputNotify'] }, { field: window.__alert_appLocaleData.messages['ruleEditor.description'] }) },
              ]
            }
          })(
            <Input value={base.description} onChange={this.changeField.bind(this, 'description')} type="textarea" placeholder={window.__alert_appLocaleData.messages['ruleEditor.phDescription']} />
          )
        }
        <FormItem
          {...desLayout}
          label={window.__alert_appLocaleData.messages['ruleEditor.target']}
        >
          <Select
            getPopupContainer={() => document.getElementById("content") || document.body }
            style={{ width: 200 }}
            onChange={this.props.changeTarget}
            value={String(this.props.target)}
          >
            <Option value='0'>{window.__alert_appLocaleData.messages['ruleEditor.newTarget']}</Option>
            <Option value='1'>{window.__alert_appLocaleData.messages['ruleEditor.oldTarget']}</Option>
          </Select>
        </FormItem>
        <TimeCycle
          {...timeCycleProps}
        />
        <FormItem
          {...desLayout}
          label={window.__alert_appLocaleData.messages['ruleEditor.associateTypes']}
        >
          <Select
            getPopupContainer={() => document.getElementById("content") || document.body }
            style={{ width: 200 }}
            onChange={this.changeField.bind(this, 'associatedFlag')}
            value={String(this.props.associatedFlag)}
          >
            {/* 历史告警只有无关联选项 */}
            {
              this.props.target === 0 ?
              flagsByNewIncidents.map( (flag) => <Option key={flag.value} value={flag.value}>{flag.label}</Option> )
              :
              flagsByHistoryIncidents.map( (flag) => <Option key={flag.value} value={flag.value}>{flag.label}</Option> )
            }
          </Select>
        </FormItem>
      </div>
    )
  }
}

Basic.defaultProps = {
  target: Constants.DefaultBaseProps.target,
  base: Constants.DefaultBaseProps,
  time: Constants.DefaultTimeProps
}

Basic.propTypes = {
  target: PropTypes.number.isRequired,
  base: PropTypes.shape({
    ...Constants.BasePropTypes
  }),
  time: PropTypes.shape({
    ...Constants.TimePropTypes
  })
};

export default injectIntl(Basic);