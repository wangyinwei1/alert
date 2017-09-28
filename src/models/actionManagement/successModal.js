import { message } from 'antd'
import {

} from '../../services/alertMotionManagement';

const initalState = {
  isShow: false,
  ByIdsData: {},//id完成导入返回结果
}
export default {
  namespace: 'am_successModal',

  state: initalState,

  effects: {

  },

  reducers: {
    //是否显示弹框
    toggleModal(state, { payload: { status, ByIdsData } }) {
      return ByIdsData ? { ...state, isShow: status, ByIdsData } : { ...state, isShow: status }
    },
  },
}
