import { message } from 'antd'
import {

} from '../../services/alertMotionManagement';

const initalState = {
  isShow: false,
  isChecked: false,
}
export default {
  namespace: 'am_addSuccessModal',

  state: initalState,

  effects: {
    *gotIt({ payload }, { select, put, call }) {
      yield put({
        type: 'toggleModal',
        payload
      })
    }
  },

  reducers: {
    //是否显示弹框
    toggleModal(state, { payload: { status } }) {
      return { ...state, isShow: status, isChecked: false }
    },
    changeChecked(state, { payload: { status } }) {
      return { ...state, isChecked: status }
    }
  },
}
