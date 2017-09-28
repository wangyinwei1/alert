import React, { PropTypes, Component } from 'react';
import { default as cls } from 'classnames';
import { Select, Input } from 'antd';
import { groupSort } from '../../../utils/index'

import styles from './condition.less';

const {Option, OptGroup } = Select;

const optList = {
    addr: [
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.ct'],
            value: 'contain'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.eq'],
            value: 'equal'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.startWith'],
            value: 'startwith'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.endWith'],
            value: 'endwith'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.gt'],
            value: 'gt'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.ge'],
            value: 'ge'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.lt'],
            value: 'lt'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.le'],
            value: 'le'
        }
    ],
    num: [
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.eq'],
            value: '=='
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.noeq'],
            value: '!='
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.gt'],
            value: '>'
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.lt'],
            value: '<'
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.ge'],
            value: '>='
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.le'],
            value: '=<'
        }
    ],
    'str': [
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.ct'],
            value: 'contain'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.eq'],
            value: 'equal'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.startWith'],
            value: 'startwith'
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.endWith'],
            value: 'endwith'
        }
    ]
};
const valueList = {
    severity: [
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.v1'],
            value: '0'
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.v2'],
            value: '1'
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.v3'],
            value: '2'
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.v4'],
            value: '3'
        }
    ],
    status: [
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.s2'],
            value: '0',
        },
        {
            name: window.__alert_appLocaleData.messages['ruleEditor.s3'],
            value: '150',
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.s4'],
            value: '190',
        }, {
            name: window.__alert_appLocaleData.messages['ruleEditor.s5'],
            value: '255',
        }
    ],
    duration: [
        {
            name: '< 15 min',
            value: '1'
        }, {
            name: '15 ~ 30 min',
            value: '2'
        }, {
            name: '30 ~ 60 min',
            value: '3'
        }, {
            name: '1 ~ 4 h',
            value: '4'
        }, {
            name: '> 4 h',
            value: '5'
        },
    ]
};

const attributeLabels = [
    window.__alert_appLocaleData.messages['ruleEditor.label1'],
    window.__alert_appLocaleData.messages['ruleEditor.label2'],
    window.__alert_appLocaleData.messages['ruleEditor.label3']
]

class Condition extends Component {
    // 删除条件项
    // deleteLine() {
    //   console.log('删除条件项');
    // }
    // 创建条件
    createConditionItem() {
        let keyList = [];
        let local = 'Zh';
        const { node, source, attributes, _key, opt, classCode, val, level, index, deleteLine, changeConditionContent, _this } = this.props;
        const groupList = groupSort()(attributes, 'group')
        valueList.source = source.map(item => {
            return { name: item.value, value: item.key };
        });
        valueList.classCode = classCode.map(item => {
            return { name: item.classCode, value: item.classCode };
        });
        if (window.__alert_appLocaleData.locale === 'en-us') {
            local = 'Us'
        };
        keyList = groupList.map(item => {
            return item.children.map(child => {
              return {
                  name: child[`name${local}`],
                  value: child['nameUs'],
                  type: child['type']
              };
            })
        });
        let _optList = [];
        keyList.forEach(item => {
            item.forEach(child => {
              if (child.value === _key) {
                  _optList = optList[child.type]
              }
              if (_key === 'entityAddr') {
                  _optList = optList['addr']
              }
            })
        });
        return (
            <div key={new Date().getTime() + 'level' + level} className={cls(
                styles.conditionItem,
                `treeTag${level}`
            )}>
                <Select getPopupContainer={() => document.getElementById("content")} onChange={changeConditionContent.bind(_this, node, index, 'key')} className={styles.key} value={_key} placeholder={window.__alert_appLocaleData.messages['ruleEditor.phField']}>
                    {
                        keyList.length > 0 ? keyList.map((item, itemIndex) => {
                            return (
                              <OptGroup label={attributeLabels[itemIndex]} key={itemIndex}>
                                {
                                  item.length > 0 ? item.map( child => (
                                    <Option key={child.value} value={child.value}>{child.name}</Option>
                                  )) : []
                                }
                              </OptGroup>
                            )
                        }) : []
                    }
                </Select>
                <Select getPopupContainer={() => document.getElementById("content")} style={{ width: 150 }} onChange={changeConditionContent.bind(_this, node, index, 'opt')} className={styles.opt} value={opt} placeholder={window.__alert_appLocaleData.messages['ruleEditor.phOpt']}>
                    {
                        _optList.map(item => (
                            <Option key={item.value}>{item.name}</Option>
                        ))
                    }
                </Select>
                {
                    /severity|status|duration|source|classCode/.test(_key) &&
                    <Select getPopupContainer={() => document.getElementById("content")} onChange={changeConditionContent.bind(_this, node, index, 'val')} className={styles.value} style={{ width: 150 }} value={val} placeholder={window.__alert_appLocaleData.messages['ruleEditor.phFieldValue']}>
                        {
                            valueList[_key] &&
                            valueList[_key].map(item => {
                                return <Option key={_key === 'source' ? item.name : item.value}>{item.name}</Option>
                            })
                        }
                    </Select>
                }
                {
                    !/severity|status|duration|source|classCode/.test(_key) &&
                    <Input placeholder={window.__alert_appLocaleData.messages['ruleEditor.phFieldValue']} style={{ width: 130 }} onBlur={changeConditionContent.bind(_this, node, index, 'val')} defaultValue={val} />
                }
                {
                  index !== 0 && // 一级不显示条件删除
                  <i className={styles.delete} onClick={deleteLine.bind(_this, node, level, index)}>X</i>
                }
            </div>
        );
    }
    render() {
        return this.createConditionItem();
    }
}

Condition.defaultProps = {
    _key: undefined,
    opt: undefined,
    val: undefined,
    logic: undefined,
    level: undefined,
};

Condition.propsTypes = {
    _key: PropTypes.string, // 维度
    opt: PropTypes.string, // 操作
    val: PropTypes.string, // 对应标签
    logic: PropTypes.string, // 逻辑
    level: PropTypes.number // 逻辑
};

export default Condition;
