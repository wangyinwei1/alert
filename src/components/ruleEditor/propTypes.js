import React, { PropTypes } from 'react';

// ---------- Basic Information ---------- //
export const DefaultBaseProps = {
  name: '', //规则名称
  description: '', //规则描述
  target: 0, //目标告警（0：实时告警；1：历史告警）
  enableIs: true, //是否启用（true：开启；false：关闭）
}
export const BasePropTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  target: PropTypes.number.isRequired,
  enableIs: PropTypes.bool.isRequired
}

// ---------- Time Information ------------ //
export const DefaultTimeStart = { hours: 0, mins: 0 }
export const DefaultTimeEnd = { hours: 23, mins: 59 }
export const DefaultTimeProps = {
  timeCondition: 0, //执行类型（0：任意时间执行；1：固定时间执行；2：周期性执行）
  dayStart: '', //开始时间（固定时间执行，格式：YYYY-MM-DDThh:mm+xx:xx）
  dayEnd: '', //结束时间（固定时间执行，格式：YYYY-MM-DDThh:mm+xx:xx）
  timeCycle: 0, //时间周期（周期性执行，0：每天；1：每周；2：每月）
  timeStart: '', //结束时间（周期性执行，格式：hh:mm+xx:xx）
  timeEnd: '', //结束时间（周期性执行，格式：hh:mm+xx:xx）
  timeCycleWeek: [], //每周时间（周期性执行，0～6：周一～周日）
  timeCycleMonth: [] //每月时间（周期性执行，0～30：1日～31日）
}
export const TimePropTypes = {
  timeCondition: PropTypes.number.isRequired,
  dayStart: PropTypes.string,
  dayEnd: PropTypes.string,
  timeCycle: PropTypes.number,
  timeStart: PropTypes.string,
  timeEnd: PropTypes.string,
  timeCycleWeek: PropTypes.array,
  timeCycleMonth: PropTypes.array
}

// ---------- Source Information -------------- //
export const DefaultSourceProps = {
  source: ''
}

export const SourcePropTypes = {
  source: PropTypes.string.isRequired
}

// ---------- Condition Information ----------- //
const defaultRuleData = { //规则内容
  logic: 'and', //本级的逻辑关系
  exprs: [ //本级的条件内容列表
    {
      key: undefined,
      opt: undefined,
      val: undefined
    }
  ],
  datas: []
}
const ruleDataPropTypes = {
  exprs: PropTypes.array.isRequired,
  datas: PropTypes.array.isRequired,
  logic: PropTypes.string
}
export const DefaultConditionProps = {
  associatedFlag: 0, // 关联标识 (0:不关联；1:基于标签；2:基于拓扑；3:基于连通性；4:基于反复)
  noAssociation: { /* 不关联类型 */
    ruleData: {
      ...defaultRuleData
    }
  },
  tagAssociation: { /* 基于标签 */
    tags: [],//关联标签
    ruleData: {
      ...defaultRuleData
    },
    timeWindow: 1, //时间窗,单位分钟
    newObject: undefined,//新告警对象
    newName: undefined,//新告警名称
    newSeverity: undefined,//新告警等级
    newDescription: undefined,//新告警描述
  },
  topologyAssociation: {
    primaryRuleData: {
      ...defaultRuleData
    }, //根源告警
    secondaryRuleData: {
      ...defaultRuleData
    }, //连带告警
    timeWindow: 1, //时间窗,单位分钟
    ruleRelation: 0, //告警间关系（0:忽略关系；1:同一CI；2:子父关系；3:父子关系；4:拓扑关系）
    associatedCode: undefined, //关系名称
    consumersID: undefined, //消费圈ID
    sourceID: undefined// 根源告警节点
  }
}
export const ConditionPropTypes = {
  //associatedFlag: PropTypes.number.isRequired,
  noAssociation: PropTypes.shape({
    ruleData: PropTypes.shape({
      ...ruleDataPropTypes
    }).isRequired
  }),
  tagAssociation: PropTypes.shape({
    tags: PropTypes.array.isRequired,
    ruleData: PropTypes.shape({
      ...ruleDataPropTypes
    }).isRequired,
    timeWindow: PropTypes.number.isRequired,
    newObject: PropTypes.string,
    newName: PropTypes.string,
    newSeverity: PropTypes.string,
    newDescription: PropTypes.string
  }),
  topologyAssociation: PropTypes.shape({
    primaryRuleData: PropTypes.shape({
      ...ruleDataPropTypes
    }).isRequired,
    secondaryRuleData: PropTypes.shape({
      ...ruleDataPropTypes
    }).isRequired,
    timeWindow: PropTypes.number.isRequired,
    ruleRelation: PropTypes.number.isRequired,
    associatedCode: PropTypes.string,
    apiKey: PropTypes.string,
    consumersID: PropTypes.string,
    sourceID: PropTypes.string
  })
}

