import { parse } from 'qs'
import { getFormOptions, dispatchForm, close, resolve, merge, relieve, suppress, getChatOpsOptions, shareRoom, notifyOperate, takeOverService, reassignAlert, checkOperationExecutable } from '../services/alertOperation'
import { queryAlertList, queryChild, queryAlertListTime } from '../services/alertList'
import { getUsers } from '../services/app.js';
import { queryCloumns } from '../services/alertQuery'
import { message } from 'antd';
import $ from 'jquery'
import Animate from '../components/alertList/animate'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const optkeyWords = [
  'TakeOver', 'Reassign', 'Close', 'Resolve', 'Dispatch'
]
function getMotionMessage(type, total) {
  let content = ''
  const operate = optkeyWords.filter(opt => opt === type).toString()
  if (operate) {
    switch (operate) {
      case 'TakeOver':
        content = `${window.__alert_appLocaleData.messages['alertManage.assignedIncident']} + ${total}`
        break;
      case 'Reassign':
        content = `${window.__alert_appLocaleData.messages['alertManage.assignedIncident']} + ${total}`
        break;
      case 'Close':
        content = `${window.__alert_appLocaleData.messages['alertManage.closeIncident']} + ${total}`
        break;
      case 'Resolve':
        content = `${window.__alert_appLocaleData.messages['alertManage.resolvedIncident']} + ${total}`
        break;
      default:
        break;
    }
  }
  return content
}
function getMotionNode(type) {
  // 将Id搁在了包裹RadioGroup的容器上，没办法加在RadioGroup上，不加id只能使用ref
  let node = document.getElementById('__alert_filterRadioGroup').lastChild
  const operate = optkeyWords.filter(opt => opt === type).toString()
  if (node && operate) {
    switch (operate) {
      case 'TakeOver':
        node = node.childNodes[1] // 处理中
        break;
      case 'Reassign':
        node = node.childNodes[1] // 处理中
        break;
      case 'Resolve':
        node = node.childNodes[2] // 已解决
        break;
      default:
        break;
    }
    return node
  }
}
function callbackMotion(node) {
  $(node).addClass('motion')
  let timeOut = setTimeout(() => {
    $(node).removeClass('motion')
    clearTimeout(timeOut)
    timeOut = null
  }, 1000)
}

const initalState = {
  // 操作的alertIds
  formOptions: [],
  chatOpsRooms: [],


  // 各个modal弹窗
  isShowFormModal: false, // 派发
  isShowCloseModal: false, // 关闭
  isShowResolveModal: false, // 解决
  isShowMergeModal: false, // 合并
  isShowRelieveModal: false, // 解除
  isShowChatOpsModal: false, //chatops
  isShowTimeSliderModal: false, // suppress
  isShowRemindModal: false, // 提醒框
  isShowNotifyModal: false, // 手工通知
  notifyIncident: {}, // 通知告警
  notifyUsers: [], // 通知用户
  disableChatOps: false,
  isShowReassingModal: false, //转派

  isSelectAlert: false, // 是否选择了告警
  isSelectOrigin: false, // 是否选择了源告警

  originAlert: [], // 合并告警弹窗中选中的告警（长度肯定为1或0）
  relieveAlert: {}, // 选中的解除对象
  mergeInfoList: [

  ], // 合并告警弹窗中所有的告警选项

  // 列定制(点击需要初始化进行数据结构转换)
  selectColumn: [], // 选择的列
  extendColumnList: [], //扩展字段
  extendTagsKey: [], // 标签
  columnList: [
    {
      type: 0, // id
      cols: [
        { id: 'entityName', checked: true, isFixed: true },
        { id: 'name', checked: false, isFixed: true },
        { id: 'owner', checked: true },
        { id: 'source', checked: false, },
        { id: 'description', checked: false, },
        { id: 'count', checked: false, },
        { id: 'lastTime', checked: false, },
        { id: 'lastOccurTime', checked: false, },
        { id: 'status', checked: false, },
        { id: 'firstOccurTime', checked: false, },
        { id: 'entityAddr', checked: false, },
        { id: 'orderFlowNum', checked: false, },
        { id: 'notifyList', checked: false, },
        { id: 'classCode', checked: false },
        { id: 'tags', checked: false },
        { id: 'suppressionFlag', checked: false }
      ]
    }
  ],

  // 分组显示
  isGroup: false,
  selectGroup: undefined, // 默认是分组设置

  //按钮是否disable
  takeOverDisabled: true,
  dispatchDisabled: true,
  closeDisabled: true,
  resolveDisabled: true,
  notifyDisabled: true,
  shareDisabled: true,
  mergeDisabled: true,
  reassignDisabled: true,
  suppressDisabled: true,
  chatOpsDisabled: true,
}

