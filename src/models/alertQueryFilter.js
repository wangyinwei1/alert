import { queryFilters, saveFilter, deleteFilter } from '../services/alertQuery'
import { getUsersByIds } from '../services/app'
import { returnByIsReRender } from '../utils'
import { message } from 'antd'

const initialState = {
  filters: [],
  selectedFilterId: undefined, // 选中的搜索条件
  toDeleteFilter: undefined, // 待删除的搜索条件
  isShowDeleteModal: false, // 是否显示删除modal
  isShowSaveModal: false, // 是否显示保存modal
  toSaveFilter: undefined, // 待保存的搜索条件
  toDeleteFilter: undefined, // 待删除的搜索条件
}

export default {
  namespace: 'alertQueryFilter',
  state: initialState,
  reducers: {
    setFilters(state, { payload: { filters, isReRender } }) {
      return returnByIsReRender(state, { filters }, isReRender)
    },
    setSelectFilter(state, { payload: { selectedFilterId, isReRender } }) {
      return returnByIsReRender(state, { selectedFilterId }, isReRender);
    },
    // 显示搜索条件保存modal
    openSaveModal(state, { payload: { toSaveFilter, isReRender } }) {
      return returnByIsReRender(state, { toSaveFilter, isShowSaveModal: true }, isReRender);
    },
    // 关闭搜索条件保存modal
    closeSaveModal(state, { payload: { isReRender } = {} }) {
      return returnByIsReRender(state, { toSaveFilter: undefined, isShowSaveModal: false })
    },
    // 显示搜索条件删除modal
    openDeleteModal(state, { payload: { id, isReRender } }) {
      const filters = state.filters;
      const toDeleteFilter = filters.filter((filter) => filter.id == id)[0];
      state.toDeleteFilter = undefined;
      return returnByIsReRender(state, { toDeleteFilter, isShowDeleteModal: true }, isReRender);
    },
    // 隐藏搜索条件删除modal
    closeDeleteModal(state, { payload: { isReRender } = {} }) {
      return returnByIsReRender(state, { toDeleteFilter: undefined, isShowDeleteModal: false }, isReRender);
    },

  },
  effects: {
    *selectFilter({ payload: { selectedFilterId, resolve } }, { select, put, call }) {
      yield put({
        type: 'setSelectFilter',
        payload: { selectedFilterId }
      })

      const filters = yield select((state) => state.alertQueryFilter.filters);
      const selectedFilter = filters.filter((filter) => filter.id == selectedFilterId)[0];

      // 通过ownerId查询ownerName，页面上需要ownerName来显示选中的用户
      let ownerName = undefined;
      const ownerId = selectedFilter.incidentHistoryParam.ownerId;

      if(ownerId && ownerId != '') {
        const userRes = yield getUsersByIds([ownerId]);
        if(userRes.result) {
          const users = userRes.data;
          if(users.length > 0) {
            ownerName = users[0].realName;
          }
        }

        selectedFilter.incidentHistoryParam.owner = {
          key: ownerId,
          label: ownerName
        }
      }

      resolve && resolve(selectedFilter);
    },

    *queryFilters({ payload }, { select, put, call }) {
      const response = yield queryFilters();
      if (response.result) {
        yield put({
          type: 'setFilters',
          payload: {
            filters: response.data.data
          }
        })
      } else {
        message.error(response.message);
      }
    },

    *saveFilter({ payload: { name } }, { select, put, call }) {
      const { toSaveFilter, filters } = yield select((state) => state.alertQueryFilter);
      const response = yield saveFilter({ ...toSaveFilter }, name);
      if (response.result) {
        const data = response.data;
        if (data.result) {
          message.success(data.message);
          const id = data.data.id;
          yield put({
            type: 'setFilters',
            payload: {
              filters: [...filters, { incidentHistoryParam: { ...toSaveFilter }, name, id}],
              isReRender: false,
            }
          })

          yield put({
            type: 'closeSaveModal',
          })
        } else {
          message.error(data.message);
        }
      } else {
        message.error(response.message);
      }
    },

    *deleteFilter({ payload: { id } }, { put, select, call }) {
      const response = yield deleteFilter(id);
      const { filters } = yield select((state) => state.alertQueryFilter);
      if (response.result) {
        const data = response.data;
        if (data.result) {
          message.success(data.message)
          const newFilters = filters.filter((item) => item.id != id);
          yield put({
            type: 'setFilters',
            payload: {
              filters: newFilters,
              isReRender: false,
            }
          })
          yield put({
            type: 'closeDeleteModal'
          })
        } else {
          message.error(data.message);
        }
      } else {
        message.error(response.message);
      }
    }
  }
}
