import {parse} from 'qs'
import pathToRegexp from 'path-to-regexp';
import { getAllTagsKey, getTagValues} from '../services/alertTags.js'
import { message } from 'antd'

const initalState = {
    filteredTags: {},
    tagsKeyList: [
      // {key: 'severity', keyName: '告警等级', tagSpread: true, selectedChildren: [{ name: '3'}]},
      // {key: 'status', keyName: '告警状态', tagSpread: false, selectedChildren: [{ name: '150'}]},
      // {key: 'source', keyName: '来源', tagSpread: false, selectedChildren: [{name: '青山湖'}]}
    ], // modal中的数据集合
    selectList: [/*{id: '11', key: 'aa', value: '标签1'}, {id: '21', key: 'aa', value: '标签2'}, {id: '31', key: 'aa', value: '标签3'}*/], // 模糊查询所匹配的内容
    shareSelectTags: [
      //{key: 'severity', keyName: '告警等级', values: [3,2,1,0]}
    ],
    currentPage: 1, // 当前页
    pageSize: 10 // 条数
}

export default {
  namespace: 'tagListFilter',

  state: initalState,

  subscriptions: {
    pageSetUp({ dispatch, history }) {
      history.listen((location, state) => {
        if (pathToRegexp('/alertManage/alertList').test(location.pathname)) {
          let key = localStorage.getItem('__visual_group') || '';
          let columns = JSON.parse(localStorage.getItem(`__alert_${key}_colums`)) || []
          dispatch({
            type: 'alertListTable/initCustomCols',
            payload: columns
          })
          dispatch({
            type: 'initTagsList',
          });
          dispatch({
            type: 'alertDetail/toggleDetailModal',
            payload: false
          })
        }
      });
    },
  },

  effects: {
    // 初始化
    *initTagsList({payload}, {select, put, call}) {
      const filterTags = yield JSON.parse(localStorage.getItem('alertListPath'));
      yield put({
        type: 'initalshareSelectTags',
        payload: {
          originTags: filterTags
        }
      })
      const filteredTags = yield select( state => state.tagListFilter.filteredTags )
      yield put({
        type: 'alertList/queryAlertBar',
        payload: {...filteredTags} || {}
      })
    },
    // 打开维度选择
    *openSelectModal({payload: callback}, {select, put, call}) {
      const tagKeysList = yield getAllTagsKey();

      if (tagKeysList.result && tagKeysList.data.length !== 0) {
        yield put({
          type: 'setTagsKeyList',
          payload: {
            tagsKeyList: tagKeysList.data || [],
          }
        })
        yield callback()
      } else {
        yield message.error(tagKeysList.message, 3);
      }
    },
    // 时间过滤
    *selectTime({payload}, {select, put, call}) {
      if (payload !== undefined) {
        const filteredTags = yield select( state => state.tagListFilter.filteredTags )
        yield put({ type: 'alertManage/setSelectedTime', payload: payload})
        yield put({ type: 'alertList/queryAlertBar', payload: {...filteredTags} })
        yield put({ type: 'visualAnalyze/queryVisualList', payload: {isFirst: true} })
        yield put({ type: 'alertOperation/setButtonsDisable'})
      }
    },
    // 状态过滤
    *selectStatus({payload}, {select, put, call}) {
      if (payload !== undefined) {
        const filteredTags = yield select( state => state.tagListFilter.filteredTags )
        yield put({ type: 'alertManage/setSelectedStatus', payload: payload})
        yield put({ type: 'alertList/queryAlertBar', payload: {...filteredTags} })
        yield put({ type: 'visualAnalyze/queryVisualList', payload: {isFirst: true} })
        yield put({ type: 'alertOperation/setButtonsDisable'})
      }
    },
    // 查询标签对应的值
    *queryTagValues({payload}, {select, put, call}) {
      const pageSize = yield select( state => state.tagListFilter.pageSize );
      if (payload !== undefined && payload.key !== undefined && payload.value !== undefined) {
        const tagValues = yield call(getTagValues, {
          key: payload.key,
          value: payload.value,
          currentPage: 1,
          pageSize
        });
        if (!tagValues.result) {
          yield message.error(tagValues.message, 2);
        }
        let tags = [];
        if(tagValues.result) {
          tags = tagValues.data;
        }
        yield put({
          type: 'setSelectList',
          payload: {
            selectList: tags,
            targetKey: payload.key,
            currentPage: 1
          }
        })
        payload.callback && payload.callback()
      } else {
        console.error('query params type error')
      }
    },
    // loadMore，滚动时加载更多
    *loadMore({payload}, {select, put, call}) {
      let { currentPage, pageSize } = yield select( state => {
        return {
          'currentPage': state.tagListFilter.currentPage,
          'pageSize': state.tagListFilter.pageSize
        }
      });
      currentPage = currentPage + 1;
      if (payload !== undefined && payload.key !== undefined && payload.value !== undefined) {
        const tagValues = yield call(getTagValues, {
          ...payload,
          currentPage,
          pageSize
        });
        if (!tagValues.result) {
          yield message.error(tagValues.message, 2);
        }
        yield put({
          type: 'loadMoreSelectList',
          payload: {
            selectList: tagValues.result ? tagValues.data : [],
            targetKey: payload.key,
            currentPage
          }
        })
      } else {
        console.error('query params type error')
      }
    },
    // 查询时间线和列表 + 将shareSelectTags更改
    *addTag({payload}, {select, put, call}) {
      yield put({ type: 'saveSelectTag', payload: {key: payload.field, target: payload.item}})
      yield put({ type: 'filterTags'})
      const filteredTags = yield select( state => state.tagListFilter.filteredTags )
      yield put({ type: 'alertList/queryAlertBar', payload: {...filteredTags} })
      yield put({ type: 'visualAnalyze/queryVisualList', payload: {isFirst: true} })
      yield put({ type: 'alertOperation/setButtonsDisable'})
    },
    *removeTag({payload}, {select, put, call}) {
      yield put({ type: 'removeSelectTag', payload: payload })
      yield put({ type: 'filterTags'})
      const filteredTags = yield select( state => state.tagListFilter.filteredTags )
      yield put({ type: 'alertList/queryAlertBar', payload: {...filteredTags} })
      yield put({ type: 'visualAnalyze/queryVisualList', payload: {isFirst: true} })
      yield put({ type: 'alertOperation/setButtonsDisable'})
    },
  },

  reducers: {
    // 初始化数据
    initalshareSelectTags(state, { payload: {originTags}}) {
      let filter = {};
      let shareSelectTags = [];
      let keys = Object.keys(originTags);
      keys.length > 0 && keys.forEach( (key, index) => {
          filter[key] = originTags[key]['values']
          shareSelectTags.push({key: originTags[key]['key'], keyName: originTags[key]['keyName'], values: [originTags[key]['values']] })
      })
      return { ...state, shareSelectTags, filteredTags: filter }
    },
    // 维度变化
    changeTags(state, {payload: filter}) {
      let {shareSelectTags, tagsKeyList} = state;
      tagsKeyList.forEach( (item) => {
        if (item.key === filter.key) {
          item.checked = !filter.checked;
        }
      })
      if (filter.checked) {
        shareSelectTags = shareSelectTags.filter( item => item.key !== filter.key )
      } else {
        shareSelectTags.push({
          key: filter.key,
          keyName: filter.keyName,
          values: []
        })
      }
      return {...state, shareSelectTags, tagsKeyList}
    },
    // 存储tagsKeyList
    setTagsKeyList(state, {payload: {tagsKeyList}}) {
      const { shareSelectTags } = state;
      tagsKeyList.length > 0 && tagsKeyList.forEach( (tagkey, index) => {
        tagkey.checked = false;
        shareSelectTags.length > 0 && shareSelectTags.forEach( (tag, itemIndex) => {
          if (tagkey.key === tag.key) {
              tagkey.checked = true;
          }
        })
      })
      return { ...state, tagsKeyList }
    },
    // 保存选择的标签
    saveSelectTag(state, {payload: {key, target}}) {
      const { selectList, shareSelectTags } = state;
      shareSelectTags.forEach( (item) => {
        if(item.key === key) {
          if(item.values.includes(target.value)) {
            item.values = item.values.filter( item => item !== target.value )
          } else {
            item.values.push(target.value)
          }
        }
      })
      selectList.forEach( (item) => {
        if(item.value === target.value) {
          if(typeof item.checked === 'undefined') {
            item.checked = true;
          } else {
            delete item.checked
          }
        }
      })
      return { ...state, shareSelectTags, selectList }
    },
    // 过滤数据给后台
    filterTags(state) {
      const { shareSelectTags } = state;
      let source = {};
      let result = shareSelectTags.filter( (item) => {
        item.values !== undefined && item.values.forEach( (tag) => {
            if ( source[item.key] ) {
              source[item.key] = source[item.key] + ',' + tag;
            } else {
              source[item.key] = tag;
            }
        })
        return item.values.length > 0;
      })
      let __alert_visualAnalyze_gr1 = result.filter( item => item.key !== 'severity' && item.key !== 'status' && item.key !== 'source').map( (item) => {
        let child = {};
        child['key'] = item['key']
        child['value'] = item.values.join(',')
        return child
      })
      localStorage.setItem('__alert_visualAnalyze_gr1', JSON.stringify(__alert_visualAnalyze_gr1))
      return { ...state, filteredTags: source }
    },
    // 移除标签值
    removeSelectTag(state, { payload: target }) {
      let { shareSelectTags, selectList} = state;
      const newList = shareSelectTags.map( (item) => {
        if (target.field == item.key) {
          let newValues = item.values.filter( (child) => {
            return target.name != child
          })
          item.values = newValues;
        }
        return item;
      })
      selectList.forEach( (item) => {
        if(item.value === target.name) {
          delete item.checked
        }
      })
      return { ...state, shareSelectTags: newList, selectList }
    },
    // 在查询values时和已选择内容做匹配
    setSelectList(state, {payload: {selectList, targetKey, currentPage}}) {
      const { shareSelectTags } = state;
      let newList = shareSelectTags.map( (tag, index) => {
        if (tag.key === targetKey) {
          tag.values.forEach( (val) => {
            selectList.forEach( (select) => {
              if (select.value == val) {
                select.checked = true;
              }
            })
          })
        }
        return tag
      })
      return { ...state, shareSelectTags: newList, selectList, currentPage }
    },
    loadMoreSelectList(state, {payload: {selectList, targetKey, currentPage}}) {
      let { shareSelectTags, selectList: prevList } = state;
      let newList = shareSelectTags.map( (tag, index) => {
        if (tag.key === targetKey) {
          tag.values.forEach( (val) => {
            selectList.forEach( (select) => {
              if (select.value == val) {
                select.checked = true;
              }
            })
          })
        }
        return tag
      })
      prevList.push(...selectList)
      return { ...state, shareSelectTags: newList, selectList: prevList, currentPage }
    },
    clear(state) {
      return { ...state, ...initalState }
    }
  }
}
