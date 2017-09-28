import { queryAlertOrigin } from '../services/alertQuery.js'
import { message } from 'antd'

const initState = {
  loading: false,
  visible: false,
  alertName: '',
  times: 0,
  records: [],
  pagination:{ pageNo:1, pageSize:10 },
  sorter: { sortKey:'occurTime', sortType: 0 },
  searchParam: {}, // 过滤条件
}

export default {
  namespace: 'alertOrigin',
  state: initState,
  reducers: {
    toggleLoading(state, { payload: { loading }}) {
      return { ...state, loading};
    },

    setData(state, { payload }) {
      return { ...state, ...payload }
    },

    toggleVisible(state, { payload: { visible, alertName } }) {
      return { ...state, visible, alertName, searchParam: {} };
    },

    initPage(state, { payload }) {
      return { ...state, pagination: initState.pagination }
    }
  },

  effects: {
    // 查询
    *queryAlertOrigin({payload={}}, {call, put, select}) {
      const { searchParam, pagination={}, sorter={} } = payload;
      yield put({
        type: 'toggleLoading',
        payload: {
          loading: true
        }
      })
      const oldAlertOrigin = yield select((state) => state.alertOrigin);
      const {searchParam: oldSearchParam } = oldAlertOrigin;
      const newSearchParam = {...oldSearchParam, ...searchParam};
      payload.pagination = { ...oldAlertOrigin.pagination, ...pagination }
      payload.sorter = { ...oldAlertOrigin.sorter,  ...sorter};
      const newAlertOrigin = { ...oldAlertOrigin,  ...payload}
      const response = yield queryAlertOrigin({ pagination: newAlertOrigin.pagination, sorter: newAlertOrigin.sorter, alertId: newAlertOrigin.alertId, searchParam: {...newSearchParam} })
      // 请求无论成功还是失败都停止“记载中”状态
      yield put({
        type: 'toggleLoading',
        payload: {
          loading: false
        }
      })
      if(!response.result) {
        yield message.error(response.message, 2);
        return;
      }
      const responseData = response.data;
      const records = responseData.records.map((row, index) => {
        const time = new Date(row.occurTime);
        const occurTime = time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate() + " " + time.getHours() + ":" + (time.getMinutes() < 10?('0' + time.getMinutes()):time.getMinutes());
        return {...row, key: index, occurTime}}
      )
      const newPayload = {
        ...newAlertOrigin,
        pagination: {
          pageNo: responseData.pageNo,
          pageSize: responseData.pageSize,
          totalPage: responseData.totalPage,
          total: responseData.total,
        },
        records,
        loading: false,
        searchParam: newSearchParam
      }
      yield put({
        type: 'setData',
        payload: newPayload
      })
    },

    *changePage({ payload: { pagination, sorter } }, {call, put, select}) {
      yield put({
        type: 'queryAlertOrigin',
        payload: { pagination, sorter }
      })
    }
  }
}