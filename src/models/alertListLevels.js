import { message } from 'antd'

import { groupSort, returnByIsReRender } from '../utils'
import { queryLevelStatistic } from '../services/alertList'

const initialState = {
  levels: [],
  isLoading: true,
  begin: undefined,
  end: undefined,
  tags: undefined,
  status: undefined
}

export default {
  namespace: 'alertListLevels',
  state: initialState,
  reducers: {
    setLevels: function(state, { payload: { begin, end, tags, status, levels, isReRender } }) {
      return returnByIsReRender(state, { levels, begin, end, tags, status }, isReRender);
    },
    toggleLoading(state, { payload: { isLoading, isReRender } }) {
      return returnByIsReRender(state, { isLoading }, isReRender );
    }
  },
  effects: {
    // 查询告警级别统计
    *queryLevels({ payload: { begin, end, tags, status }={} }, { call, put, select }) {
      yield put({ type: 'toggleLoading', payload: { isLoading: true } });
      const { begin: oldBegin, end: oldEnd, tags: oldTags, status: oldStatus } = yield select((state) => {
        return state.alertListLevels;
      })

      begin = begin || oldBegin;
      end = end || oldEnd;
      tags = tags || oldTags;
      status = status || oldStatus;

      const res = yield queryLevelStatistic({ begin, end, tags, status });
      if(res.result) {
        const levels = res.data;
        yield put({
          type: 'setLevels',
          payload: {
            begin,
            end,
            tags,
            status,
            levels,
            isReRender: false,
          }
        })
      } else {
        yield put({
          type: 'setLevels',
          payload: {
            begin,
            end,
            tags,
            status,
            levels: [],
            isReRender: false,
          }
        })

        message.error(res.message);
      }

      yield put({ type: 'toggleLoading', payload: { isLoading: false } });
    }
  }
}