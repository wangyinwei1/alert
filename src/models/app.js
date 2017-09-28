import { getUserInformation, getWebNotification } from '../services/app'
import { isSetUserTags } from '../services/alertTags.js'
import { loopWebNotification as loop, delay } from '../utils/index.js'
import { parse } from 'qs'
import { message } from 'antd'


const initialState = {
  isFold: false, //false展开
  isShowMask: false, // 遮罩层
  notifies: [], // 声音记录
  userInfo: JSON.parse(sessionStorage.getItem('UYUN_Alert_USERINFO')) || {}
}

export default {
  namespace: 'app',

  state: initialState,

  subscriptions: {
    loginSetup({ dispatch, history }) {
      dispatch({
        type: 'getUserInfo'
      })
      loop(function() {
        dispatch({type: 'getNotifies'})
      }, 30000) // 默认半分钟轮询一次
    },
  },

  effects: {
    *getUserInfo({ payload }, { put, call, select }) {
        // 初始化的一些操作 比如获取用户信息 (异步的，是当触发isSetTags就会触发下面的flow) delay做一个间隙，确保app/isSetTags执行以后再往下走
        const infoResult = yield call(getUserInformation)
        if (infoResult.result) {
          yield put({ type: 'setUserInfo', payload: infoResult.data })
          yield sessionStorage.setItem('UYUN_Alert_USERINFO', JSON.stringify(infoResult.data))
        }
    },
    *getNotifies({ payload }, { put, call, select }) {
      const loop = yield call(getWebNotification, {
        size: 10 // 接收的告警上限
      })
      if (loop.result) {
        yield put({ type: 'setWebNotification', payload: loop.data || [] })
      } else {
        yield message.error(loop.message, 2)
      }
    },

  },
  reducers: {
    // 声音通知
    setWebNotification(state, { payload: notifies }) {
      return { ...state, notifies }
    },
    // 转化alertManage面板显示(通过设置isShowMask)
    showMask(state, { payload: isShowMask }) {
      return { ...state, isShowMask }
    },
    setUserInfo(state, { payload: userInfo }) {
      return { ...state, userInfo }
    },
    // 转换导航栏的展开
    handleFoldMenu(state) {
      return { ...state, isFold: !state.isFold }
    },
    clear(state) {
      return initialState
    }

  }
}