// ---------- Actions Information ----------- //
const initActions = {
  actionDelOrClose: {
    operation: undefined // 1 --> 删除 2 --> 关闭
  },
  actionNotification: {
    notifyWhenLevelUp: true, // 在针对新告警时 是否需要告警级别更改时提醒 --> 默认提醒
    recipients: [], // 通知对象
    notificationMode: {
      notificationMode: [], // EMAIL(1，"电子邮件")，SMS(2，"短信")，CHATOPS_PRIVATE(3，"Chatops私聊")，webNotification(4, '声音通知') 多选
      emailTitle: '${entityName}:${name}',
      emailMessage: '${severity},${entityName},${firstOccurTime},${description}',
      smsMessage: '${severity},${entityName},${firstOccurTime},${description}',
      webNotification: {
        title: '${name}',
        message: '${severity},${entityName},${description}',
        playTimeType: 'ONECE', // {string} ONECE --> 一次， TENSEC --> 10s，TIMEOUT --> 直到超时
        voiceType: '01', // {string}
        timeOut: 30 // {number} 秒记，上限 30 分钟
      }
    }
  },
  actionITSM: {
    itsmModelId: undefined, // 工单Id
    itsmModelName: undefined, // 工单名称
    realParam: '', // 映射参数
    viewParam: '' // 存放临时数据 --> 主要与realParam的区别在user分页搜索时需要记录lablel信息
  },
  actionChatOps: {
    notifyWhenLevelUp: true, // 在针对新告警时 是否需要告警级别更改时提醒 --> 默认提醒
    chatOpsRoomId: undefined // roomId
  },
  actionUpgrade: {
    notificationGroupings: [{
      delay: 15, // 延迟时间
      status: [], // 不是某种告警状态
      recipients: [] // 通知对象
    }],
    notificationMode: {
      notificationMode: [], // 通知类型 同 actionNotification
      emailTitle: '${entityName}:${name}',
      emailMessage: '${severity},${entityName},${firstOccurTime},${description}',
      smsMessage: '${severity},${entityName},${firstOccurTime},${description}'
    }
  },
  actionSeverity: {
    type: undefined,
    fixedSeverity: undefined
  },
  actionPlugin: {
    uuid: undefined,
    name: undefined,
    realParam: ''
  }
}
export const InitalActions = initActions
export const NotifyTypes = { email: false, sms: false, chatops: false, audio: false }
export const DefaultActionsProps = {
  type: [1], // 必选 1 --> 告警关闭/删除 2 --> 升级 3 --> 通知 4 --> 派发工单 5 --> 抑制 6 --> chatops 7 --> 告警级别修改 100 --> 插件
  ...initActions
}
export const ActionsPropTypes = {
  // 动作类型
  type: PropTypes.array.isRequired,
  // 关闭/删除
  actionDelOrClose: PropTypes.shape({
    operation: PropTypes.number
  }),
  // 告警通知
  actionNotification: PropTypes.shape({
    notifyWhenLevelUp: PropTypes.bool.isRequired,
    recipients: PropTypes.array.isRequired,
    notificationMode: PropTypes.shape({
      notificationMode: PropTypes.array.isRequired,
      emailTitle: PropTypes.string.isRequired,
      emailMessage: PropTypes.string.isRequired,
      smsMessage: PropTypes.string.isRequired,
      webNotification: PropTypes.shape({
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        playTimeType: PropTypes.string.isRequired,
        timeOut: PropTypes.number.isRequired,
        voiceType: PropTypes.string.isRequired
      })
    })
  }),
  // 工单映射
  actionITSM: PropTypes.shape({
    itsmModelId: PropTypes.string,
    itsmModelName: PropTypes.string,
    realParam: PropTypes.string.isRequired,
    viewParam: PropTypes.string
  }),
  // 分享chatops群组
  actionChatOps: PropTypes.shape({
    notifyWhenLevelUp: PropTypes.bool.isRequired,
    chatOpsRoomId: PropTypes.string
  }),
  // 动作升级
  actionUpgrade: PropTypes.shape({
    notificationGroupings: PropTypes.arrayOf(
      PropTypes.shape({
        delay: PropTypes.number.isRequired,
        status: PropTypes.array.isRequired,
        recipients: PropTypes.array.isRequired,
      })
    ).isRequired,
    notificationMode: PropTypes.shape({
      notificationMode: PropTypes.array.isRequired,
      emailTitle: PropTypes.string.isRequired,
      emailMessage: PropTypes.string.isRequired,
      smsMessage: PropTypes.string.isRequired
    })
  }),
  // 修改告警等级
  actionSeverity: PropTypes.shape({
    type: PropTypes.string,
    fixedSeverity: PropTypes.string
  }),
  // 动作插件
  actionPlugin: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    realParam: PropTypes.string.isRequired
  })
}