import React, { Component, PureComponent } from 'react'
import { Form , Select, Button } from 'antd'
import styles from './customField.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { default as cls } from 'classnames';
import { getUUID } from '../../../../utils/index'
import _ from 'lodash'
// ------------- customer Component ----------------- //
import Prefix from '../../FormMaterial/prefix.js'
import CTMCascader from '../../FormMaterial/cascader.js'
import CTMTitle from '../../FormMaterial/title.js'
import CTMTicketDesc from '../../FormMaterial/ticketDesc.js'
import CTMDateTime from '../../FormMaterial/dateTime.js'
import CTMDateTimeInterval from '../../FormMaterial/dateTimeInterval.js'
import CTMFloat from '../../FormMaterial/float.js'
import CTMInt from '../../FormMaterial/int.js'
import CTMListSel from '../../FormMaterial/listSel.js'
import CTMMultiRowText from '../../FormMaterial/multiRowText.js'
import CTMMultSel from '../../FormMaterial/multiSel.js'
import CTMSingleSel from '../../FormMaterial/singleSel.js'
import CTUrgentLevel from '../../FormMaterial/urgentLevel.js'
import CTMSingleRowText from '../../FormMaterial/singleRowText.js'
import WrapperUser from '../../FormMaterial/user.js'
// -------------- Executors ------------------------ //
import Executor from '../../FormMaterial/executor.js'

let defaultObj = {}
let defaultArr = []
const FormItem = Form.Item
const itsmLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
};
const childItemLayout = {
    wrapperCol: { span: 24 }
}
const activityVOsLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
}

const Option = Select.Option
/**
 * 根据code或者type查询需要渲染的工单类型
 * @param { item } 后台数据
 * @param { extra } 额外的渲染数据
 * @param { index } 数组的index
 * @return { ReactElement } 返回的React元素
 */
function findType(item, extra, index) {
  const diliver = {
    getFieldDecorator: extra.form.getFieldDecorator,
    item,
    formItemLayout: extra.formItemLayout,
    prop: extra.prop ? extra.prop : {},
    disabled: item.isRequired === 2 ? true : false, // 是否是只读, 2 --> readOnly, 1 --> required, 0 --> notRequired
    isNeedVars: extra.isNeedVars
  }

  function insertVar(type, item) {
    let value = extra.form.getFieldValue(type) || ''
    extra.form.setFieldsValue({
      [type]: value += '${' + item + '}'
    })
  }

  function vars(type) {
    const vars = extra.vars;
    return (
        <div className={styles.varList}>
            {vars.map(item => <span key={`${'${'}${item}${'}'}`} onClick={insertVar.bind(null, type, item)}>{item}</span>)}
        </div>
    );
  }

  //工单标题
  if (item.code === 'title') {
    return (
      <CTMTitle key={ item.code } {...diliver} vars={ diliver.isNeedVars ? vars(item.code) : null } />
    )
  }
  //优先级
  if (item.code === 'urgentLevel') {
    return (
      <CTUrgentLevel key={ item.code } {...diliver} />
    )
  }
  if (item.type === 'singleRowText' && item.code !== 'title') {
    return (
      <CTMSingleRowText key={ item.code } {...diliver} vars={ diliver.isNeedVars ? vars(item.code) : null } />
    )
  }
  if (item.type === 'multiRowText' && item.code !== 'ticketDesc') {
    return (
      <CTMMultiRowText key={ item.code } {...diliver} vars={ diliver.isNeedVars ? vars(item.code) : null } />
    )
  }
  if (item.type === 'listSel') {
    return (
      <CTMListSel key={ item.code } {...diliver} />
    )
  }
  if (item.type === 'singleSel' && item.code !== 'urgentLevel') {
    return (
      <CTMSingleSel key={ item.code } {...diliver} />
    )
  }
  //多选
  if (item.type === 'multiSel') {
    return (
      <CTMMultSel key={ item.code } {...diliver} />
    )
  }
  //整数
  if (item.type === 'int') {
    return (
      <CTMInt key={ item.code } {...diliver} />
    )
  }
  //小数
  if (item.type === 'double') {
    return (
      <CTMFloat key={ item.code } {...diliver} />
    )
  }
  if (item.type === 'dateTimeInterval') {
    return (
      <CTMDateTimeInterval key={ item.code } {...diliver} />
    )
  }
  if (item.type === 'dateTime') {
    return (
      <CTMDateTime key={ item.code } {...diliver} />
    )
  }
  if (item.type === 'user') {
    // 这里为了让user组件每次渲染保证initValue就是value
    return (
      <WrapperUser key={ item.code } {...diliver} />
    )
  }
  //级联
  if (item.type === 'cascader') {
    return (
      <CTMCascader key={ item.code } {...diliver} />
    )
  }
  //工单描述
  if (item.code === 'ticketDesc') {
    return (
      <CTMTicketDesc key={ item.code } {...diliver} vars={ diliver.isNeedVars ? vars(item.code) : null } />
    )
  }
  return null
}

