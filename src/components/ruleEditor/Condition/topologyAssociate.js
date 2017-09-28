import React, { PropTypes, Component } from 'react'
import { Form, message, InputNumber, Select, Row, Col } from 'antd'
import Gradation from './gradation.js'
import * as Services from '../../../services/alertAssociationRules'
import PureRender from '../../../utils/PureRender.js'
import styles from './index.less'

const FormItem = Form.Item
const Option = Select.Option
const desLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 }
}
const colLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const relationTocode = [2, 3]
const relationTotopology = [4]

// 查询告警关系
function PromiselsRelation() {
  return Services.getlsRelationId().then(lsRelation => {
    if (lsRelation.result) {
      return Promise.resolve({ data: lsRelation.data })
    } else {
      return Promise.reject(lsRelation.message)
    }
  })
}

// 查询消费圈
function PromiselsCharts() {
  return Services.getlsChartByTenantId().then(lsCharts => {
    if (lsCharts.result) {
      return Promise.resolve({ data: lsCharts.data })
    } else {
      return Promise.reject(lsCharts.message)
    }
  })
}

// 查询根源告警节点
function PromiselsCi(chartId) {
  return Services.getlsCiByChartId(chartId).then(lsCi => {
    if (lsCi.result) {
      return Promise.resolve({ data: lsCi.data })
    } else {
      return Promise.reject(lsCi.message)
    }
  })
}

@PureRender
class TopologyAssociate extends Component {
  constructor(props) {
    super(props)
    this.getParamsByRelation = this.getParamsByRelation.bind(this)
    this.querySourceIdsByChartId = this.querySourceIdsByChartId.bind(this)
    this.state = {
      relations: [], // 关系列表
      consumersIds: [], // 消费圈id
      sourceIds: [] // 根源告警节点
    }
  }

  componentDidMount() {
    this.getParamsByRelation(this.props.condition, this.state)
  }

  componentWillReceiveProps(nextProps) {
    this.getParamsByRelation(nextProps.condition, this.state, this.props.condition)
  }

  // 新增 编辑 且告警关系选项需要获取接口数据时触发
  getParamsByRelation(condition, state, preCondition = {}) {
    // 在选择 父子 或者 子父 关系时触发(切换也需要触发)
    if (relationTocode.includes(condition.ruleRelation) && condition.ruleRelation !== preCondition.ruleRelation) {
      PromiselsRelation().then(ls => {
        if (ls.data.length) this.setState({ ...state, relations: ls.data })
      }).catch(msg => {
        message.error(msg, 3)
      })
      return
    }
    // 拓扑关系 查询消费圈 调用
    if (relationTotopology.includes(condition.ruleRelation) && !state.consumersIds.length) {
      PromiselsCharts().then(ls => {
        let consumersIds = ls.data
        if (consumersIds.length) {
          if (condition.consumersID) { // 处理编辑的情况
            this.querySourceIdsByChartId(consumersIds, condition.consumersID, (sourceIds) => {
              this.setState({ ...state, consumersIds, sourceIds })
            })
          } else {
            this.setState({ ...state, consumersIds })
          }
        }
      }).catch(msg => {
        message.error(msg, 3)
      })
      return
    }
    // 拓扑关系 查询告警节点 调用
    if (relationTotopology.includes(condition.ruleRelation) && condition.consumersID && state.consumersIds.length &&
          condition.consumersID !== preCondition.consumersID) { // 这里的判断很重要，需要兼顾到编辑的情况
            this.querySourceIdsByChartId(state.consumersIds, condition.consumersID, (sourceIds) => {
              this.setState({ ...state, sourceIds })
            })
    }
  }

  // 匹配消费圈id去查询根源告警节点
  querySourceIdsByChartId(consumersIds, consumersID, callback) {
    let chartId = undefined
    for (let instance of consumersIds) {
      if (instance.id === consumersID) {
        chartId = instance.id
        break;
      }
    }
    if (chartId) {
      PromiselsCi(chartId).then(ls => {
        if (ls.data.length) callback(ls.data)
      }).catch(msg => {
        message.error(msg, 3)
      })
    }
  }

  changeFields(type, value) {
    switch(type) {
      case 'timeWindow':
        if (typeof value === 'number') {
          this.props.changeCondition(this.props._type, type, Number(value))
        }
        break;
      case 'ruleRelation':
        this.props.changeCondition(this.props._type, type, Number(value))
        break;
      case 'associatedCode':
        this.props.changeCondition(this.props._type, type, value)
        break;
      case 'consumersID':
        this.props.changeCondition(this.props._type, type, value)
        break;
      case 'sourceID':
        this.props.changeCondition(this.props._type, type, value)
        break;
      default:
        break;
    }
  }

