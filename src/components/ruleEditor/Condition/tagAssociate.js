import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
import { Form, message, InputNumber, Input, Select, Row, Col } from 'antd'
import { getUUID } from '../../../utils/index.js'
//import PureRender from '../../../utils/PureRender.js'
import { injectIntl, defineMessages } from 'react-intl';
import * as ruleEditorServices from '../service.js'
import * as Services from '../../../services/alertTags.js'
import Gradation from './gradation.js'
import SearchBuilder from '../../common/tagSearchBuilder/index.js'
import styles from './index.less'

const FormItem = Form.Item
const Option = Select.Option
const desLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 }
}
const newLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10, offset: 1 }
}
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

class TagAssociate extends Component {
  constructor(props) {
    super(props)
    // value Selector 一页加载数量
    this.pageSize = 10
    // 绑定一系列事件
    this.queryKeysByServices = this.queryKeysByServices.bind(this)
    this.queryValuesByServices = this.queryValuesByServices.bind(this)
    this.openKeyBuilder = this.openKeyBuilder.bind(this)
    this.changeKeyHandler = this.changeKeyHandler.bind(this)
    this.queryValue = this.queryValue.bind(this)
    this.selectorValueToChecked = this.selectorValueToChecked.bind(this)
    this.changeValueHandler = this.changeValueHandler.bind(this)
    this.removeValueHandler = this.removeValueHandler.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.conditionToBuilderProps = this.conditionToBuilderProps.bind(this)

    this.state = {
      currentPage: 1,
      extraSeverity: false, // newSeverity 是否具有额外的选项
      allkeys: [], // 存放key的原始数据
      allvalues: [], // 存放values的数据（包装过checked属性）
    }
  }

  componentDidMount() {
    // 因为在编辑时valueArray无法获取到keyName作为显示，所以这里得调一次查询
    this.queryKeysByServices((allkeys) => {
      this.setState({ allkeys })
    })
  }

  changeFields(type, value) {
    switch(type) {
      case 'timeWindow':
        if (typeof value === 'number') {
          this.props.changeCondition(this.props._type, type, Number(value))
        }
        break;
      case 'newObject':
        this.props.changeCondition(this.props._type, type, value.target.value)
        break;
      case 'newName':
        this.props.changeCondition(this.props._type, type, value.target.value)
        break;
      case 'newSeverity':
        this.props.changeCondition(this.props._type, type, value)
        break;
      case 'newDescription':
        this.props.changeCondition(this.props._type, type, value.target.value)
        break;
      default:
        break;
    }
  }

  // 一个将props.condition.tags中内容映射到SearchBuilder参数的一个方法
  conditionToBuilderProps(selectors) {
    let keyArray, valueArray = []
    let selectKeys = selectors.map( selector => selector.key )
    keyArray = this.state.allkeys.map(key => {
      key.checked = false
      selectKeys.forEach(selectKey => {
        if (selectKey === key.key) key.checked = true
      })
      return key
    })
    if (this.state.allkeys.length) { // key有长度时
      valueArray = selectKeys.map(key => {
        let obj = {}
        for (let instance of this.state.allkeys) {
          if (key === instance.key) {
            obj.key = instance.key
            obj.keyName = instance.keyName
            for (let selector of selectors) {
              if (selector.key === key) {
                obj.values = selector.value.split(',').filter(i => i !== '')
                break;
              }
            }
            break;
          }
        }
        return obj
      })
    }
    return { keyArray, valueArray }
  }

  // 打开keybuilder触发
  openKeyBuilder(openSelector) { // callback 获取值后的回调open
    if (!this.state.allkeys.length) { // 只有当 allKeys 为空时才调用
      this.queryKeysByServices((allkeys) => {
        this.setState({ allkeys }, openSelector)
      })
    }
  }

  // key 值改变时触发
  changeKeyHandler(selector) {
    let _Tags = _.cloneDeep(this.props.condition.tags)
    if (selector.checked) {
      _Tags = _Tags.filter(tag => tag.key !== selector.key)
    } else {
      _Tags.push({
        key: selector.key,
        keyName: selector.keyName,
        value: ''
      })
    }
    this.props.changeCondition(this.props._type, 'tags', _Tags)
  }

  // 将已经选择的value在选项中checked判断
  selectorValueToChecked(key, allvalues) {
    for (let instance of this.props.condition.tags) {
      if (instance.key === key) {
        for (let selector of instance.value.split(',').filter(i => i !== '')) {
          for (let value of allvalues) {
            if (value.value == selector) {
              value.checked = true
            }
          }
        }
      }
    }
  }

  cbToQueryValue(key, openSelector, allvalues) {
    // 在最前面加* // 依据格式 { id, key, value }
    allvalues.unshift({
      key,
      id: getUUID(16),
      value: '*'
    })
    this.selectorValueToChecked(key, allvalues)
    this.setState({
      allvalues,
      currentPage: 1
    }, openSelector)
  }

  cbToLoadMore(key, currentPage, allvalues) {
    let currentValues = [...this.state.allvalues]
    this.selectorValueToChecked(key, allvalues)
    currentValues.push(allvalues)
    this.setState({
      allvalues: currentValues,
      currentPage
    })
  }

