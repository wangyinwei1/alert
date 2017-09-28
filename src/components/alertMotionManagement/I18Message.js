import { defineMessages } from 'react-intl';
//国际化信息
const indexMessages = {
  localeMessages: defineMessages({
    addAction: {
      id: 'alertMotionManagement.addAction',
      defaultMessage: '添加动作'
    },
    motionTotal: {
      id: 'alertMotionManagement.motionTotal',
      defaultMessage: '动作总数: {num}'
    },
    action_edit: {
      id: 'alertMotionManagement.List.edit',
      defaultMessage: '编辑',
    },
    action_delete: {
      id: 'alertMotionManagement.List.delete',
      defaultMessage: '删除',
    },
    actionImport: {
      id: 'alertMotionManagement.actionImport',
      defaultMessage: '导入!'
    },
    actionExport: {
      id: 'alertMotionManagement.actionExport',
      defaultMessage: '导出!'
    },
    twoDevelopment: {
      id: 'alertMotionManagement.twoDevelopment',
      defaultMessage: '动作插件二次开发指南'
    },
    selectExportAction: {
      id: 'alertMotionManagement.selectExportAction',
      defaultMessage: '请选择导出的动作！'
    }
  }),
  formatMessages: defineMessages({
    actionName: {
      id: 'alertMotionManagement.List.actionName',
      defaultMessage: '动作名称',
    },
    description: {
      id: 'alertMotionManagement.List.description',
      defaultMessage: '描述',
    },
    scope: {
      id: 'alertMotionManagement.List.scope',
      defaultMessage: '适用范围',
    },
    opened: {
      id: 'alertMotionManagement.List.onOff',
      defaultMessage: '是否开启',
    },
    operation: {
      id: 'alertMotionManagement.List.actions',
      defaultMessage: '操作',
    },
    builtIn: {
      id: 'alertMotionManagement.List.built-in',
      defaultMessage: '是否内置',
    },
    Unknown: {
      id: 'alertList.unknown',
      defaultMessage: '未知',
    },
    noData: {
      id: 'alertList.noListData',
      defaultMessage: '暂无数据',
    },

  }),
}

const addActionModalMessages = defineMessages({
  noSelectedFile: {
     id: 'alertMotionManagement.modal.noSelectedFile',
    defaultMessage: '未选择任何文件'
  },
  jarTypeTest: {
     id: 'alertMotionManagement.modal.jarTypeTest',
    defaultMessage: '只支持类型为jar的文件上传！'
  },
  addAction: {
    id: 'alertMotionManagement.modal.addAction',
    defaultMessage: '添加动作插件'
  },
  actionName: {
    id: 'alertMotionManagement.modal.actionName',
    defaultMessage: '动作名称'
  },
  actionDescription: {
    id: 'alertMotionManagement.modal.actionDescription',
    defaultMessage: '动作描述'
  },
  actionUpload: {
    id: 'alertMotionManagement.modal.actionUpload',
    defaultMessage: '上传插件包'
  },
  selectFile: {
    id: 'alertMotionManagement.modal.selectFile',
    defaultMessage: '选择文件'
  },
  scope: {
    id: 'alertMotionManagement.modal.scope',
    defaultMessage: '适用范围'
  },
  newAlarm: {
    id: 'alertMotionManagement.modal.newAlarm',
    defaultMessage: '新产生的告警'
  },
  existingAlarm: {
    id: 'alertMotionManagement.modal.existingAlarm',
    defaultMessage: '已存在的告警'
  },
  actionNamePlaceholder: {
    id: 'alertMotionManagement.modal.actionNamePlaceholder',
    defaultMessage: '请输入动作名称'
  },
  addDescription: {
    id: 'alertMotionManagement.modal.addDescription',
    defaultMessage: '请为动作添加描述'
  },
  emptyName: {
    id: 'alertMotionManagement.modal.emptyName',
    defaultMessage: '名称不能为空!'
  },
  limit_subject: {
    id: 'ITSMWrapper.create.limit_subject',
    defaultMessage: '名称字数超过限制!'
  },
  selectUploadFile: {
    id: 'alertMotionManagement.modal.selectUploadFile',
    defaultMessage: '请选择上传文件!'
  },
  selectedCheckBox: {
    id: 'alertMotionManagement.modal.selectedCheckBox',
    defaultMessage: '必须选择一个或多个!'
  }
})
export default {
  indexMessages,
  addActionModalMessages
}