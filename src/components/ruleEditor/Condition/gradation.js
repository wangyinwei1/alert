import React, { PropTypes, Component } from 'react'
import { default as cls } from 'classnames'
import { Select, Input } from 'antd'
import _ from 'lodash'
import Condition from './condition';
import PureRender from '../../../utils/PureRender.js'
import { getUUID } from '../../../utils/index'
import styles from './gradation.less'

const Option = Select.Option

let conditionsDom = []; // 元素列表
let treeTag = 0; // 当前数据的层级标识(本身并不会变) --> 0 | 1 | 2

@PureRender
class Gradation extends Component {
  constructor(props) {
    super(props)
    this.resetConditionsDom = this.resetConditionsDom.bind(this)
    this.createAll = this.createAll.bind(this)
    this.createTitle = this.createTitle.bind(this)
    this.createConditionList = this.createConditionList.bind(this)
    this.treeControl = this.treeControl.bind(this)
  }

  //重置，防止重复 render
  resetConditionsDom() {
    conditionsDom = []
  }

  // 深度优先 对数据进行深度遍历并创建 Dom
  createAll(node, treeTag) {
    const { datas = [] } = node;
    const domList = [];
    domList.push(
        this.createTitle(node, treeTag),
        this.createConditionList(node, treeTag)
    );
    for (let i = datas.length - 1; i >= 0; i -= 1) {
        // 先序遍历，treeTag + 1 是当前值 + 1，不会改变自身的值
        this.createAll(datas[i], treeTag + 1);
    }
    conditionsDom.unshift(domList);
    return conditionsDom;
  }

  // 创建条件头
  createTitle(node, level) {
    const { logic } = node;
    return (
      <div className={cls(styles.title, 'treeTag' + level)}>
          <Select
            getPopupContainer={ () => document.getElementById("content") || document.body }
            value={logic}
            placeholder={window.__alert_appLocaleData.messages['ruleEditor.selectLogic']}
            onChange={this.changeTitleLogic.bind(this, node, level)}
          >
            <Option value="and">{window.__alert_appLocaleData.messages['ruleEditor.and']}</Option>
            <Option value="or">{window.__alert_appLocaleData.messages['ruleEditor.or']}</Option>
            <Option value="not">{window.__alert_appLocaleData.messages['ruleEditor.not']}</Option>
          </Select>
          <div className={styles.btnWrap}>
              {
                  level !== 2 && // 三级条件不显示增加嵌套按钮
                  <span onClick={this.addBlock.bind(this, node, level)} className={cls(styles.btn, styles.addBlock)}>{window.__alert_appLocaleData.messages['ruleEditor.addRow']}</span>
              }
              <span onClick={this.addLine.bind(this, node, level)} className={cls(styles.btn, styles.addLine)}>{window.__alert_appLocaleData.messages['ruleEditor.addCon']}</span>
          </div>
          {
              level !== 0 && // 一级条件不显示删除按钮
              <i className={styles.delete} onClick={this.deleteBlock.bind(this, node, level)}>X</i>
          }
      </div>
    )
  }

  // 创建条件内容
  createConditionList(node, level) {
    const { exprs } = node;
    return exprs.map((_item, _index) => {
      const { key, opt, val } = _item;
      const itemData = {
        node,
        opt,
        val,
        level,
        classCode: this.props.codewords.classCode,
        source: this.props.codewords.source,
        attributes: this.props.codewords.attributes,
        _key: key,
        _this: this,
        index: _index,
        deleteLine: this.deleteLine,
        changeConditionContent: this.changeConditionContent
      };
      return <Condition {...itemData} />
    })
  }

  // 修改条件内容
  changeConditionContent(item, index, contentType, value) {
    let _condition = _.cloneDeep(this.props.condition);
    this.treeControl(contentType, _condition, item, value, index);
    this.props.changeCondition(this.props._type, this.props._key, _condition)
  }

  // 修改条件头逻辑
  changeTitleLogic(item, level, value) {
    let _condition = _.cloneDeep(this.props.condition);
    this.treeControl('changeLogic', _condition, item, value);
    this.props.changeCondition(this.props._type, this.props._key, _condition)
  }

  // 增加嵌套
  addBlock(item, level, event) {
    const _condition = _.cloneDeep(this.props.condition);
    const newBlock = {
        id: getUUID(8),
        exprs: [],
        datas: [],
        logic: 'and'
    }
    this.treeControl('addBlock', _condition, item, newBlock);
    this.props.changeCondition(this.props._type, this.props._key, _condition)
  }

  // 删除嵌套
  deleteBlock(item, level, event) {
    const _condition = _.cloneDeep(this.props.condition);
    this.treeControl('deleteBlock', _condition, item);
    this.props.changeCondition(this.props._type, this.props._key, _condition)
  }

  // 增加条件
  addLine(item, level, event) {
    const _condition = _.cloneDeep(this.props.condition);
    const newLine = {
        key: undefined,
        opt: undefined,
        val: undefined
    };
    this.treeControl('addLine', _condition, item, newLine);
    this.props.changeCondition(this.props._type, this.props._key, _condition)
  }

  // 删除条件
  deleteLine(item, level, index, event) {
    const _condition = _.cloneDeep(this.props.condition);
    this.treeControl('deleteLine', _condition, item, index);
    this.props.changeCondition(this.props._type, this.props._key, _condition)
  }

  /**
   * x 默认为为新建项
   * deleteLine 时，x 为索引
   * changeLogic 时，x 为逻辑值
   * conditionIndex 为条件 exprs 索引
   */
  treeControl(type, node, item, x, conditionIndex = null) {
    let { exprs = [], datas = [] } = node;
    if (node.id === item.id) { // 一级嵌套（增）一级条件（增、删）
      type === 'addBlock' && datas.push(x);
      type === 'addLine' && exprs.push(x);
      type === 'deleteLine' && exprs.splice(x, 1);
      if (type === 'changeLogic') {
        node.logic = x;
      }
      if (/key|opt|val/.test(type)) {
        if (type === 'key') {
            exprs[conditionIndex]['opt'] = undefined
            exprs[conditionIndex]['val'] = undefined;
        }
        if (x.target) {
            exprs[conditionIndex][type] = x.target.value;
        } else {
            exprs[conditionIndex][type] = x;
        }
      }
    } else { // 二、三级嵌套（增、删）二、三级条件（增、删）
      for (let i = datas.length - 1; i >= 0; i -= 1) {
        if (item.id === datas[i].id) {
          type === 'deleteBlock' && datas.splice(i, 1);
          type === 'addBlock' && datas[i].datas.push(x);
          type === 'deleteLine' && datas[i].exprs.splice(i, 1);
          type === 'addLine' && datas[i].exprs.push(x);
          if (type === 'changeLogic') {
              datas[i].logic = x;
          }
          if (/key|opt|val/.test(type)) {
              if (type === 'key') {
                  datas[i].exprs[conditionIndex]['opt'] = undefined
                  datas[i].exprs[conditionIndex]['val'] = undefined;
              }
              if (x.target) {
                  datas[i].exprs[conditionIndex][type] = x.target.value;
              } else {
                  datas[i].exprs[conditionIndex][type] = x;
              }
          }
        } else {
          this.treeControl(type, datas[i], item, x, conditionIndex);
        }
      }
    }
  }

  render() {
    const { condition } = this.props

    this.resetConditionsDom()
    return (
      <div className={styles.defineConditions}>
        {
          this.createAll(condition, treeTag)
        }
      </div>
    )
  }
}

export default Gradation