export default {
  namespace: 'alertOperation',

  state: initalState,

  effects: {

    //打开转派告警Model
    *openReassign({ payload }, { select, put, call }) {

      const operateAlertIds = payload.operateAlertIds;

      if (!operateAlertIds || operateAlertIds.length === 0) {
        message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
      } else {
        const checkResponse = (yield checkOperationExecutable({ operateCode: 210, incidentIds: operateAlertIds }) || {}).data;

        if (checkResponse && checkResponse.failed && checkResponse.failed.length > 0) {
          payload && payload.checkFailPayload && payload.checkFailPayload({ checkResponse, operateCode: 210 });
          return;
        }
        const response = yield call(getUsers);
        if (response.result) {
          yield put({
            type: 'setUsers',
            payload: {
              notifyUsers: response.data
            }
          });
        } else {
          message.error(response.message, 2);
        }
        yield put({
          type: 'toggleReassignModal',
          payload: true
        });
      }
    },

    //转派
    *submitReassign({ payload: { toWho, operateAlertIds, resolve } }, { select, put, call }) {
      let response = yield call(reassignAlert, {
        toWho,
        incidentIds: operateAlertIds
      })
      if (response.result) {
        const { success, failed, lang } = response.data;
        if (Array.isArray(success) && success.length > 0) {
          const successMsg = success.map(item => `${item.name}: ${item['msg']}`).join('\n');
          message.success(successMsg, 3);
          yield put({
            type: 'toggleReassignModal',
            payload: false
          });
          Animate.generate({
            content: getMotionMessage('Reassign', operateAlertIds.length || 0),
            node: getMotionNode('Reassign'),
            callback: (node) => {
              callbackMotion(node)
            }
          })
        } else if (Array.isArray(failed) && failed.length > 0) {
          const failedMsg = failed.map(item => `${item.name}: ${item['msg']}`).join('\n');
          message.error(failedMsg, 3);
          response.result = false;
        }
      } else {
        message.error(response.message, 2);
      }

      resolve && resolve(response)
    },
    // 打开抑制告警Modal
    *openSuppressTimeSlider({ payload }, { select, put, call }) {

      const { operateAlertIds } = payload;
      if (operateAlertIds.length === 0) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
      } else {
        yield put({
          type: 'toggleSuppressTimeSliderModal',
          payload: true
        })
      }
    },
    // 抑制告警
    *beforeSuppressIncidents({ payload: { time, position, resolve, operateAlertIds } }, { select, put, call }) {

      yield put({
        type: 'suppressIncidents',
        payload: {
          time: time,
          resolve,
          operateAlertIds
        }
      })
    },
    // 用户查询
    *ownerQuery({ payload }, { select, put, call }) {
      const ownerOptions = yield call(getUsers, {
        realName: payload.realName
      });
      if (!ownerOptions.result) {
        yield message.error(ownerOptions.message, 3)
      }
      yield put({
        type: 'setUsers',
        payload: {
          notifyUsers: ownerOptions.result ? ownerOptions.data : [],
        }
      })
    },
    // 手工通知
    *openNotify({ payload }, { select, put, call }) {
      const { selectedAlertIds } = payload;

      if (selectedAlertIds.length === 0) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 2);
      } else if (selectedAlertIds.length > 1) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip2'], 2);
      } else {
        const options = yield getChatOpsOptions();
        const result = yield call(getUsers);
        if (result.result) {
          yield put({
            type: 'initManualNotifyModal',
            payload: {
              notifyIncident: selectedAlertIds[0],
              isShowNotifyModal: true,
              notifyUsers: result.data,
              disableChatOps: options.result ? false : true
            }
          })
        } else {
          yield message.error(result.message, 3);
        }
      }
    },
    *notyfiyIncident({ payload }, { select, put, call }) {
      const { operateAlertIds, data } = payload;
      let stingIds = operateAlertIds.map(item => { return '' + item })
      if (operateAlertIds.length === 1) {
        const notify = yield call(notifyOperate, {
          incidentId: stingIds[0],
          ...data
        })
        if (notify.result) {
          yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
        } else {
          yield message.error(notify.message, 3);
        }
        yield put({
          type: 'initManualNotifyModal',
          payload: {
            isShowNotifyModal: false
          }
        })
        payload && payload.resolve && payload.resolve(notify);
      } else {
        payload && payload.resolve && payload.resolve(false);
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 2);
      }
    },
    // 抑制告警
    *suppressIncidents({ payload: { time, operateAlertIds, resolve } }, { select, put, call }) {
      const successRemind = yield localStorage.getItem('__alert_suppress_remind')

      if (operateAlertIds.length !== 0) {
        const suppressData = yield suppress({
          incidentIds: operateAlertIds,
          time: Number(time)
        })
        if (suppressData.result) {
          if (successRemind === null || JSON.parse(successRemind)) {
            yield put({
              type: 'toggleRemindModal',
              payload: true
            })
          } else {
            yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
          }
        } else {
          yield message.error(suppressData.message, 3);
        }
        resolve && resolve(suppressData)
      } else if (operateAlertIds.length === 0) {
        resolve && resolve(false)
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
      }
    },
    // 打开解除告警modal
    *openRelieveModal({ payload }, { select, put, call }) {
      const relieveAlert = payload.selectedAlertIds;
      if (relieveAlert !== undefined && relieveAlert.length === 1) {
        if (relieve.hasChild) {
          yield put({
            type: 'setRelieveAlert',
            payload: relieveAlert[0] || {}
          })
          yield put({
            type: 'toggleRelieveModal',
            payload: true
          })
        } else {
          yield message.warn(window.__alert_appLocaleData.messages['incident.no.child'], 2)
        }
      } else {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 2);
      }
    },
    // 打开解除告警modal(点击按钮的方式)
    *openRelieveModalByButton({ payload: obj }, { select, put, call }) {
      if (obj !== undefined) {
        yield put({
          type: 'setRelieveAlert',
          payload: obj || {}
        })
        yield put({
          type: 'toggleRelieveModal',
          payload: true
        })
      } else {
        console.error('relieve origin error')
      }
    },
    // 解除告警
    *relieveAlert({ payload: { relieveAlert, begin, end, resolve } }, { select, put, call }) {

      if (relieveAlert !== undefined && relieveAlert.id !== undefined) {
        let childResult = {}
        if (relieveAlert.childrenAlert === undefined) {
          childResult = yield call(queryChild, { incidentId: relieveAlert.id, begin: begin, end: end })
        }
        const relieveResult = yield relieve({
          parentId: relieveAlert.id
        })
        if (!relieveResult.result) {
          yield message.error(relieveResult.message, 3);
        } else if (childResult.result !== undefined && !childResult.result) {
          relieveResult.result = false;
          yield message.error(childResult.message, 3);
        } else {
          relieveResult.relieveAlert = relieveAlert;
          relieveResult.childResult = childResult;
          yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
        }
        resolve && resolve(relieveResult);
      } else {
        resolve && resolve(false);
        console.error('relieveAlert error');
      }

      yield put({
        type: 'toggleRelieveModal',
        payload: false
      })
    },
    // 打开合并告警需要做的处理
    *openMergeModal({ payload }, { select, put, call }) {
      const mergeInfoList = payload.selectedAlertIds;
      if (mergeInfoList.length >= 2) {
        yield put({
          type: 'setMergeInfoList',
          payload: mergeInfoList
        })
        yield put({
          type: 'toggleMergeModal',
          payload: true
        })
      } else if (mergeInfoList.length < 2) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip3'], 3);
      } else {
        console.error('roll up incident error');
      }
    },
    // 合并告警
    *mergeAlert({ payload }, { select, put, call }) {
      const { originAlert, mergeInfoList } = yield select(state => {
        return {
          'originAlert': state.alertOperation.originAlert,
          'mergeInfoList': state.alertOperation.mergeInfoList
        }
      })
      if (mergeInfoList !== undefined && mergeInfoList.length > 1) { // 合并告警数量少于2不允许合并的操作在页面就不允许删除，还需和交互讨论，暂时不做处理
        let filterList = yield mergeInfoList.filter(item => item.id != originAlert[0]) // 被合并的告警
        let filterListIds = yield filterList.map(item => item.id) // 被合并的告警id列表
        let result = yield merge({
          parentId: originAlert[0],
          childs: filterListIds
        })
        if (result.result) {
          result.pId = originAlert[0];
          result.cItems = filterList;
          result.totalItems = mergeInfoList;
          yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
        } else {
          yield message.error(result.message, 3);
        }
        payload && payload.resolve && payload.resolve(result);
      } else {
        console.error('children incident error');
      }

      yield put({
        type: 'toggleMergeModal',
        payload: false
      })
    },
    // 打开派发工单做的相应处理
    *openFormModal({ payload }, { select, put, call }) {
      // 记录派发工单的动作由‘alertOperation’model引起
      yield put({
        type: 'alertList/toggleModalOrigin',
        payload: 'alertOperation'
      })

      const { operateAlertIds, selectedAlertIds } = payload;

      if (operateAlertIds.length === 0) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
      } else if (operateAlertIds.length > 1) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip4'], 3);
      } else {
        const checkResponse = (yield checkOperationExecutable({ operateCode: 130, incidentIds: operateAlertIds }) || {}).data;

        if (checkResponse && checkResponse.failed && checkResponse.failed.length > 0) {
          payload && payload.checkFailPayload && payload.checkFailPayload({ checkResponse, operateCode: 130 });
          return;
        }
        const options = yield getFormOptions();
        if (options.result) {
          yield put({
            type: 'setFormOptions',
            payload: options.data || []
          })
        } else {
          yield message.error(`${options.message}`, 3)
        }
        yield put({
          type: 'toggleFormModal',
          payload: true
        })
      }
    },
    // 确定派发工单
    *dispatchForm({ payload }, { select, put, call }) {
      const { selectedAlertIds, data } = payload
      if (selectedAlertIds.length === 1 && selectedAlertIds[0] !== undefined) {

        const response = yield call(dispatchForm, {
          id: selectedAlertIds[0]['id'],
          code: data.id,
          name: data.name
        })
        if (response.result) {
          yield put({
            type: 'toggleTicketModal',
            payload: {
              isShowTicketModal: true,
              ticketUrl: response.data.url
            }
          })
        } else {
          // 500 error
          yield message.error(response.message, 3);
        }

      } else {
        console.error('selectedAlertIds error');
      }

      yield put({
        type: 'toggleFormModal',
        payload: false
      })
    },
    // 派发工单成功后的操作
    *afterDispatch({ payload }, { select, put, call }) {

      yield put({ type: 'alertListTable/resetCheckboxStatus' })
      yield put({ type: 'alertListTable/queryAlertList' })
      yield put({ type: 'closeTicketModal' })

    },
    *openCloseModal({ payload }, { select, put, call }) {
      const { operateAlertIds } = payload;

      if (operateAlertIds.length === 0) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
      } else {
        const checkResponse = (yield checkOperationExecutable({ operateCode: 250, incidentIds: operateAlertIds }) || {}).data;

        if (checkResponse && checkResponse.failed && checkResponse.failed.length > 0) {
          payload && payload.checkFailPayload && payload.checkFailPayload({ checkResponse, operateCode: 250 });
          return;
        }
        yield put({ type: 'toggleCloseModal', payload: payload.state })
      }
    },
    // 关闭告警
    *closeAlert({ payload }, { select, put, call }) {
      const { operateAlertIds, closeMessage } = payload;
      let resultData = null
      if (operateAlertIds !== undefined) {
        let stingIds = operateAlertIds.map(item => '' + item)
        //按钮发起请求加载中
        yield put({
          type: 'alertDetail/toggleButtonLoading',
          payload: true
        });
        resultData = yield close({
          incidentIds: stingIds,
          closeMessage
        })
        if (resultData.result) {
          if (resultData.data.result) {
            //按钮发起请求加载中
            yield put({
              type: 'alertDetail/toggleButtonLoading',
              payload: false
            });
            yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
          } else {
            resultData.result = false;
            yield message.error(`${resultData.data.failures}`, 3);
          }
        } else {
          yield message.error(resultData.message, 3);
        }

        payload && payload.resolve && payload.resolve(resultData);
      } else {
        console.error('operateAlertIds error');
        payload && payload.resolve && payload.resolve(false);
      }

      yield put({
        type: 'toggleCloseModal',
        payload: false
      })
    },
    // 打开解决告警
    *openResolveModal({ payload }, { select, put, call }) {
      const { operateAlertIds, data, state } = payload
      if (operateAlertIds.length === 0) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
      } else {
        const checkResponse = (yield checkOperationExecutable({ operateCode: 170, incidentIds: operateAlertIds }) || {}).data;

        if (checkResponse && checkResponse.failed && checkResponse.failed.length > 0) {
          payload && payload.checkFailPayload && payload.checkFailPayload({ checkResponse, operateCode: 170 });
          return;
        }
        yield put({ type: 'toggleResolveModal', payload: payload.state })
      }
    },
    // 解决告警
    *resolveAlert({ payload }, { select, put, call }) {
      const { operateAlertIds, resolveMessage } = payload;
      let resultData = null
      if (operateAlertIds !== undefined) {
        let stingIds = operateAlertIds.map(item => '' + item)
        //按钮发起请求加载中
        yield put({
          type: 'alertDetail/toggleButtonLoading',
          payload: true
        });
        // debugger
        resultData = yield resolve({
          incidentIds: stingIds,
          resolveMessage
        })
        if (resultData.result) {
          if (resultData.data.result) {
            yield put({
              type: 'alertDetail/toggleButtonLoading',
              payload: false
            });
            yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
          } else {
            yield message.error(`${resultData.data.failures}`, 3);
          }
        } else {
          yield message.error(resultData.message, 3);
        }
        payload && payload.resolve && payload.resolve(resultData);
      } else {
        payload && payload.resolve && payload.resolve(false);
        console.error('operateAlertIds error');
      }

      yield put({
        type: 'toggleResolveModal',
        payload: false
      })
      resultData.result
        && resultData.data.result
        && Animate.generate({
          content: getMotionMessage('Resolve', operateAlertIds.length || 0),
          node: getMotionNode('Resolve'),
          callback: (node) => {
            callbackMotion(node)
          }
        })

    },
    // 打开分享到ChatOps的modal
    *openChatOps({ payload }, { select, put, call }) {
      const { operateAlertIds } = payload
      if (operateAlertIds.length === 0) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
      } else if (operateAlertIds.length > 1) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip2'], 3);
      } else {
        const options = yield getChatOpsOptions();
        if (options.result) {
          yield put({
            type: 'setChatOpsRoom',
            payload: options.data || [],
          })
        }
        yield put({
          type: 'toggleChatOpsModal',
          payload: true
        })
      }
    },
    *shareChatOps({ payload }, { select, put, call }) {
      const { selectedAlertIds, data } = payload;
      if (selectedAlertIds.length === 1 && selectedAlertIds[0] !== undefined) {
        delete selectedAlertIds[0]['timeLine']
        let roomId = data.id;
        let incidentId = selectedAlertIds[0]['id'];
        let roomName = data.roomName
        const shareResult = yield shareRoom(roomId, incidentId, roomName, {
          body: {
            type: 'alert',
            data: {
              ...selectedAlertIds[0],
              severityDesc: window['_severity'][selectedAlertIds[0]['severity']],
              status: window['_status'][selectedAlertIds[0]['status']]
            }
          }
        });
        if (shareResult.result) {
          yield message.success(window.__alert_appLocaleData.messages['constants.success'], 2)
        } else {
          yield message.error(`${shareResult.message}`, 2)
        }

        payload && payload.resolve && payload.resolve(shareResult);
      }
      yield put({
        type: 'toggleChatOpsModal',
        payload: false
      })
    },
    // 分组显示
    *groupView({ payload: { data, resolve } }, { select, put, call }) {
      yield put({
        type: 'setGroupType',
        payload: data
      })
      resolve && resolve({ result: true, group: data });
    },
    // 无分组显示
    *noGroupView({ payload }, { select, put, call }) {
      yield put({
        type: 'removeGroupType',
      })
      payload && payload.resolve && payload.resolve();
    },
    // 列定制
    *checkColumn({ payload }, { select, put, call }) {
      yield put({ type: 'setColumn', payload: payload.value })
      const selectColumn = yield select(state => state.alertOperation.selectColumn)
      payload && payload.resolve && payload.resolve({ selectColumn });
    },

    //接手
    *takeOver({ payload }, { select, put, call }) {
      const alertIds = payload.operateAlertIds;
      if (alertIds.length === 0) {
        yield message.warn(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
      } else {
        let response = yield call(takeOverService, { alertIds });
        if (response.result) {
          const { success, failed, lang } = response.data;
          if (Array.isArray(success) && success.length > 0) {
            const successMsg = success.map(item => `${item.name}: ${item['msg']}`).join('\n');
            message.success(successMsg, 3);
            Animate.generate({
              content: getMotionMessage('TakeOver', alertIds.length || 0),
              node: getMotionNode('TakeOver'),
              callback: (node) => {
                callbackMotion(node)
              }
            })
          } else if (Array.isArray(failed) && failed.length > 0) {
            const failedMsg = failed.map(item => `${item.name}: ${item['msg']}`).join('\n');
            message.error(failedMsg, 3);
            response.result = false
          }

          payload && payload.resolve && payload.resolve(response);
        } else {
          message.error(`${response.message}`, 2)
          payload && payload.resolve && payload.resolve(false);
        }
      }
    }

  },

  reducers: {
    //setUsers
    setUsers(state, { payload: { notifyUsers } }) {
      return { ...state, notifyUsers }
    },
    // 列定制初始化
    initColumn(state, { payload: { baseCols, extend, tags } }) {
      let newList = JSON.parse(JSON.stringify(initalState.columnList));
      if (extend.cols && extend.cols.length !== 0) {
        extend.cols.forEach((col) => {
          col.checked = false;
        })
        newList[1] = extend;
      }
      newList && newList.forEach((group) => {
        group.cols.forEach((col) => {
          baseCols.forEach((column, index) => {
            if (column.key === col.id) {
              col.checked = true;
            }
          })
        })
      })
      return { ...state, columnList: newList, extendColumnList: extend.cols, extendTagsKey: tags }
    },
    // show more时需要叠加columns
    addProperties(state, { payload: { properties, tags } }) {
      const { columnList, extendTagsKey } = state;
      let colIds = [];
      let newTags = [].concat(extendTagsKey);
      columnList.forEach((item) => {
        if (item.type == 1) {
          item.cols.forEach((col) => {
            colIds.push(col.id)
          })
        }
      })
      if (properties.cols && properties.cols.length !== 0) {
        properties.cols.forEach((targetCol) => {
          if (!colIds.includes(targetCol.id)) {
            targetCol.checked = false;
            columnList[columnList.length - 1].cols.push(targetCol)
          }
        })
      }
      if (tags.length !== 0) {
        tags.forEach((tag) => {
          if (!extendTagsKey.includes(tag)) {
            newTags.push(tag)
          }
        })
      }
      return { ...state, columnList: columnList, extendColumnList: columnList[columnList.length - 1].cols, extendTagsKey: newTags }
    },
    // 列改变时触发
    setColumn(state, { payload: selectCol }) {
      const { columnList, selectColumn } = state;
      let arr = []
      if (selectColumn.length != 0) {
        arr = selectColumn.filter((col) => col.key != selectCol);
      }
      const newList = columnList.map((group) => {
        group.cols.map((col) => {
          if (typeof selectCol !== 'undefined' && col.id === selectCol) {
            col.checked = !col.checked;
          }
          const ifAddCondition = selectColumn.length == 0 ? col.checked : (col.checked && col.id === selectCol);
          if (ifAddCondition) {
            if (col.id == 'source' || col.id == 'lastTime' || col.id == 'lastOccurTime' || col.id == 'count' || col.id == 'status' || col.id == 'owner' || col.id == 'suppressionFlag') {
              arr.push({ key: col.id, title: col.name, order: true, isFixed: col.isFixed }) // order字段先定死
            } else {
              arr.push({ key: col.id, title: col.name, isFixed: col.isFixed })
            }
          }
          return col;
        })
        return group;
      })


      localStorage.setItem('__alert_list_userColumns', JSON.stringify(arr))
      return { ...state, columnList: newList, selectColumn: arr }
    },
    // 设置合并子列表
    setMergeInfoList(state, { payload }) {
      return { ...state, mergeInfoList: payload }
    },
    // 设置要被解除的告警
    setRelieveAlert(state, { payload: relieveAlert }) {
      return { ...state, relieveAlert }
    },
    // 设置chatOps群组
    setChatOpsRoom(state, { payload }) {
      return { ...state, chatOpsRooms: payload }
    },
    // 设置工单类型
    setFormOptions(state, { payload }) {
      return { ...state, formOptions: payload }
    },
    // 设置分组显示的类型
    setGroupType(state, { payload: selectGroup }) {
      return { ...state, selectGroup, isGroup: true }
    },
    // 移除分组显示的类型
    removeGroupType(state) {
      return { ...state, selectGroup: initalState.selectGroup, isGroup: false }
    },
    // 转换modal状态
    toggleFormModal(state, { payload: isShowFormModal }) {
      return { ...state, isShowFormModal }
    },
    toggleChatOpsModal(state, { payload: isShowChatOpsModal }) {
      return { ...state, isShowChatOpsModal }
    },
    toggleCloseModal(state, { payload: isShowCloseModal }) {
      return { ...state, isShowCloseModal }
    },
    toggleMergeModal(state, { payload: isShowMergeModal }) {
      return { ...state, isShowMergeModal }
    },
    toggleRelieveModal(state, { payload: isShowRelieveModal }) {
      return { ...state, isShowRelieveModal }
    },
    toggleResolveModal(state, { payload: isShowResolveModal }) {
      return { ...state, isShowResolveModal }
    },
    toggleSuppressTimeSliderModal(state, { payload: isShowTimeSliderModal }) {
      return { ...state, isShowTimeSliderModal }
    },
    toggleRemindModal(state, { payload: isShowRemindModal }) {
      return { ...state, isShowRemindModal }
    },
    initManualNotifyModal(state, { payload: { isShowNotifyModal = false, notifyIncident = {}, notifyUsers = [], disableChatOps = false } }) {
      return { ...state, isShowNotifyModal, notifyIncident, notifyUsers, disableChatOps }
    },
    // selectRows是合并告警时触发
    selectRows(state, { payload: originAlert }) {
      return { ...state, originAlert }
    },
    // remove告警
    removeAlert(state, { payload }) {
      const { mergeInfoList } = state;
      const newList = mergeInfoList.filter((item) => (item.id !== payload))
      return { ...state, mergeInfoList: newList }
    },

    //修改 “派单” “关闭” “解决” “转派” “合并” “接手” 六个按钮的状态
    setButtonsDisable(state, { payload: disabled = true }) {
      return {
        ...state,
        takeOverDisabled: disabled,
        dispatchDisabled: disabled,
        closeDisabled: disabled,
        resolveDisabled: disabled,
        notifyDisabled: disabled,
        shareDisabled: disabled,
        mergeDisabled: disabled,
        reassignDisabled: disabled,
        suppressDisabled: disabled,
        chatOpsDisabled: disabled,
      }
    },
    toggleReassignModal(state, { payload: isShowReassingModal }) {
      return {
        ...state,
        isShowReassingModal
      }
    },
    // 关闭工单
    closeTicketModal(state) {
      return {
        ...state,
        isShowTicketModal: false,
        ticketUrl: '',
      }
    },
    // 派发工单框
    toggleTicketModal(state, { payload: payload }) {
      return { ...state, ...payload }
    },

    // 显示告警
    changeShowOperation(state, { payload: { showOperations } }) {
      return { ...state, showOperations }
    }
  }
}
