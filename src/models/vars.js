
import { getField } from '../services/alertAssociationRules'

const initialState = {
  list: []
}

export default {
  namespace: 'vars',
  state: initialState,
  effects: {
    *initVars({ payload }, { call, put, select }) {
      const response = yield getField();
      const list = response.data;
      yield put({
        type: 'setList',
        payload: { list }
      })
    }
  },

  reducers: {
    setList(state, { payload: { list } }) {
      return { ...state, list };
    }
  }
}