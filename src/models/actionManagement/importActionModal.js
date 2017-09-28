
import { message } from 'antd'
import {
  importFile,
  importActionByIds
} from '../../services/alertMotionManagement';
import _ from 'lodash'

const initalState = {
  isShow: false,
  saveImportSelectedRowIds: '',
  actionImportListData: [],
  sameNameCount: 0,
  count: 0,
}
export default {
  namespace: 'am_importActionModal',

  state: initalState,

  effects: {
    *importFile({ payload: response }, { select, put, call }) {
      yield put({ type: 'toggleLoading', payload: true });
  
      const actionResult = response;
      //过滤需要替换掉一项
      const hasSameName = _.filter(actionResult.list, (d,i) => {
        return d.hasSameName
      });
      const selectedIds = _.map(hasSameName, (d,i) => {
        return d.id
      })
      if (actionResult) {
        yield put({
          type: 'setActionImportListData', payload: {
            actionImportListData: actionResult.list || [],
            sameNameCount: actionResult.sameNameCount || 0,
            count: actionResult.count || 0,
            saveImportSelectedRowIds: selectedIds.join(','),
          }
        });
        yield put({
          type: 'toggleModal', payload: {
            status: true,
          }
        });
      }
      yield put({ type: 'toggleLoading', payload: false })
    },
    *importActionByIds({ payload }, { select, put, call }) {
      const actionResult = yield call(importActionByIds, payload);
      if (actionResult.result) {
        yield put({
          type: 'toggleModal', payload: {
            status: false
          }
        })
        yield put({
          type: 'am_successModal/toggleModal', payload: {
            status: true,
            ByIdsData: actionResult.data
          }
        })
      }
    },
  },

  reducers: {
    //保存导入选择的id
    setSaveImportSelectedRowIds(state, { payload: { ids } }) {
      return { ...state, saveImportSelectedRowIds: ids }
    },
    //是否显示弹框
    toggleModal(state, { payload: { status } }) {
      return { ...state, isShow: status }
    },
    // 加载状态
    toggleLoading(state, { payload: isLoading }) {
      return { ...state, isLoading }
    },
    //设置弹框列表数据
    setActionImportListData(state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
