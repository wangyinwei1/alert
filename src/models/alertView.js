import { returnByIsReRender } from '../utils'
import { getAllView, getViewById, saveView, updateView, deleteView } from '../services/treeMap.js'
import {message} from 'antd'

const initialState = {
  views: [],
  toAddView: {},
  toEditView: {},
  currentView: {},
  isShowViewModal: false,
  isLoadingView: false,
}

// 视图model
export default {
  namespace: 'alertView',
  state: initialState,

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({
        type: "queryViews"
      })
    }
  },

  reducers: {
    setViews(state, { payload: { views, isReRender } }) {
      return returnByIsReRender(state, { views }, isReRender);
    },
    setCurrentView(state, { payload: { currentView, isReRender } }) {
      return returnByIsReRender(state, { currentView }, isReRender)
    },
    toggleViewModalVisible(state, { payload: { isShowViewModal, isLoadingView, isReRender } }) {
      return returnByIsReRender(state, { isShowViewModal, isLoadingView }, isReRender);
    },
    toggleLoadingView(state, { payload: { isLoadingView, isReRender } }) {
      return returnByIsReRender(state, { isLoadingView }, isReRender);
    }
  },

  effects: {
    *queryViews({ payload }, { select, put, call }) {
      const response = yield getAllView();
      if(response.result) {
        const data = response.data;
        yield put({
          type: "setViews",
          payload: {
            views: data
          }
        })
      } else {
        message.error(response.message);
      }
    },
    *toAddView({ payload }, { select, put, call }) {
      yield put({
        type: 'setCurrentView',
        payload: { currentView: { }, isReRender: false }
      });
      yield put({
        type: "toggleViewModalVisible",
        payload: {
          isShowViewModal: true,
          isLoadingView: false
        }
      });
    },
    *toEditView({ payload: { id } }, { select, put, call }) {
      yield put({
        type: "toggleViewModalVisible",
        payload: {
          isShowViewModal: true, isLoadingView: true
        }
      });
      yield put({
        type: 'setCurrentView',
        payload: { currentView: { id } }
      });

      const response = yield getViewById(id);
      if(response.result) {
        yield put({
          type: 'toggleLoadingView',
          payload: {isLoadingView: false, isReRender: false}
        });
        yield put({type: 'setCurrentView', payload: { currentView: response.data }});
      } else {
        yield put({
          type: 'toggleLoadingView',
          payload: {isLoadingView: false}
        });
        message.error(response.message);
      }

    },
    *saveView({ payload: { view } }, { select, put, call }) {
      const { currentView, views } = yield select((state) => {
        return state.alertView
      });
      const toSaveView = { ...currentView, ...view };
      yield put({
        type: 'setCurrentView',
        payload: { currentView: toSaveView, isReRender: false }
      })
      yield put({
        type: 'toggleLoadingView',
        payload: {isLoadingView: true}
      });
      const saveRes = yield saveView(toSaveView);
      if(saveRes.result) {
        yield put({
          type: 'toggleLoadingView',
          payload: {isLoadingView: true, isReRender: false}
        });
        yield put({
          type: "toggleViewModalVisible",
          payload: {
            isShowViewModal: false,
            isReRender: false
          }
        });

        yield put({
          type: "queryViews"
        })

        message.success(saveRes.data.msg)
      } else {
        yield put({
          type: "toggleLoadingView",
          payload: {
            isLoadingView: false
          }
        });

        message.error(saveRes.message);
      }

    },
    *updateView({ payload: { view } }, { select, put, call }) {
      const { currentView, views } = yield select((state) => {
        return state.alertView
      });
      const toUpdateView = { ...currentView, ...view };
      toUpdateView.tagIds = (toUpdateView.tags || []).map((tag) => tag.id);
      yield put({
        type: "toggleLoadingView",
        payload: {
          isLoadingView: true
        }
      });
      const updateRes = yield updateView(toUpdateView);
      if(updateRes.result) {
        yield put({
          type: "toggleLoadingView",
          payload: {
            isLoadingView: false,
            isReRender: false
          }
        });
        yield put({
          type: "toggleViewModalVisible",
          payload: {
            isShowViewModal: false,
            isReRender: false
          }
        });

        yield put({
          type: "queryViews"
        })

        message.success(updateRes.data.msg)
      } else {
        yield put({
          type: "toggleLoadingView",
          payload: {
            isLoadingView: false
          }
        });

        message.error(updateRes.message);
      }
    },
    *deleteView({ payload: { id } }, { select, put, call }) {
      yield put({
        type: "toggleLoadingView",
        payload: {
          isLoadingView: true,
        }
      });

      const deleteRes = yield deleteView(id);

      if(deleteRes.result) {
        yield put({
          type: "toggleLoadingView",
          payload: {
            isLoadingView: false,
            isReRender: false
          }
        });
        yield put({
          type: "toggleViewModalVisible",
          payload: {
            isShowViewModal: false,
            isReRender: false
          }
        });

        yield put({
          type: "queryViews"
        })

        message.success(deleteRes.data.msg);
      } else {
        yield put({
          type: "toggleLoadingView",
          payload: {
            isLoadingView: false
          }
        });

        message.error(deleteRes.message);
      }
    }
  }
}