  // 查询selectList的值
  queryValue(key, message, openSelector = () => {}) {
    this.queryValuesByServices({
      key,
      value: message,
      currentPage: 1,
      pageSize: this.pageSize
    }, this.cbToQueryValue.bind(this, key, openSelector))
  }

  // loadMore
  loadMore(key, message) {
    this.queryValuesByServices({
      key,
      value: message,
      currentPage: this.state.currentPage + 1,
      pageSize: this.pageSize
    }, this.cbToLoadMore.bind(this, key, this.state.currentPage + 1))
  }

  // value 改变时触发
  changeValueHandler(selector) {
    let key = selector.field
    let target = selector.item
    let extraSeverity = _.cloneDeep(this.state.extraSeverity)
    let _condition = _.cloneDeep(this.props.condition)
    for (let instance of _condition.tags) {
      if (instance.key === key) {
        let array = instance.value.split(',').filter(i => i !== '')
        if (array.includes(target.value)) {
          if (target.value === '*') {
            // 移除newObject newName newSeverity等
            let regexp = new RegExp(`[A-Za-z0-9_\\u3E00-\\u9FA5]{${key.length}}\\:\\*`, 'g')
            _condition.newObject = _condition.newObject.replace(regexp, '')
            _condition.newName = _condition.newName.replace(regexp, '')
            _condition.newSeverity = undefined
            _condition.newDescription = _condition.newDescription.replace(regexp, '')
            extraSeverity = false
          }
          instance.value = array.filter(item => item !== target.value).join(',')
        } else {
          if (target.value === '*') {
            // 移除其他标签的 * 并增加newObject newName newSeverity等
            for (let other of _condition.tags) {
              if (other.key !== key) other.value = other.value.split(',').filter(i => i !== '' && i !== '*').join(',')
            }
            _condition.newObject = `${key}:*`
            _condition.newName = `${key}:*`
            _condition.newSeverity = `*`
            _condition.newDescription = `${key}:*`
            extraSeverity = { label: `${key}:*`, value: '*' }
            // -------------------------------------------------------
            array.unshift(target.value)
          } else {
            array.push(target.value)
          }
          instance.value = array.join(',')
        }
      }
    }
    let _allvalues = this.state.allvalues.map( value => {
      if (value.value === target.value) {
        if (typeof value.checked === 'undefined') {
          value.checked = true;
        } else {
          delete value.checked
        }
      }
      return value
    })
    // 这个地方做的不太好
    this.props.changeCondition(this.props._type, _condition)
    this.setState({ allvalues: _allvalues, extraSeverity })
  }

  // value 移除时触发
  removeValueHandler(selector) {
    let extraSeverity = _.cloneDeep(this.state.extraSeverity)
    let _condition = _.cloneDeep(this.props.condition)
    _condition.tags = _condition.tags.map(instance => {
      if (instance.key == selector.field) {
        if (selector.name === '*') {
          // 移除newObject newName newSeverity等
          let regexp = new RegExp(`[A-Za-z0-9_\\u3E00-\\u9FA5]{${selector.field.length}}\\:\\*`, 'g')
          _condition.newObject = _condition.newObject.replace(regexp, '')
          _condition.newName = _condition.newName.replace(regexp, '')
          _condition.newSeverity = undefined
          _condition.newDescription = _condition.newDescription.replace(regexp, '')
          extraSeverity = false
        }
        let array = instance.value.split(',').filter(i => i !== '')
        let newValue = array.filter(child => {
          return selector.name != child
        })
        instance.value = newValue.join(',')
      }
      return instance
    })
    let _allvalues = this.state.allvalues.map( value => {
      if (value.value === selector.name) {
        delete value.checked
      }
      return value
    })
    this.props.changeCondition(this.props._type, _condition)
    this.setState({ allvalues: _allvalues, extraSeverity })
  }

  // 查询key选择器的可选值
  queryKeysByServices(callback) {
    Services.getAllTagsKey().then( allkeys => {
      if (allkeys.result) {
        callback(allkeys.data)
      } else {
        message.error(allkeys.message, 3)
      }
    })
  }

  // 根据key value查询下拉选项
  queryValuesByServices(params, callback) {
    Services.getTagValues({...params}).then( allvalues => {
      if (allvalues.result) {
        callback(allvalues.data)
      } else {
        message.error(allvalues.message, 3)
      }
    })
  }