  render() {
    const { _type, condition, changeCondition, userInfo ,codewords } = this.props

    let primaryGradationProps = {
      _type,
      _key: 'primaryRuleData',
      condition: condition.primaryRuleData,
      changeCondition,
      codewords
    }
    let secondaryGradationProps = {
      _type,
      _key: 'secondaryRuleData',
      condition: condition.secondaryRuleData,
      changeCondition,
      codewords
    }

    return (
      <div className={styles.aboutTopology}>
        <p className={styles.title}>{window.__alert_appLocaleData.messages['ruleEditor.topology.primary']}</p>
        <Gradation {...primaryGradationProps}/>
        <p className={styles.title}>{window.__alert_appLocaleData.messages['ruleEditor.topology.secondary']}</p>
        <Gradation {...secondaryGradationProps}/>
        <Row>
          <Col span={6}>
            <FormItem
              label={window.__alert_appLocaleData.messages['ruleEditor.topology.cirelation']}
              {...colLayout}
            >
              <Select
                style={{ width: 160 }}
                getPopupContainer={() => document.getElementById("content") || document.body }
                value={String(condition.ruleRelation)}
                onChange={this.changeFields.bind(this, 'ruleRelation')}
              >
                <Option value='0'>{window.__alert_appLocaleData.messages['ruleEditor.topology.cirelation.ignore']}</Option>
                <Option value='1'>{window.__alert_appLocaleData.messages['ruleEditor.topology.cirelation.common']}</Option>
                <Option value='2'>{window.__alert_appLocaleData.messages['ruleEditor.topology.cirelation.son2parent']}</Option>
                <Option value='3'>{window.__alert_appLocaleData.messages['ruleEditor.topology.cirelation.parent2son']}</Option>
                <Option value='4'>{window.__alert_appLocaleData.messages['ruleEditor.topology.cirelation.topology']}</Option>
              </Select>
            </FormItem>
          </Col>
          {/* 父子关系 或者 子父关系 才需要指定关系名称 (需要满足有relations可选项才能显示) */}
          {
            relationTocode.includes(condition.ruleRelation) && this.state.relations.length ?
            <Col span={6}>
              <FormItem
                label={window.__alert_appLocaleData.messages['ruleEditor.topology.cirelation.name']}
                {...colLayout}
              >
                <Select
                  style={{ width: 160 }}
                  placeholder={window.__alert_appLocaleData.messages['ruleEditor.topology.cirelation.placeholder']}
                  getPopupContainer={() => document.getElementById("content") || document.body }
                  value={condition.associatedCode}
                  onChange={this.changeFields.bind(this, 'associatedCode')}
                >
                  {
                    this.state.relations.map( relation => <Option key={relation.id} value={relation.id}>{ condition.ruleRelation === 3 ? `${relation.name}:${relation.reverseName}` : `${relation.reverseName}:${relation.name}` }</Option>)
                  }
                </Select>
              </FormItem>
            </Col> : null
          }
          {/* 拓扑关系 需要选择拓扑图 并 指定根源告警节点 (需要满足有可选的消费圈consumersIds才显示) */}
          {
            relationTotopology.includes(condition.ruleRelation) && this.state.consumersIds.length ?
            <Col span={6}>
              <FormItem
                label={window.__alert_appLocaleData.messages['ruleEditor.topology.charts']}
                {...colLayout}
              >
                <Select
                  style={{ width: 160 }}
                  placeholder={window.__alert_appLocaleData.messages['ruleEditor.topology.charts.placeholder']}
                  getPopupContainer={() => document.getElementById("content") || document.body }
                  value={condition.consumersID}
                  onChange={this.changeFields.bind(this, 'consumersID')}
                >
                  {
                    this.state.consumersIds.map(consumer => <Option key={consumer.id} value={consumer.id}>{consumer.name}</Option>)
                  }
                </Select>
                {
                  condition.consumersID ?
                  <span
                    className={styles.look}
                  >
                    <a href={`/cmdb/graph.html#/${condition.consumersID}?tenantId=${userInfo.tenantId}`} target="_blank">
                      {window.__alert_appLocaleData.messages['ruleEditor.topology.charts.look']}
                    </a>
                  </span>
                  : null
                }
              </FormItem>
            </Col> : null
          }
          {
            relationTotopology.includes(condition.ruleRelation) && this.state.sourceIds.length ?
            <Col span={6}>
              <FormItem
                label={window.__alert_appLocaleData.messages['ruleEditor.topology.node']}
                {...colLayout}
              >
                <Select
                  style={{ width: 160 }}
                  placeholder={window.__alert_appLocaleData.messages['ruleEditor.topology.node.placeholder']}
                  getPopupContainer={() => document.getElementById("content") || document.body }
                  value={condition.sourceID}
                  onChange={this.changeFields.bind(this, 'sourceID')}
                >
                  {
                    this.state.sourceIds.map(source => <Option key={source.id} value={source.id}>{source.name}</Option>)
                  }
                </Select>
              </FormItem>
            </Col> : null
          }
        </Row>
        <FormItem
          label={window.__alert_appLocaleData.messages['ruleEditor.timeWindow']}
          {...desLayout}
        >
          <InputNumber value={condition.timeWindow} min={1} max={1440} step={1} onChange={this.changeFields.bind(this, 'timeWindow')}/>
          <span className={styles.mins}>{window.__alert_appLocaleData.messages['ruleEditor.timeWindow.mins']}</span>
          <span className={styles.notify}>{window.__alert_appLocaleData.messages['ruleEditor.timeWindow.notify']}</span>
        </FormItem>
      </div>
    )
  }
}

export default TopologyAssociate