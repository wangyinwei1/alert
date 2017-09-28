import { message } from 'antd'
import Cookies from 'js-cookie'
import {
  uploadAction,
  editAction,
  homonymousTest,
} from '../../services/alertMotionManagement';

const initalState = {
  isShow: false,
  isShowReplaceModal: false,
  isReplace: false,
  isEdit: false,
  actionNameValue: '',
  actionDescriptionValue: '',
  currentEditApp: {},
  fileList: [],
  checkboxValue: [1],
  jarId: '',
}
const uploadCommon = () => {

}
export default {
  namespace: 'am_addActionModal',

  state: initalState,

  effects: {
    *uploadAction({ payload }, { select, put, call }) {
      const actionResult = yield call(uploadAction, payload.params);
      if (actionResult.result) {
        yield put({
          type: 'toggleModal',
          payload: {
            status: false,
          }
        })

        if (!Cookies.get('isHiddenSuccessModal')) {
          yield put({
            type: 'am_addSuccessModal/toggleModal',
            payload: {
              status: true,
            }
          })
        }
        
        yield put({
          type: 'alertMotionManagement/queryMotionManagement',
          payload: {}
        })

        //清空form
        payload.form.resetFields();
      } else {
        yield message.error(actionResult.message, 2)
      }
    },
    *isReplaceActionName({ payload }, { select, put, call }) {
      const { jarId, actionNameValue, actionDescriptionValue, scope } = yield select(state => {
        return {
          'jarId': state.am_addActionModal.jarId,
          'actionNameValue': state.am_addActionModal.actionNameValue,
          'actionDescriptionValue': state.am_addActionModal.actionDescriptionValue,
          'scope': state.am_addActionModal.checkboxValue,
        }
      })
      yield put({
        type: 'uploadAction',
        payload: {
          params: {
            jarId,
            actionName: actionNameValue,
            description: actionDescriptionValue,
            scope
          },
          form: payload.form
        },
      })
      yield put({
        type: 'toggleReplaceModal',
        payload: {
          status: false
        }
      })
      yield put({
        type: 'toggleModal',
        payload: {
          status: false
        }
      })
    },
    *homonymousTest({ payload }, { select, put, call }) {
      const actionResult = yield call(homonymousTest, { actionName: payload.params.actionName });
      if (actionResult.data) {
        //有同名出现替换弹框
        yield put({
          type: 'toggleReplaceModal',
          payload: {
            status: true
          }
        })
      } else {
        //没有同名直接上传
        yield put({
          type: 'uploadAction',
          payload: payload,
        })
      }
    },
    *toggleAddModal({ payload }, { select, put, call }) {
      yield put({ type: 'clear' })
      yield put({
        type: 'toggleModal',
        payload: {
          status: true,
          setInitalState: { isEdit: false }
        }
      })
    },
    *toggleEditModal({ payload: { status, applicationItem } }, { select, put, call }) {
      const { scope, actionName, description } = applicationItem || {};
      let setInitalState;
      if (applicationItem)
        setInitalState = {
          currentEditApp: applicationItem || {},
          isEdit: true,
          actionNameValue: actionName || '',
          actionDescriptionValue: description || '',
          checkboxValue: scope || [1]
        }
      else
        setInitalState = { isEdit: true }
      yield put({
        type: 'toggleModal',
        payload: {
          status: status,
          setInitalState,
        }
      })
    },
    *editAction({ payload }, { select, put, call }) {
      const actionResult = yield call(editAction, payload);
      if (actionResult.result) {
        const { actionListData } = yield select(state => {
          return {
            'actionListData': state.alertMotionManagement.actionListData,
          }
        })
        const newDate = _.filter(actionListData, (ad, i) => {
          if (ad.id == payload.id) {
            ad.actionName = payload.actionName;
            ad.description = payload.description;
            ad.scope = payload.scope;
          }
          return true
        })
        yield put({
          type: 'alertMotionManagement/setActionListData', payload: {
            actionListData: newDate,
          }
        })
        yield put({
          type: 'toggleEditModal',
          payload: {
            status: false,
          }
        })
      }
    },
  },

  reducers: {
    //保存jarId
    saveJarId(state, { payload: { jarId } }) {
      return { ...state, jarId: jarId }
    },
    //改变多选框状态
    changeCheckedValue(state, { payload: { value } }) {
      return { ...state, checkboxValue: value }
    },
    //改变文件列表数量并储存jarId
    changeFileList(state, { payload: { fileList } }) {
      console.log(fileList);
      return { ...state, fileList: fileList }
    },
    //是否显示弹框
    toggleModal(state, { payload: { status, setInitalState } }) {
      return { ...state, isShow: status, ...setInitalState }
    },
    //是否需要替换弹框
    toggleReplaceModal(state, { payload: { status } }) {
      return { ...state, isShowReplaceModal: status }
    },
    //清理缓存
    clear(state, { payload }) {
      return initalState
    },
    //动作名称改变
    changeActionNameValue(state, { payload: { value } }) {
      return { ...state, actionNameValue: value }
    },
    //动作描述改变
    changeActionDescriptionValue(state, { payload: { value } }) {
      return { ...state, actionDescriptionValue: value }
    },
  },
}