/**
 * 配置项前缀组件
 * @return { ReactElement } 返回的React元素
 */
function prefix(item, extra, index, options = [], opt = {}) {
  const props = {
    key: item.code,
    item,
    options,
    changeUper: opt.update || (() => {}),
    delUper: opt.dele || (() => {})
  }
  let child = findType(item, extra, index)
  return (
    React.isValidElement(child) ?
    <Prefix
      {...props}
    >
      { child }
    </Prefix>
    : null
  )
}

/**
 * 根据activityVOs渲染执行人
 * @param { item } activityVOs数据
 * @param { extra } 额外的渲染数据
 * @return { ReactElement } 返回的React元素
 */
function findActivityVOs(item, extra) {

  const diliver = {
    item,
    getFieldDecorator: extra.form.getFieldDecorator,
    prop: extra.prop ? extra.prop : {}
  }
  return (
    <Executor key={item.id} {...diliver}/>
  )
}

// -------------- Required ----------------------- //
class Required extends Component {
  constructor(props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
    this.prefix = prefix.bind(this)
  }

  renderItem(props) {
    let { data, form, vars } = props
    let extra = {
      form,
      formItemLayout: childItemLayout,
      vars: vars,
      isNeedVars: props.isNeedVars
    }
    return data.map((item, index) => {
      return this.prefix(item, {
        ...extra,
        prop: item.defaultValue ? { initialValue: item.defaultValue } : null
      }, index)
    }).filter(i => i !== null)
  }

  render() {
    return (
      this.props.data.length ?
      <div className={styles.required}>
        <p>{window.__alert_appLocaleData.messages['ITSMWrapper.isRequired']}</p>
        <div className={styles.content}>
          { this.renderItem(this.props) }
        </div>
      </div>
      : null
    )
  }
}

// -------------- NotRequired -------------------- //
class NotRequired extends Component {
  constructor(props) {
    super(props)
    this.renderItem = this.renderItem.bind(this)
    this.prefix = prefix.bind(this)
    this.diffence = this.diffence.bind(this)
    this.state = {
      req: props.data.filter(i => i.defaultValue) || [], //用户选择的
      options: this.props.data || []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      // 类型更改时的重置
      this.setState({
        req: nextProps.data.filter(i => i.defaultValue) || [], //用户选择的,
        options: nextProps.data
      })
    }
  }

  diffence(all, less) {
    return all.filter((option) => {
      let status = true;
      for(let i = 0; i < less.length; i++) {
        if (_.isEqual(option, less[i])) {
          status = false;
          break;
        }
      }
      return status
    })
  }

  add() {
    let _copyReq = _.cloneDeep(this.state.req)
    let _copyOptions = _.cloneDeep(this.state.options)
    _copyOptions = this.diffence(_copyOptions, _copyReq)
    let first = _copyOptions.shift()
    _copyReq.push(first)
    this.setState({
      req: _copyReq
    })
  }

  update(index, value) {
    let _options = _.cloneDeep(this.state.options)
    let _req = _.cloneDeep(this.state.req)
    for(let i = 0; i < _options.length; i++) {
      if (_options[i]['code'] === value) {
        _req[index] = _options[i];;
        break;
      }
    }
    this.setState({
      req: _req
    })
  }

  dele(index) {
    let _req = _.cloneDeep(this.state.req)
    this.setState({
      req: _req.filter((it, iti) => iti !== index)
    })
  }

