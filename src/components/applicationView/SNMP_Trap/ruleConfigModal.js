import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col, Input, Table, Popover, Radio } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Regex from './regex.js'

const Item = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const initalState = {
  filterFields: [{ 'key': undefined, 'ruleMatch': '3', 'value': undefined }],
  matchFields: [{ 'oid': undefined, 'matchProp': undefined, 'regex': '', 'hexType': '', 'isSpread': false }],
  properties: [{ 'oid': undefined, 'code': undefined, 'name': undefined, 'regex': '', 'hexType': '', 'isSpread': false }],
  groupFieldsList: [{ 'field': undefined, 'compose': undefined }],
  levelList: [{ 'trap': undefined, 'severity': undefined }],
  matchRegexIndex: false, // 丰富正则校验
  enrichRegexIndex: false, // 丰富正则校验
  matchRegex: {
    hexType: 1,
    hexValue: undefined,
    value: undefined,
    regex: '',
    result: undefined
  }, // 1 --> 普通， 2 --> 16进制， 3 --> 整形， 4 --> IP
  propertyRegex: {
    hexType: 1,
    hexValue: undefined,
    value: undefined,
    regex: '',
    result: undefined
  }
}

class ruleModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: 1,
      mergeKey: '',
      identifyKey: '',
      _fields: [],
      __groupComposeProps: [],
      __mergeProps: [],
      __identifyProps: [],
      ...initalState
    }

    this.haveOIDChildrenList = false; // Trap OID + 精确匹配时 --> true
    // ---------------------------------------------------------
    this.getOptions = this.getOptions.bind(this)
    this.replaceFunc = this.replaceFunc.bind(this)
    this.renderRegexPage = this.renderRegexPage.bind(this)
    this.renderOIDSelect = this.renderOIDSelect.bind(this)
    this.renderOIDInput = this.renderOIDInput.bind(this)
    this.renderChildren = this.renderChildren.bind(this)

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.snmpTrapRules.operateAppRules !== this.props.snmpTrapRules.operateAppRules) {
      let operate = _.cloneDeep(nextProps.snmpTrapRules.operateAppRules);
      this.setState({
        dataSource: operate.dataSource || 1,
        filterFields: operate.filterFields || initalState.filterFields,
        matchFields: operate.matchAttributes !== undefined && operate.matchAttributes.length !== 0 ? operate.matchAttributes : initalState.matchFields,
        properties: operate.properties !== undefined && operate.properties.length !== 0 ? operate.properties : initalState.properties,
        groupFieldsList: nextProps.snmpTrapRules.groupFieldsList.length !== 0 ? nextProps.snmpTrapRules.groupFieldsList : initalState.groupFieldsList,
        levelList: nextProps.snmpTrapRules.levelList.length !== 0 ? nextProps.snmpTrapRules.levelList : initalState.levelList,
        mergeKey: operate.mergeKey || '',
        identifyKey: operate.identifyKey || '',
        _fields: [],
        __groupComposeProps: [],
        __mergeProps: [],
        __identifyProps: [],
        matchRegexIndex: initalState.matchRegexIndex,
        enrichRegexIndex: initalState.enrichRegexIndex,
        matchRegex: initalState.matchRegex,
        propertyRegex: initalState.propertyRegex
      })
    }
    // 当16进制转换数据变换时
    if (nextProps.snmpTrapRules.dataToString !== this.props.snmpTrapRules.dataToString) {
      let _rule = _.cloneDeep(this.state);
      switch (nextProps.snmpTrapRules.dataToString.type) {
        case 'matchFields':
          this.setState({
            ..._rule,
            matchRegex: {
              ..._rule.matchRegex,
              value: nextProps.snmpTrapRules.dataToString.data,
            }
          })
          break;
        case 'properties':
          this.setState({
            ..._rule,
            propertyRegex: {
              ..._rule.propertyRegex,
              value: nextProps.snmpTrapRules.dataToString.data,
            }
          })
          break;
        default:
          break;
      }
    }
    if (nextProps.snmpTrapRules.validateResult !== this.props.snmpTrapRules.validateResult) {
      let _rule = _.cloneDeep(this.state);
      switch (nextProps.snmpTrapRules.validateResult.type) {
        case 'matchFields':
          this.setState({
            ..._rule,
            matchRegex: {
              ..._rule.matchRegex,
              result: nextProps.snmpTrapRules.validateResult.data
            }
          })
          break;
        case 'properties':
          this.setState({
            ..._rule,
            propertyRegex: {
              ..._rule.propertyRegex,
              result: nextProps.snmpTrapRules.validateResult.data
            }
          })
          break;
        default:
          break;
      }
    }
  }

  // 遍历替换当前值
  replaceFunc(data, targetIndex, key, targetValue) {
    //TODO
    let newData = data.map((item, itemIndex) => {
      if (targetIndex === itemIndex) { item[key] = targetValue }
      return item
    })
    return newData
  }

  // 获取填写内容的可选项
  getOptions(type) {
    let options = [];
    switch (type) {
      case 'Compose':
        this.state.matchFields.forEach((field) => {
          if (field['matchProp'] !== undefined)
            !options.includes(field['matchProp']) && options.push(field['matchProp'])
        })
        this.state.properties.forEach((field) => {
          if (field['code'] !== undefined && field['code'] !== '')
            !options.includes(field['code']) && options.push(field['code'])
        })
        break;
      case 'Merge':
        this.state.matchFields.forEach((field) => {
          if ((field['matchProp'] === 'name' || field['matchProp'] === 'entityName' || field['matchProp'] === 'entityAddr') && field['matchProp'] !== undefined)
            !options.includes(field['matchProp']) && options.push(field['matchProp'])
        })
        this.state.properties.forEach((field) => {
          if (field['code'] !== undefined && field['code'] !== '')
            !options.includes(field['code']) && options.push(field['code'])
        })
        this.state.groupFieldsList.forEach((field) => {
          if ((field['field'] === 'name' || field['field'] === 'entityName' || field['field'] === 'entityAddr') && field['field'] !== undefined)
            !options.includes(field['field']) && options.push(field['field'])
        })
        break;
      case 'Identify':
        this.state.matchFields.forEach((field) => {
          if ((field['matchProp'] === 'entityAddr' || field['matchProp'] === 'entityName') && field['matchProp'] !== undefined)
            !options.includes(field['matchProp']) && options.push(field['matchProp'])
        })
        this.state.properties.forEach((field) => {
          if (field['code'] !== undefined && field['code'] !== '')
            !options.includes(field['code']) && options.push(field['code'])
        })
        this.state.groupFieldsList.forEach((field) => {
          if ((field['field'] === 'entityAddr' || field['field'] === 'entityName') && field['field'] !== undefined)
            !options.includes(field['field']) && options.push(field['field'])
        })
        break;
      default:
        break;
    }
    return options
  }

  // 获取焦点时，筛选可选项
  onFocus({data, field, targetIndex, origin}) {
    let _new = [].concat(origin);
    this.state.dataSource === 2 && _new.push('severity')
    data.forEach((item, itemIndex) => {
      _new = _new.filter(dataItem => dataItem !== item[field])
      if (itemIndex === targetIndex && item[field] !== undefined) {
        _new.unshift(item[field])
      }
    })
    this.setState({ _fields: _new })
  }

  // 根据regex, colspan渲染Td的children
  renderChildren(record, children, colSpan) {
    if(typeof record['super'] === 'boolean') {
      return {
        children: children,
        props: {
          colSpan: colSpan
        }
      }
    } else {
      return children
    }
  }

  // 改变正则匹配的value
  changeRegexValue(type, value, target) {
    let hex = {};
    switch (type) {
      case 'matchFields':
        hex = _.cloneDeep(this.state.matchRegex)
        this.setState({ matchRegex: {
          ...hex,
          [target]: value,
          result: undefined
        } })
        break;
      case 'properties':
        hex = _.cloneDeep(this.state.propertyRegex)
        this.setState({ propertyRegex: {
          ...hex,
          [target]: value,
          result: undefined
        } })
        break;
      default:
        break;
    }
  }
  // 清除regex检验数据
  regexClear(type) {
    switch (type) {
      case 'matchFields':
        this.setState({
          matchRegex: initalState.matchRegex,
          matchRegexIndex: false
        })
        break;
      case 'properties':
        this.setState({
          propertyRegex: initalState.propertyRegex,
          enrichRegexIndex: false
        })
        break;
      default:
        break;
    }
  }

  // 保存Regex数据
  regexSave(type) {
    let _rule = _.cloneDeep(this.state)
    const regexIndex = type === 'matchFields' ? this.state.matchRegexIndex : this.state.enrichRegexIndex
    switch (type) {
      case 'matchFields':
        _rule.matchFields[regexIndex] = {
          ..._rule.matchFields[regexIndex],
          regex: this.state.matchRegex.regex,
          hexType: this.state.matchRegex.hexType === 2 ? '16' : ''
        }
        this.setState({
          matchFields: _rule.matchFields,
          matchRegexIndex: false,
          matchRegex: initalState.matchRegex
        })
        break;
      case 'properties':
         _rule.properties[regexIndex] = {
          ..._rule.properties[regexIndex],
          regex: this.state.propertyRegex.regex,
          hexType: this.state.propertyRegex.hexType === 2 ? '16' : ''
        }
        this.setState({
          properties: _rule.properties,
          enrichRegexIndex: false,
          propertyRegex: initalState.propertyRegex
        })
        break;
      default:
        break;
    }
  }

  // 渲染Regex页面
  renderRegexPage(type, dispatch) {

    return (
      <Regex
        type={type}
        hex={ type === 'matchFields' ? this.state.matchRegex : this.state.propertyRegex }
        changeValue={this.changeRegexValue.bind(this)}
        toggle16Radix={ (hexType, hexValue) => {
          dispatch({
            type: 'snmpTrapRules/toggle16Radix',
            payload: { type, hexType, hexValue }
          })
        }}
        validateRadix={ (value, regex) => {
          dispatch({
            type: 'snmpTrapRules/validateRadix',
            payload: { type, value: value, regex }
          })
        }}
        saveRegex={this.regexSave.bind(this)}
        clear={this.regexClear.bind(this)}
      />
    )
  }

  // 渲染OID Select形式的Td
  renderOIDSelect(text, record, index, field, oidChildrenList, toogleField) {
    return (
      <div>
        <div>
          <Select style={{width: '80%'}} getPopupContainer={() => document.getElementById("content")} mode='combobox' value={text} onChange={(value) => {
            //TODO
            var temp = value.split('_')
            if (temp[0] !== undefined) {
              let data = this.replaceFunc(this.state[field], index, 'oid', temp[0])
              this.setState({ [field]: [...data] })
            }
          } }>
            {
              oidChildrenList.length > 0 ? oidChildrenList.map((OID, oidIndex) => {
                return <Option key={oidIndex} value={`${OID.name}_${Math.random()}`}><span title={OID.description}>{OID.description}</span></Option>
              }) : []
            }
          </Select>
          <span className={styles.regex} onClick={ (e) => {
            e.stopPropagation();
            let data = this.replaceFunc(this.state[field], index, 'isSpread', !record['isSpread'])
            this.setState({ [field]: [...data] })
          }}>{window.__alert_appLocaleData.messages['modal.trap.regex']}</span>
        </div>
        {
          record['isSpread'] &&
          <div className={styles.extends}>
            <Input style={{width: '80%'}} value={record['regex']} readOnly onFocus={ () => {
              this.setState({[toogleField]: index })
            }}/>
            <span className={styles.clear} onClick={ (e) => {
              e.stopPropagation();
              let data = this.replaceFunc(this.state[field], index, 'regex', '')
              this.setState({ [field]: [...data] })
            }}>{window.__alert_appLocaleData.messages['modal.trap.regex.clear']}</span>
          </div>
        }
      </div>
    )
  }

  // 渲染OID Input形式的Td
  renderOIDInput(text, record, index, field, toogleField) {
    return (
      <div>
        <div>
          <Input style={{width: '80%'}} value={text} onChange={(e) => {
            let data = this.replaceFunc(this.state[field], index, 'oid', e.target.value)
            this.setState({ [field]: [...data] })
          } } />
          <span className={styles.regex} onClick={ (e) => {
            // 展开正则选择框
            e.stopPropagation();
            let data = this.replaceFunc(this.state[field], index, 'isSpread', !record['isSpread'])
            this.setState({ [field]: [...data] })
          }}>{window.__alert_appLocaleData.messages['modal.trap.regex']}</span>
        </div>
        {
          record['isSpread'] &&
          <div className={styles.extends}>
            <Input style={{width: '80%'}} value={record['regex']} readOnly onFocus={ () => {
              this.setState({[toogleField]: index })
            }}/>
            <span className={styles.clear} onClick={ (e) => {
              // 清除正则
              e.stopPropagation();
              let data = this.replaceFunc(this.state[field], index, 'regex', '')
              this.setState({ [field]: [...data] })
            }}>{window.__alert_appLocaleData.messages['modal.trap.regex.clear']}</span>
          </div>
        }
      </div>
    )
  }

  render() {
    const { snmpTrapRules, dispatch, okRule, closeModal, form, intl: {formatMessage} } = this.props;
    const { isShowTrapModal } = snmpTrapRules
    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const shanchuClass = classnames(
      'icon',
      'iconfont',
      'icon-anonymous-iconfont'
    )

    const composeClass = classnames(
      'icon',
      'iconfont',
      'icon-snmp'
    )

    const itemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 8 },
    }

    const localeMessage = defineMessages({
      modal_ok: {
        id: 'modal.ok',
        defaultMessage: '确定'
      },
      modal_cancel: {
        id: 'modal.cancel',
        defaultMessage: '取消'
      },
      addRule: {
        id: 'alertApplication.trap.newRule',
        defaultMessage: '添加规则'
      },
      modal_validating: {
        id: 'modal.validating',
        defaultMessage: '检验中...'
      },
      ruleName: {
        id: 'modal.trap.ruleName',
        defaultMessage: '规则名称'
      },
      ruleName_placeholder: {
        id: 'modal.trap.ruleName_placeholder',
        defaultMessage: '请输入规则名称'
      },
      ruleDescription: {
        id: 'modal.trap.ruleDescription',
        defaultMessage: '规则描述'
      },
      ruleDescription_placeholder: {
        id: 'modal.trap.ruleDescription_placeholder',
        defaultMessage: '请输入规则描述'
      },
      rule_dataSource: {
        id: 'modal.trap.dataSource',
        defaultMessage: '数据源'
      },
      rule_dataSource_netWork: {
        id: 'modal.trap.dataSource.netWork',
        defaultMessage: '网络设备'
      },
      rule_dataSource_thirdParty: {
        id: 'modal.trap.dataSource.thirdParty',
        defaultMessage: '第三方监控系统'
      },
      rule_filter: {
        id: 'modal.trap.filter',
        defaultMessage: '过滤条件:'
      },
      rule_filter_Exact: {
        id: 'modal.trap.filter.Exact',
        defaultMessage: '精确匹配'
      },
      rule_filter_Inexact: {
        id: 'modal.trap.filter.Inexact',
        defaultMessage: '模糊匹配'
      },
      rule_filter_Range: {
        id: 'modal.trap.filter.Range',
        defaultMessage: '范围'
      },
      rule_filter_Regular: {
        id: 'modal.trap.filter.Regular',
        defaultMessage: '正则表达式'
      },
      rule_Condition: {
        id: 'modal.trap.condition',
        defaultMessage: '添加条件'
      },
      rule_addRow: {
        id: 'modal.trap.addRow',
        defaultMessage: '添加行'
      },
      rule_fieldMatch: {
        id: 'modal.trap.fieldMatch',
        defaultMessage: '字段匹配:'
      },
      rule_fieldMatch_mapper: {
        id: 'modal.trap.fieldMatch.mapper',
        defaultMessage: '字段映射'
      },
      rule_expression: {
        id: 'modal.trap.expression',
        defaultMessage: '表达式'
      },
      rule_OID: {
        id: 'modal.trap.OID',
        defaultMessage: 'OID'
      },
      rule_action: {
        id: 'modal.trap.action',
        defaultMessage: '操作'
      },
      rule_action_edit: {
        id: 'modal.trap.action.edit',
        defaultMessage: '编辑'
      },
      rule_action_save: {
        id: 'modal.trap.action.save',
        defaultMessage: '保存'
      },
      rule_action_delete: {
        id: 'modal.trap.action.delete',
        defaultMessage: '删除'
      },
      rule_fieldEnrich: {
        id: 'modal.trap.fieldEnrich',
        defaultMessage: '字段扩展:'
      },
      rule_fieldEnrich_newField: {
        id: 'modal.trap.fieldEnrich.newField',
        defaultMessage: '新字段名'
      },
      rule_fieldEnrich_displayName: {
        id: 'modal.trap.fieldEnrich.displayName',
        defaultMessage: '显示名'
      },
      rule_fieldsComposition: {
        id: 'modal.trap.fieldsComposition',
        defaultMessage: '字段组合:'
      },
      rule_fieldsComposition_field: {
        id: 'modal.trap.fieldsComposition.field',
        defaultMessage: '字段'
      },
      rule_fieldsComposition_compose: {
        id: 'modal.trap.fieldsComposition.composition',
        defaultMessage: '组合'
      },
      rule_noSelectField: {
        id: 'modal.trap.noSelectField',
        defaultMessage: '没有可选字段'
      },
      rule_mergeKeys: {
        id: 'modal.trap.mergeKeys',
        defaultMessage: '归并关键字段'
      },
      rule_mergeKeys_message: {
        id: 'modal.trap.mergeKeys.message',
        defaultMessage: '指定合并告警的关键字段'
      },
      rule_IdentifyKeys: {
        id: 'modal.trap.identifyKeys',
        defaultMessage: '定位关键字段'
      },
      rule_IdentifyKeys_message: {
        id: 'modal.trap.identifyKeys.message',
        defaultMessage: '用于定位具体CI项的关键标识'
      },
      rule_severityMapper: {
        id: 'modal.trap.severityMapper',
        defaultMessage: '级别映射'
      },
      rule_severityMapper_severity: {
        id: 'modal.trap.severityMapper.severity',
        defaultMessage: '告警等级'
      },
      rule_severityMapper_placeholder: {
        id: 'modal.trap.severityMapper.placeholder',
        defaultMessage: '请输入告警级别'
      },
      rule_severityMapper_trap: {
        id: 'modal.trap.severityMapper.trap',
        defaultMessage: 'Trap级别'
      },
      rule_severityMapper_alert: {
        id: 'modal.trap.severityMapper.alert',
        defaultMessage: 'Alert级别'
      },
      rule_severityMapper_message: {
        id: 'modal.trap.severityMapper.message',
        defaultMessage: 'Alert级别定义：紧急 - 3，警告 - 2，提醒 - 1，正常 - 0'
      }
    })

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter} key={ 1 }>
      <Button type="primary" onClick={() => {
        okRule(this.state, form)
      } } ><FormattedMessage {...localeMessage['modal_ok']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={() => {
        closeModal()
      } }><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
    </div>
    )

    const filters = this.state.filterFields !== undefined && this.state.filterFields.length !== 0 && this.state.filterFields.map((filter, index) => {

      return (
        <li key={index}>
          <Select getPopupContainer={() => document.getElementById("content")} value={filter.key} onChange={(value) => {
            //TODO
            let data = this.replaceFunc(this.state.filterFields, index, 'key', value)
            this.setState({ filterFields: [...data] })
          } }>
            {
              this.props.snmpTrapRules.filterSource.length > 0 ? this.props.snmpTrapRules.filterSource.map((source, sourceIndex) => {
                return <Option key={sourceIndex} value={source}>{source}</Option>
              }) : []
            }
          </Select>
          <Select getPopupContainer={() => document.getElementById("content")} value={`${filter.ruleMatch}`} onChange={(value) => {
            //TODO
            let data = this.replaceFunc(this.state.filterFields, index, 'ruleMatch', value)
            this.setState({ filterFields: [...data] })
          } }>
            <Option value={'3'}>{formatMessage({ ...localeMessage['rule_filter_Exact'] })}</Option>
            <Option value={'2'}>{formatMessage({ ...localeMessage['rule_filter_Inexact'] })}</Option>
            <Option value={'4'}>{formatMessage({ ...localeMessage['rule_filter_Range'] })}</Option>
            <Option value={'1'}>{formatMessage({ ...localeMessage['rule_filter_Regular'] })}</Option>
          </Select>
          {
            this.state.filterFields[index]['ruleMatch'] === "3" && this.state.filterFields[index]['key'] === "Snmp TrapOID" ?
              <Select getPopupContainer={() => document.getElementById("content")} mode='combobox' style={{ width: '30%' }} value={filter.value} onChange={(value) => {
                //TODO
                let data = this.replaceFunc(this.state.filterFields, index, 'value', value)
                this.setState({ filterFields: [...data] })
              } }>
                {
                  this.props.snmpTrapRules.OIDList.length > 0 ? this.props.snmpTrapRules.OIDList.map((oid, oidIndex) => {
                    return <Option key={oidIndex} value={oid.oid}><span title={oid.oid}>{oid.oid}</span></Option>
                  }) : []
                }
              </Select>
              :
              <Input value={filter.value} onChange={(e) => {
                //TODO
                let data = this.replaceFunc(this.state.filterFields, index, 'value', e.target.value)
                this.setState({ filterFields: [...data] })
              } } />
          }
          {
            index !== 0 ?
              <i className={classnames(styles.shanChu, shanchuClass)} onClick={() => {
                //TODO
                let newFilters = this.state.filterFields.filter((item, itemIndex) => { return itemIndex !== index })
                this.setState({ filterFields: [...newFilters] })
              } }></i>
              :
              undefined
          }
        </li>
      )
    })

    this.haveOIDChildrenList = false;
    let oidChildrenList = [];
    let targetOIDList = [].concat(this.props.snmpTrapRules.OIDList);
    targetOIDList.length > 0 && this.state.filterFields.length > 0 && this.state.filterFields.forEach((filter, index) => {
      if (filter['ruleMatch'] === "3" && filter['key'] === 'Snmp TrapOID') {
        this.haveOIDChildrenList = true;
        targetOIDList = targetOIDList.filter((oid, oidIndex) => {
          let state = oid.oid === filter['value'];
          if (state) {
            Object.keys(oid.bindingOIDs).length > 0 && Object.keys(oid.bindingOIDs).forEach((key) => {
              oidChildrenList.push({ 'name': key, 'description': `${key} --> ${oid.bindingOIDs[key]}` })
            })
          }
          return !state;
        })
      }
    })

    return (
      <Modal
        title={<FormattedMessage {...localeMessage['addRule']} />}
        maskClosable="false"
        onCancel={closeModal}
        visible={isShowTrapModal}
        footer={modalFooter}
        width={850}
        >
        <div className={styles.ruleMain}>
          <Form className={styles.ruleForm}>
            <Item
              {...itemLayout}
              label={formatMessage({ ...localeMessage['ruleName'] })}
              help={isFieldValidating('ruleName') ? formatMessage({ ...localeMessage['modal_validating'] }) : (getFieldError('ruleName') || []).join(', ')}
              >
              {getFieldDecorator('ruleName', {
                rules: [
                  { required: true, message: formatMessage({ ...localeMessage['ruleName_placeholder'] }) }
                ]
              })(
                <Input placeholder={formatMessage({ ...localeMessage['ruleName_placeholder'] })}></Input>
                )}
            </Item>
            <Item
              {...itemLayout}
              wrapperCol={{ span: 20 }}
              label={formatMessage({ ...localeMessage['ruleDescription'] })}
              help={isFieldValidating('description') ? formatMessage({ ...localeMessage['modal_validating'] }) : (getFieldError('description') || []).join(', ')}
              >
              {getFieldDecorator('description', {
                rules: [
                  { required: true, message: formatMessage({ ...localeMessage['ruleDescription_placeholder'] }) }
                ]
              })(
                <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} placeholder={formatMessage({ ...localeMessage['ruleDescription_placeholder'] })}></Input>
                )}
            </Item>
            <Item
              {...itemLayout}
              wrapperCol={{ span: 12 }}
              label={formatMessage({ ...localeMessage['rule_dataSource'] })}
              >
              <RadioGroup onChange={(e) => {
                this.setState({ dataSource: e.target.value })
              } } value={this.state.dataSource}>
                <Radio value={1}>{formatMessage({ ...localeMessage['rule_dataSource_netWork'] })}</Radio>
                <Radio value={2}>{formatMessage({ ...localeMessage['rule_dataSource_thirdParty'] })}</Radio>
              </RadioGroup>
            </Item>
            <Item
              {...itemLayout}
              wrapperCol={{ span: 18 }}
              label={formatMessage({ ...localeMessage['rule_filter'] })}
              >
              <ul className={styles.filterContainer}>
                {filters}
              </ul>
              <div className={styles.addBtn}>
                <Button type="primary" className={styles.appBtn} onClick={() => {
                  //TODO
                  this.setState({
                    filterFields: [
                      ...this.state.filterFields,
                      { 'key': undefined, 'ruleMatch': '3', 'value': undefined }
                    ]
                  })
                } }><span>{formatMessage({ ...localeMessage['rule_Condition'] })}</span></Button>
              </div>
            </Item>
            {/*字段匹配*/}
            <Item
              {...itemLayout}
              wrapperCol={{ span: 20 }}
              label={formatMessage({ ...localeMessage['rule_fieldMatch'] })}
              >
              <Table
                className={styles.modalTable}
                columns={[
                  {
                    title: <FormattedMessage {...localeMessage['rule_OID']} />,
                    dataIndex: 'oid',
                    width: '300px',
                    key: 'oid',
                    render: (text, record, index) => {
                      let children = null;
                      record['super'] ?
                      children = this.renderRegexPage('matchFields', dispatch)
                      :
                      this.haveOIDChildrenList ?
                      children = this.renderOIDSelect(text, record, index, 'matchFields', oidChildrenList, 'matchRegexIndex')
                      :
                      children = this.renderOIDInput(text, record, index, 'matchFields', 'matchRegexIndex')

                      return this.renderChildren(record, children, 4)
                    }
                  },
                  {
                    title: <FormattedMessage {...localeMessage['rule_expression']} />,
                    key: 'expression',
                    render: (text, record, index) => {
                      let children = (
                        <span className={styles.expression}>=</span>
                      )
                      return this.renderChildren(record, children, 0)
                    }
                  },
                  {
                    title: <FormattedMessage {...localeMessage['rule_fieldMatch_mapper']} />,
                    dataIndex: 'matchProp',
                    key: 'matchProp',
                    render: (text, record, index) => {
                      let params = {
                        data: this.state.matchFields,
                        field: 'matchProp',
                        targetIndex: index,
                        origin: this.props.snmpTrapRules.matchProps
                      }
                      let children = (
                        <Select getPopupContainer={() => document.getElementById("content")} showSearch optionFilterProp="children" notFoundContent='Not Found' filterOption={(input, option) => {
                          return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        } } value={text} onFocus={this.onFocus.bind(this, params)} onChange={(value) => {
                          //TODO
                          let data = this.replaceFunc(this.state.matchFields, index, 'matchProp', value)
                          this.setState({ matchFields: [...data] })
                        } }>
                          {
                            this.state._fields.length > 0 ? this.state._fields.map((field, index) => {
                              return <Option key={index} value={field}>{field}</Option>
                            }) : []
                          }
                        </Select>
                      )
                      return this.renderChildren(record, children, 0)
                    }
                  },
                  {
                    title: <FormattedMessage {...localeMessage['rule_action']} />,
                    width: '135px',
                    key: 'operation',
                    render: (text, record, index) => {
                      let children = (
                        <span>
                          <Button size='small' className={styles.delBtn} onClick={() => {
                            //TODO
                            let newMatchFields = this.state.matchFields.filter((item, itemIndex) => { return itemIndex !== index })
                            this.setState({ matchFields: [...newMatchFields] })
                          } }>{formatMessage({ ...localeMessage['rule_action_delete'] })}</Button>
                        </span>
                      )
                      return this.renderChildren(record, children, 0)
                    }
                  }
                ]}
                rowKey={(record, index) => index}
                pagination={false}
                dataSource={ typeof this.state.matchRegexIndex === 'boolean' ? this.state.matchFields : [{'super': true}]}
                />
              <div className={styles.addBtn}>
                <Button type="primary" className={styles.appBtn} onClick={() => {
                  //TODO
                  this.setState({
                    matchFields: [
                      ...this.state.matchFields,
                      { 'oid': undefined, 'matchProp': undefined, 'regex': '', 'hexType': '', 'isSpread': false }
                    ]
                  })
                } }><span>{formatMessage({ ...localeMessage['rule_addRow'] })}</span></Button>
              </div>
            </Item>
            {/*字段扩展*/}
            <Item
              {...itemLayout}
              wrapperCol={{ span: 20 }}
              label={formatMessage({ ...localeMessage['rule_fieldEnrich'] })}
              >
              <Table
                className={styles.modalTable}
                columns={[
                  {
                    title: <FormattedMessage {...localeMessage['rule_OID']} />,
                    dataIndex: 'oid',
                    width: '250px',
                    key: 'oid',
                    render: (text, record, index) => {
                      let children = null;
                      record['super'] ?
                      children = this.renderRegexPage('properties', dispatch)
                      :
                      this.haveOIDChildrenList ?
                      children = this.renderOIDSelect(text, record, index, 'properties', oidChildrenList, 'enrichRegexIndex')
                      :
                      children = this.renderOIDInput(text, record, index, 'properties', 'enrichRegexIndex')

                      return this.renderChildren(record, children, 5)
                    }
                  },
                  {
                    title: <FormattedMessage {...localeMessage['rule_expression']} />,
                    width: '95px',
                    key: 'expression',
                    render: (text, record, index) => {
                      let children = (
                        <span className={styles.expression}>=</span>
                      )
                      return this.renderChildren(record, children, 0)
                    }
                  },
                  {
                    title: <FormattedMessage {...localeMessage['rule_fieldEnrich_newField']} />,
                    dataIndex: 'code',
                    key: 'code',
                    render: (text, record, index) => {
                      let children = (
                        <Input value={text} onChange={(e) => {
                          //TODO
                          let data = this.replaceFunc(this.state.properties, index, 'code', e.target.value)
                          this.setState({ properties: [...data] })
                        } } />
                      )
                      return this.renderChildren(record, children, 0)
                    }
                  },
                  {
                    title: <FormattedMessage {...localeMessage['rule_fieldEnrich_displayName']} />,
                    dataIndex: 'name',
                    key: 'name',
                    render: (text, record, index) => {
                      let children = (
                        <Input value={text} onChange={(e) => {
                          //TODO
                          let data = this.replaceFunc(this.state.properties, index, 'name', e.target.value)
                          this.setState({ properties: [...data] })
                        } } />
                      )
                      return this.renderChildren(record, children, 0)
                    }
                  },
                  {
                    title: <FormattedMessage {...localeMessage['rule_action']} />,
                    width: '135px',
                    key: 'operation',
                    render: (text, record, index) => {
                      let children = (
                        <span>
                          <Button size='small' className={styles.delBtn} onClick={() => {
                            //TODO
                            let data = this.state.properties.filter((property, itenIndex) => itenIndex !== index)
                            this.setState({ properties: [...data] })
                          } }>{formatMessage({ ...localeMessage['rule_action_delete'] })}</Button>
                        </span>
                      )
                      return this.renderChildren(record, children, 0)
                    }
                  }
                ]}
                rowKey={(record, index) => index}
                pagination={false}
                dataSource={typeof this.state.enrichRegexIndex === 'boolean' ? this.state.properties : [{'super': true}]}
                />
              <div className={styles.addBtn}>
                <Button type="primary" className={styles.appBtn} onClick={() => {
                  //TODO
                  this.setState({
                    properties: [
                      ...this.state.properties,
                      { 'oid': undefined, 'code': undefined, 'name': undefined, 'regex': '', 'hexType': '', 'isSpread': false}
                    ]
                  })
                } }><span>{formatMessage({ ...localeMessage['rule_addRow'] })}</span></Button>
              </div>
            </Item>
            {/*字段组合*/}
            <Item
              {...itemLayout}
              wrapperCol={{ span: 20 }}
              label={formatMessage({ ...localeMessage['rule_fieldsComposition'] })}
              >
              <Table
                className={styles.modalTable}
                columns={[
                  {
                    title: <FormattedMessage {...localeMessage['rule_fieldsComposition_field']} />,
                    dataIndex: 'field',
                    width: '150px',
                    key: 'field',
                    render: (text, record, index) => {
                      let params = {
                        data: this.state.groupFieldsList,
                        field: 'field',
                        targetIndex: index,
                        origin: this.props.snmpTrapRules.matchProps
                      }
                      return (
                        <Select getPopupContainer={() => document.getElementById("content")} showSearch optionFilterProp="children" notFoundContent='Not Found' filterOption={(input, option) => {
                          return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        } } value={text} onFocus={this.onFocus.bind(this, params)} onChange={(value) => {
                          //TODO
                          let data = this.replaceFunc(this.state.groupFieldsList, index, 'field', value)
                          this.setState({ groupFieldsList: [...data] })
                        } }>
                          {
                            this.state._fields.length > 0 ? this.state._fields.map((field, index) => {
                              return <Option key={index} value={field}>{field}</Option>
                            }) : []
                          }
                        </Select>
                      )
                    }
                  },
                  {
                    title: <FormattedMessage {...localeMessage['rule_fieldsComposition_compose']} />,
                    dataIndex: 'compose',
                    key: 'compose',
                    render: (text, record, index) => {
                      return (
                        <div className={styles.composeContainer}>
                          <Input value={text} onChange={(e) => {
                            //TODO
                            let data = this.replaceFunc(this.state.groupFieldsList, index, 'compose', e.target.value)
                            this.setState({ groupFieldsList: [...data] })
                          } } />
                          <Popover placement='bottomRight' overlayClassName={styles.popover} onClick={() => {
                            let options = this.getOptions('Compose')
                            this.setState({ __groupComposeProps: options })
                          } } trigger="click" content={
                            <div className={styles.popoverMain}>
                              {
                                this.state.__groupComposeProps.length > 0 ? this.state.__groupComposeProps.map((field, itemIndex) => {
                                  if (this.state.groupFieldsList[index]['compose'] !== undefined && this.state.groupFieldsList[index]['compose'].match(/\$\{\w*\}/g) !== null
                                    && this.state.groupFieldsList[index]['compose'].match(/\$\{\w*\}/g).includes(`$\{${field}\}`)) {
                                    return <span className={styles.selected} key={itemIndex} data-content={field} onClick={(e) => {
                                      e.stopPropagation();
                                      let value = this.state.groupFieldsList[index]['compose'].replace(`$\{${e.target.getAttribute('data-content')}\}`, '');
                                      //TODO
                                      let data = this.replaceFunc(this.state.groupFieldsList, index, 'compose', value)
                                      this.setState({ groupFieldsList: [...data] })
                                    } }>{field}</span>
                                  }
                                  return <span key={itemIndex} data-content={field} onClick={(e) => {
                                    e.stopPropagation();
                                    let value = `$\{${e.target.getAttribute('data-content')}\}`;
                                    if (this.state.groupFieldsList[index]['compose'] !== undefined)
                                      value = this.state.groupFieldsList[index]['compose'] + `$\{${e.target.getAttribute('data-content')}\}`;
                                    //TODO
                                    let data = this.replaceFunc(this.state.groupFieldsList, index, 'compose', value)
                                    this.setState({ groupFieldsList: [...data] })
                                  } }>{field}</span>
                                }) : <span className={styles.noData}>{formatMessage({ ...localeMessage['rule_noSelectField'] })}</span>
                              }
                            </div>
                          } >
                            <i className={classnames(styles.composeIcon, composeClass)}></i>
                          </Popover>
                        </div>

                      )
                    }
                  },
                  {
                    title: <FormattedMessage {...localeMessage['rule_action']} />,
                    width: '135px',
                    key: 'operation',
                    render: (text, record, index) => {
                      return (
                        <span>
                          <Button size='small' className={styles.delBtn} onClick={() => {
                            //TODO
                            let data = this.state.groupFieldsList.filter((item, itemIndex) => { return itemIndex !== index })
                            this.setState({ groupFieldsList: [...data] })
                          } }>{formatMessage({ ...localeMessage['rule_action_delete'] })}</Button>
                        </span>
                      )
                    }
                  }
                ]}
                rowKey={(record, index) => index}
                pagination={false}
                dataSource={this.state.groupFieldsList}
                />
              <div className={styles.addBtn}>
                <Button type="primary" className={styles.appBtn} onClick={() => {
                  //TODO
                  this.setState({
                    groupFieldsList: [
                      ...this.state.groupFieldsList,
                      { 'field': undefined, 'compose': undefined }
                    ]
                  })
                } }><span>{formatMessage({ ...localeMessage['rule_addRow'] })}</span></Button>
              </div>
            </Item>
            {/*归并*/}
            <Item
              {...itemLayout}
              label={formatMessage({ ...localeMessage['rule_mergeKeys'] })}
              wrapperCol={{ span: 18 }}
              >
              <div className={styles.mergeInput}>
                {getFieldDecorator('mergeKey', {})(
                  <div className={styles.composeContainer}>
                    <Input value={this.state.mergeKey} onChange={(e) => {
                      //TODO
                      this.setState({ mergeKey: e.target.value })
                    } } />
                    <Popover placement='bottomRight' overlayClassName={styles.popover} onClick={() => {
                      let options = this.getOptions('Merge');
                      this.setState({ __mergeProps: options })
                    } } trigger="click" content={
                      <div className={styles.popoverMain}>
                        {
                          this.state.__mergeProps.length > 0 ? this.state.__mergeProps.map((field, itemIndex) => {
                            if (this.state.mergeKey !== '' && this.state.mergeKey.match(/\$\{\w*\}/g) !== null && this.state.mergeKey.match(/\$\{\w*\}/g).includes(`$\{${field}\}`)) {
                              return <span className={styles.selected} key={itemIndex} data-content={field} onClick={(e) => {
                                //TODO
                                e.stopPropagation();
                                let value = this.state.mergeKey.replace(`$\{${e.target.getAttribute('data-content')}\}`, '');
                                this.setState({ mergeKey: value })
                              } }>{field}</span>
                            }
                            return <span key={itemIndex} data-content={field} onClick={(e) => {
                              //TODO
                              e.stopPropagation();
                              let value = `$\{${e.target.getAttribute('data-content')}\}`;
                              if (this.state.mergeKey !== '')
                                value = this.state.mergeKey + `$\{${e.target.getAttribute('data-content')}\}`;
                              this.setState({ mergeKey: value })
                            } }>{field}</span>
                          }) : <span className={styles.noData}>{formatMessage({ ...localeMessage['rule_noSelectField'] })}</span>
                        }
                      </div>
                    } >
                      <i className={classnames(styles.composeIcon, composeClass)}></i>
                    </Popover>
                  </div>
                )}
              </div>
              <span className={styles.mergeMessage}>{formatMessage({ ...localeMessage['rule_mergeKeys_message'] })}</span>
            </Item>
            {/*定位*/}
            <Item
              {...itemLayout}
              label={formatMessage({ ...localeMessage['rule_IdentifyKeys'] })}
              wrapperCol={{ span: 18 }}
              >
              <div className={styles.mergeInput}>
                {getFieldDecorator('identifyKey', {})(
                  <div className={styles.composeContainer}>
                    <Input value={this.state.identifyKey} onChange={(e) => {
                      //TODO
                      this.setState({ identifyKey: e.target.value })
                    } } />
                    <Popover placement='bottomRight' overlayClassName={styles.popover} onClick={() => {
                      let options = this.getOptions('Identify')
                      this.setState({ __identifyProps: options })
                    } } trigger="click" content={
                      <div className={styles.popoverMain}>
                        {
                          this.state.__identifyProps.length > 0 ? this.state.__identifyProps.map((field, itemIndex) => {
                            if (this.state.identifyKey !== '' && this.state.identifyKey.match(/\$\{\w*\}/g) !== null && this.state.identifyKey.match(/\$\{\w*\}/g).includes(`$\{${field}\}`)) {
                              return <span className={styles.selected} key={itemIndex} data-content={field} onClick={(e) => {
                                //TODO
                                e.stopPropagation();
                                let value = this.state.identifyKey.replace(`$\{${e.target.getAttribute('data-content')}\}`, '');
                                this.setState({ identifyKey: value })
                              } }>{field}</span>
                            }
                            return <span key={itemIndex} data-content={field} onClick={(e) => {
                              //TODO
                              e.stopPropagation();
                              let value = `$\{${e.target.getAttribute('data-content')}\}`;
                              if (this.state.identifyKey !== '')
                                value = this.state.identifyKey + `$\{${e.target.getAttribute('data-content')}\}`;
                              this.setState({ identifyKey: value })
                            } }>{field}</span>
                          }) : <span className={styles.noData}>{formatMessage({ ...localeMessage['rule_noSelectField'] })}</span>
                        }
                      </div>
                    } >
                      <i className={classnames(styles.composeIcon, composeClass)}></i>
                    </Popover>
                  </div>
                )}
              </div>
              <span className={styles.mergeMessage}>{formatMessage({ ...localeMessage['rule_IdentifyKeys_message'] })}</span>
            </Item>
            {/*等级映射*/}
            {
              this.state.dataSource == 1 ?
                <Item
                  {...itemLayout}
                  label={formatMessage({ ...localeMessage['rule_severityMapper_severity'] })}
                  help={isFieldValidating('severity') ? formatMessage({ ...localeMessage['modal_validating'] }) : (getFieldError('severity') || []).join(', ')}
                  >
                  {getFieldDecorator('severity', {
                    rules: [
                      { required: true, message: formatMessage({ ...localeMessage['rule_severityMapper_placeholder'] }) }
                    ]
                  })(
                    <Select getPopupContainer={() => document.getElementById("content")} placeholder={formatMessage({ ...localeMessage['rule_severityMapper_placeholder'] })}>
                      <Option value="0">{window['_severity']['0']}</Option>
                      <Option value="1">{window['_severity']['1']}</Option>
                      <Option value="2">{window['_severity']['2']}</Option>
                      <Option value="3">{window['_severity']['3']}</Option>
                    </Select>
                    )}
                </Item>
                :
                <Item
                  {...itemLayout}
                  wrapperCol={{ span: 20 }}
                  label={formatMessage({ ...localeMessage['rule_severityMapper'] })}
                  >
                  <Table
                    className={styles.modalTable}
                    columns={[
                      {
                        title: <FormattedMessage {...localeMessage['rule_severityMapper_trap']} />,
                        dataIndex: 'trap',
                        key: 'trap',
                        render: (text, record, index) => {
                          return (
                            <Input value={text} onChange={(e) => {
                              //TODO
                              let data = this.replaceFunc(this.state.levelList, index, 'trap', e.target.value)
                              this.setState({ levelList: [...data] })
                            } } />
                          )
                        }
                      },
                      {
                        title: <FormattedMessage {...localeMessage['rule_expression']} />,
                        key: 'expression',
                        render: (text, record, index) => {
                          return <span className={styles.expression}>=</span>
                        }
                      },
                      {
                        title: <FormattedMessage {...localeMessage['rule_severityMapper_alert']} />,
                        dataIndex: 'severity',
                        key: 'severity',
                        render: (text, record, index) => {
                          return (
                            <Select getPopupContainer={() => document.getElementById("content")} notFoundContent='Not Found' value={text} onChange={(value) => {
                              //TODO
                              let data = this.replaceFunc(this.state.levelList, index, 'severity', value)
                              this.setState({ levelList: [...data] })
                            } }>
                              <Option value="0">{window['_severity']['0']}</Option>
                              <Option value="1">{window['_severity']['1']}</Option>
                              <Option value="2">{window['_severity']['2']}</Option>
                              <Option value="3">{window['_severity']['3']}</Option>
                            </Select>
                          )
                        }
                      },
                      {
                        title: <FormattedMessage {...localeMessage['rule_action']} />,
                        width: '135px',
                        key: 'operation',
                        render: (text, record, index) => {
                          return (
                            <span>
                              <Button size='small' className={styles.delBtn} onClick={() => {
                                //TODO
                                let data = this.state.levelList.filter((level, itenIndex) => itenIndex !== index)
                                this.setState({ levelList: [...data] })
                              } }>{formatMessage({ ...localeMessage['rule_action_delete'] })}</Button>
                            </span>
                          )
                        }
                      }
                    ]}
                    rowKey={(record, index) => index}
                    pagination={false}
                    dataSource={this.state.levelList}
                    />
                  <span className={styles.alertMessage}>{formatMessage({ ...localeMessage['rule_severityMapper_message'] })}</span>
                  <div className={styles.addBtn}>
                    <Button type="primary" className={styles.appBtn} onClick={() => {
                      //TODO
                      this.setState({
                        levelList: [
                          ...this.state.levelList,
                          { 'trap': undefined, 'severity': undefined }
                        ]
                      })
                    } }><span>{formatMessage({ ...localeMessage['rule_addRow'] })}</span></Button>
                  </div>
                </Item>
            }
          </Form>
        </div>
      </Modal>
    )
  }
}

ruleModal.defaultProps = {

}

ruleModal.propTypes = {

}

export default injectIntl(Form.create({
  mapPropsToFields: (props) => {
    return {
      ruleName: {
        value: props.snmpTrapRules.operateAppRules.name || undefined
      },
      description: {
        value: props.snmpTrapRules.operateAppRules.description || undefined
      },
      severity: {
        value: typeof props.snmpTrapRules.operateAppRules.severity !== 'undefined' ? `${props.snmpTrapRules.operateAppRules.severity}` : undefined
      },
      classCode: {
        value: typeof props.snmpTrapRules.operateAppRules.classCode !== 'undefined' ? `${props.snmpTrapRules.operateAppRules.classCode}` : undefined
      }
    }
  }
})(ruleModal))