  render() {
    let { _type, condition, changeCondition, codewords, intl: {formatMessage} } = this.props

    let { keyArray, valueArray } = this.conditionToBuilderProps(condition.tags)
    let { allvalues } = this.state

    let gradationProps = {
      _type,
      _key: 'ruleData',
      condition: condition.ruleData,
      changeCondition,
      codewords
    }

    return (
      <div className={styles.aboutTag}>
        <Gradation {...gradationProps}/>
        <FormItem
          label={window.__alert_appLocaleData.messages['ruleEditor.tagsFilter']}
          required
          {...desLayout}
        >
          <SearchBuilder
            className={styles.searchBuilder}
            keyLabel={<p className={styles.keyLabel}>{window.__alert_appLocaleData.messages['ruleEditor.tagsFilter']}</p>}
            openKeyBuilder={this.openKeyBuilder}
            changeKeyHandler={this.changeKeyHandler}
            queryValue={this.queryValue}
            changeValueHandler={this.changeValueHandler}
            removeValueHandler={this.removeValueHandler}
            loadMore={this.loadMore}
            keyArray={ keyArray }
            selectList={ allvalues }
            valueArray={ valueArray }
          />
        </FormItem>
        <FormItem
          label={window.__alert_appLocaleData.messages['ruleEditor.timeWindow']}
          {...desLayout}
        >
          <InputNumber value={condition.timeWindow} min={1} max={1440} step={1} onChange={this.changeFields.bind(this, 'timeWindow')}/>
          <span className={styles.mins}>{window.__alert_appLocaleData.messages['ruleEditor.timeWindow.mins']}</span>
          <span className={styles.notify}>{window.__alert_appLocaleData.messages['ruleEditor.timeWindow.notify']}</span>
        </FormItem>
        <FormItem
          label={window.__alert_appLocaleData.messages['ruleEditor.genertorNewIncident']}
          {...desLayout}
          wrapperCol={{span: 15}}
        >
          <div className={styles.newIncident}>
            {
              ruleEditorServices.wrapperValidator({
                code: 'newObject',
                param: condition.newObject,
                trigger: 'onChange',
                itemProps: {
                  ...newLayout,
                  required: true,
                  label: window.__alert_appLocaleData.messages['ruleEditor.new.entityName'],
                  rules: [
                    { type: 'string', required: true, message: formatMessage({ ...localeMessage['inputNotify'] }, { field: window.__alert_appLocaleData.messages['ruleEditor.new.entityName'] }) },
                    { type: 'string', max: 20, message: formatMessage({ ...localeMessage['maxFieldLength'] }, { field: window.__alert_appLocaleData.messages['ruleEditor.new.entityName'], length: '20' }) }
                  ]
                }
              })(
                <Input
                  style={{ width: 200 }}
                  placeholder={window.__alert_appLocaleData.messages['ruleEditor.new.entityName.placeholder']}
                  value={condition.newObject}
                  onChange={this.changeFields.bind(this, 'newObject')}
                />
              )
            }
            {
              ruleEditorServices.wrapperValidator({
                code: 'newName',
                param: condition.newName,
                trigger: 'onChange',
                itemProps: {
                  ...newLayout,
                  required: true,
                  label: window.__alert_appLocaleData.messages['ruleEditor.new.name'],
                  rules: [
                    { type: 'string', required: true, message: formatMessage({ ...localeMessage['inputNotify'] }, { field: window.__alert_appLocaleData.messages['ruleEditor.new.name'] }) },
                    { type: 'string', max: 20, message: formatMessage({ ...localeMessage['maxFieldLength'] }, { field: window.__alert_appLocaleData.messages['ruleEditor.new.name'], length: '20' }) }
                  ]
                }
              })(
                <Input
                  style={{ width: 200 }}
                  placeholder={window.__alert_appLocaleData.messages['ruleEditor.new.name.placeholder']}
                  value={condition.newName}
                  onChange={this.changeFields.bind(this, 'newName')}
                />
              )
            }
            {
              ruleEditorServices.wrapperValidator({
                code: 'newSeverity',
                param: condition.newSeverity,
                trigger: 'onChange',
                itemProps: {
                  ...newLayout,
                  required: true,
                  label: window.__alert_appLocaleData.messages['ruleEditor.new.severity'],
                  rules: [
                    { type: 'string', required: true, message: formatMessage({ ...localeMessage['inputNotify'] }, { field: window.__alert_appLocaleData.messages['ruleEditor.new.severity'] }) }
                  ]
                }
              })(
                <Select
                  style={{ width: 200 }}
                  placeholder={window.__alert_appLocaleData.messages['ruleEditor.new.severity.placeholder']}
                  getPopupContainer={() => document.getElementById("content") || document.body }
                  value={condition.newSeverity}
                  onChange={this.changeFields.bind(this, 'newSeverity')}
                >
                  {
                    this.state.extraSeverity ?
                    <Option value={this.state.extraSeverity.value}>{this.state.extraSeverity.label}</Option>
                    : []
                  }
                  <Option value="3">{window['_severity']['3']}</Option>
                  <Option value="2">{window['_severity']['2']}</Option>
                  <Option value="1">{window['_severity']['1']}</Option>
                  <Option value="0">{window['_severity']['0']}</Option>
                </Select>
              )
            }
            <FormItem
              {...newLayout}
              label={window.__alert_appLocaleData.messages['ruleEditor.new.description']}
            >
              <Input
                style={{ width: 400 }}
                placeholder={window.__alert_appLocaleData.messages['ruleEditor.new.description.placeholder']}
                type='textarea'
                autosize={{ minRows: 2, maxRows: 2 }}
                value={condition.newDescription}
                onChange={this.changeFields.bind(this, 'newDescription')}
              />
            </FormItem>
          </div>
        </FormItem>
      </div>
    )
  }
}

export default injectIntl(TagAssociate)