  renderItem(props) {
    let { form, vars } = props
    let extra = {
      form,
      formItemLayout: childItemLayout,
      vars: vars,
      isNeedVars: props.isNeedVars
    }
    return this.state.req.map( (item, index) => {
      let options = this.diffence(this.state.options, this.state.req)
      options.push(item)
      let opt = {
        update: this.update.bind(this, index),
        dele: this.dele.bind(this, index)
      }
      return this.prefix(item, {
        ...extra,
        prop: item.defaultValue ? { initialValue: item.defaultValue } : null
      }, index, options, opt)
    })
  }

  render() {
    return (
      this.props.data.length ?
      <div className={styles.notRequired}>
        <p>{window.__alert_appLocaleData.messages['ITSMWrapper.isNotRequired']}</p>
        <div className={styles.content}>
          { this.renderItem(this.props) }
          {
            this.state.options.length > this.state.req.length ?
            <Button type="primary" onClick={this.add.bind(this)}>+&nbsp;{window.__alert_appLocaleData.messages['ITSMWrapper.create.moreFields']}</Button>
            :
            null
          }
          {/*<i className={styles.addUper} onClick={this.add.bind(this)}>+</i><span>更多字段</span>*/}
        </div>
      </div>
      : null
    )
  }
}

// -------------- Executors --------------------- //
class Executors extends Component {
  constructor(props) {
    super(props)
    this.renderActivityVOs = this.renderActivityVOs.bind(this)
    this.findActivityVOs = findActivityVOs.bind(this)
  }

  renderActivityVOs(props) {
    let { data, form } = props
    let extra = {
      form,
      formItemLayout: activityVOsLayout,
    }
    return data.map(item => {
      return this.findActivityVOs(item, {
        ...extra,
        prop: item.defaultValue ? { initialValue: item.defaultValue } : null
      })
    })
  }

  render() {
    return (
      this.props.data.length ?
      <div className={styles.executors}>
        <p>{window.__alert_appLocaleData.messages['ITSMWrapper.executors']}</p>
        <div className={styles.exeContent}>
          { this.renderActivityVOs(this.props) }
        </div>
      </div>
      : null
    )
  }
}

class CustomField extends Component {
  constructor(props) {
    super(props)
    this.slice = this.slice.bind(this)
    this.state = {
      result: this.slice(props.params || defaultObj)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params !== this.props.params) {
      this.props.form.resetFields()
      this.setState({
        result: this.slice(nextProps.params || defaultObj)
      })
    }
  }

  static propTypes = {
    types: React.PropTypes.array.isRequired,
    type: React.PropTypes.string,
    params: React.PropTypes.object.isRequired,
    changeType: React.PropTypes.func.isRequired
  }
  static defaultProps = {
    types: [],
    type: undefined,
    changeType: () => {},
    params: {}
  }
  // 切割数据必选和非必选的数据
  slice(params) {
    let required = []
    let notRequired = []
    params.form !== undefined && (
      required = params.form.filter(param => {
        (param.isRequired !== 1 && notRequired.push(param)) // 只读也归为非必选
        return param.isRequired === 1
      }) || []
    )
    return {
      required: required,
      notRequired: notRequired,
      executors: params.activityVOs || []
    }
  }

  render() {
    return (
      <Form>
        <div className={styles.ITSMMapper} >
          <FormItem
              {...itsmLayout}
              label={this.props.titlePlacholder}
          >
              <Select
                  getPopupContainer={ () => {
                    return document.getElementById("content") || document.body
                  } }
                  style={{ width: 100 }}
                  placeholder={ this.props.titlePlacholder }
                  value={ this.props.type }
                  onChange={ this.props.changeType }
              >
                  {
                      this.props.types.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                  }
              </Select>
              { this.props.tip ? <em className={styles.tip}>{ this.props.tip }</em> : undefined }
          </FormItem>
          { React.cloneElement(<Required />, {
            data: this.state.result.required || defaultArr,
            vars: this.props.vars,
            isNeedVars: this.props.isNeedVars,
            form: this.props.form
          }) }
          { React.cloneElement(<NotRequired />, {
            data: this.state.result.notRequired || defaultArr,
            vars: this.props.vars,
            isNeedVars: this.props.isNeedVars,
            form: this.props.form
          }) }
          { React.cloneElement(<Executors />, {
            data: this.state.result.executors || defaultArr,
            form: this.props.form
          })}
        </div>
      </Form>
    )
  }
}

export default Form.create()(CustomField)