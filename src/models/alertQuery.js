import { querySource, queryAlertList, queryCount, queryProperty } from '../services/alertQuery'
import { getUsers } from '../services/app.js'
import { viewTicket } from '../services/alertOperation'
import { groupSort, returnByIsReRender } from '../utils'
import { message } from 'antd'
import { parse } from 'qs'
import { injectIntl, formatMessage, defineMessages, IntlProvider } from 'react-intl';

const initalState = {

  haveQuery: false, // 是否包含查询条件
  sourceOptions: [], // 来源
  ownerOptions: [], // 负责人
  propertyOptions: [], // 扩展
  queryCount: {}, // 查询数量结果
  currentQuery: {}, // 当前的查询条件
  currentQueryRawData: {}, //当前查询条件的原始数据，用于回显，需要与currentQuery保持同步更新

  isShowBar: true, // 是否显示搜索项

  isGroup: false,
  groupBy: 'source',

  viewDetailAlertId: false, // 查看详细告警ID

  isShowMore: false,
  isLoading: false,

  orderBy: 'lastOccurTime',
  orderType: 0,
  pageSize: 40,
  currentPage: 1,

  data: [],

  selectGroup: undefined, // 默认是分组设置
  selectColumn: [], // 选择的列
  extendColumnList: [], //扩展字段
  extendTagsKey: [], // 标签
  columnList: [
    {
      type: 0, // id
      cols: [
        { id: 'entityName', checked: true, isFixed: true },
        { id: 'name', checked: false, isFixed: true },
        { id: 'owner', checked: true },
        { id: 'source', checked: false, },
        { id: 'description', checked: false, },
        { id: 'count', checked: false, },
        { id: 'lastTime', checked: false, },
        { id: 'firstOccurTime', checked: false, },
        { id: 'lastOccurTime', checked: false, },
        { id: 'status', checked: false, },
        { id: 'entityAddr', checked: false, },
        { id: 'orderFlowNum', checked: false, },
        { id: 'notifyList', checked: false, },
        { id: 'classCode', checked: false },
        { id: 'tags', checked: false },
        { id: 'suppressionFlag', checked: false }
      ]
    },
  ],

  columns: [{
    key: 'entityName',
    isFixed: true
  }, {
    key: 'name',
    isFixed: true
  }, {
    key: 'owner',
    order: true
  }, {
    key: 'source',
    order: true
  }, {
    key: 'description',
  }, {
    key: 'count',
    order: true
  }, {
    key: 'lastTime',
    order: true
  }, {
    key: 'firstOccurTime',
    order: true
  }, {
    key: 'lastOccurTime',
    order: true
  }, {
    key: 'status',
    order: true
  }, {
    key: 'tags'
  }],
}

export default {
  namespace: 'alertQuery',

  state: initalState,

  subscriptions: {
    alertQuerySetup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/alertQuery') {
          const query = location.query || {};
          dispatch({
            type: 'alertQuerySetup',
            payload: {
              resObjectId: query.resObjectId,
            }
          })

          // alertQuery页面打开后关闭告警详情弹出框
          dispatch({
            type: 'alertDetail/toggleDetailModal',
            payload: false
          })

          // 页面打开后查询所有用户已经保存过的查询条件
          dispatch({
            type: 'alertQueryFilter/queryFilters'
          })
        }
      })

    }
  },

  reducers: {
    // 列定制初始化
    initColumn(state, { payload: { baseCols, extend, tags, isReRender = true } }) {
      let newList = JSON.parse(JSON.stringify(initalState.columnList));
      if (extend.cols && extend.cols.length !== 0) {
        extend.cols.forEach((col) => {
          col.checked = false;
        })
        newList[1] = extend
      }
      newList && newList.forEach((group) => {
        group.cols.forEach((col) => {
          baseCols.forEach((column, index) => {
            if (column.key === col.id) {
              col.checked = true;
            }
          })
        })
      })
      return returnByIsReRender(
        state,
        {
          columnList: newList,
          extendColumnList: extend.cols,
          extendTagsKey: tags
        },
        isReRender
      )
    },
    // show more时需要叠加columns
    addProperties(state, { payload: { properties, tags, isReRender = true } }) {
      let { columnList, extendTagsKey } = state;
      let colIds = [];
      let newTags = [].concat(extendTagsKey);
      columnList.forEach((item) => {
        if (item.type == 1) {
          item.cols.forEach((col) => {
            colIds.push(col.id)
          })
        }
      })
      if (properties.cols && properties.cols.length !== 0) {
        properties.cols.forEach((targetCol) => {
          if (!colIds.includes(targetCol.id)) {
            targetCol.checked = false;
            columnList[columnList.length - 1].cols.push(targetCol)
          }
        })
      }
      if (tags.length !== 0) {
        tags.forEach((tag) => {
          if (!extendTagsKey.includes(tag)) {
            newTags.push(tag)
          }
        })
      }
      if (isReRender) {
        return { ...state, columnList: columnList, extendColumnList: columnList[columnList.length - 1].cols, extendTagsKey: newTags }
      } else {
        state.columnList = columnList;
        state.extendColumnList = columnList[columnList.length - 1].cols;
        state.extendTagsKey = newTags;
        return state;
      }
    },
    // 列改变时触发
    setColumn(state, { payload: { selectCol, isReRender = true } }) {
      const { columnList, selectColumn } = state;
      let arr = []
      if (selectColumn.length != 0) {
        arr = selectColumn.filter((col) => col.key != selectCol);
      }
      const newList = columnList.map((group) => {
        group.cols.map((col) => {
          if (typeof selectCol !== 'undefined' && col.id === selectCol) {
            col.checked = !col.checked;
          }
          const ifAddCondition = selectColumn.length == 0 ? col.checked : (col.checked && col.id === selectCol);
          if (ifAddCondition) {
            if (col.id == 'source' || col.id == 'lastTime' || col.id == 'lastOccurTime' || col.id == 'count' || col.id == 'status' || col.id == 'owner' || col.id == 'suppressionFlag') {
              arr.push({ key: col.id, title: col.name, order: true, isFixed: col.isFixed }) // order字段先定死
            } else {
              arr.push({ key: col.id, title: col.name, isFixed: col.isFixed })
            }
          }
          return col;
        })
        return group;
      })
      localStorage.setItem('__alert_query_userColumns', JSON.stringify(arr))
      return returnByIsReRender(state, { columnList: newList, selectColumn: arr }, isReRender)
    },
    // 设置分组显示的类型
    setGroupType(state, { payload: { selectGroup, isReRender = true } }) {
      return returnByIsReRender(state, { ...state, selectGroup }, isReRender)
    },
    // 移除分组显示的类型
    removeGroupType(state, { payload: { isReRender = true } }) {
      return returnByIsReRender(state, { selectGroup: initalState.selectGroup }, isReRender)
    },
    // 更新查询条件
    setCurrentQuery(state, { payload }) {
      return { ...state, ...payload }
    },
    // 更新data数据
    updateAlertListData(state, { payload: { data, isReRender = true } }) {
      return returnByIsReRender(state, { data }, isReRender)
    },
    // 存放告警来源的options
    setOptions(state, { payload: { sourceOptions, propertyOptions, ownerOptions, isReRender = true } }) {
      return returnByIsReRender(
        state,
        {
          sourceOptions: sourceOptions ? sourceOptions : state.sourceOptions,
          propertyOptions: propertyOptions ? propertyOptions : state.propertyOptions,
          ownerOptions: ownerOptions ? ownerOptions : state.ownerOptions
        },
        isReRender
      )
    },
    // 用来一次性结构状态，避免过度渲染
    changeState(state, { payload }) {
      return { ...state, ...payload }
    },
    // 加载状态
    toggleLoading(state, { payload: { isLoading, isReRender = true } }) {
      return returnByIsReRender(state, { isLoading }, isReRender);
    },
    // 切换加载更多状态
    toggleLoadingMore(state, { payload: { isLoadingMore, isReRender = true } }) {
      return returnByIsReRender(state, { isLoadingMore, isReRender })
    },
    // 更新显示更多字段
    updateShowMore(state, { payload: { isShowMore, isReRender = true } }) {
      return returnByIsReRender(state, { isShowMore }, isReRender)
    },
    // 点击查看更多
    setMore(state, { payload: { currentPage, isReRender = true } }) {
      return returnByIsReRender(state, { currentPage }, isReRender)
    },
    // 初始化data
    clearQuery(state, { payload: { isReRender = true } }) {
      return returnByIsReRender(
        state,
        {
          data: initalState.data,
          currentPage: initalState.currentPage,
          queryCount: initalState.queryCount,
          isShowMore: initalState.isShowMore,
          currentQuery: initalState.currentQuery,
          currentQueryRawData: initalState.currentQueryRawData
        },
        isReRender
      )
    },
    // 不分组更新
    updateAlertListToNoGroup(state, { payload: { info, isShowMore, isGroup, orderBy, orderType, queryCount, currentPage, isReRender = true } }) {
      return returnByIsReRender(state, { data: info, isShowMore, isGroup, orderBy, orderType, queryCount, currentPage }, isReRender)
    },
    // 分组时更新
    updateAlertListToGroup(state, { payload: { info, isShowMore, isGroup, groupBy, isReRender } }) {
      return returnByIsReRender(state, { data: info, isShowMore, isGroup, groupBy }, isReRender);
    },

    // 切换分组
    toggleGroupBy(state, { payload: { isGroup, groupBy, isReRender } }) {
      return returnByIsReRender(state, { isGroup, groupBy, isShowMore: !isGroup });
    },

    // 自定义列
    customCols(state, { payload: { columns, isReRender = true } }) {
      return returnByIsReRender(state, { columns }, isReRender)
    },
    // 手动添加分组展开状态
    addGroupSpread(state, { payload: { classify, isReRender = true } }) {
      const { data } = state;
      const newData = data.map((group) => {
        if (group.classify == classify) {
          group.isGroupSpread = false;
        }
        return group
      })

      return returnByIsReRender(state, { data: newData }, isReRender)
    },
    // 转换分组的展开状态
    toggleGroupSpread(state, { payload: { classify, isReRender = true } }) {
      const { data } = state;
      const newData = data.map((group) => {
        if (group.classify == classify) {
          group.isGroupSpread = !group.isGroupSpread;
        }
        return group
      })
      return returnByIsReRender(state, { data: newData }, isReRender)
    },
    // 排序
    toggleOrder(state, { payload: { orderBy, orderType, isReRender } }) {
      return returnByIsReRender(state, { orderBy, orderType }, isReRender);
    },
    // 显示或隐藏搜索项
    toggleBar(state, { payload: isShowBar }) {
      return { ...state, isShowBar }
    },
    // 修改状态为处理中
    changeCloseState(state, { payload: { arrList, status } }) {
      const { data, isGroup } = state;
      const newData = data.map((item, index) => {
        arrList.forEach((id) => {
          if (item.id == id) {
            item['status'] = status; // 手动变为150 -> 已解决
          }
        })
        return item;
      })
      return { ...state, data: newData }
    },
    // 修改data数组某一行的值
    // 修改data数组某一行的值
    updateDataRow(state, { payload }) {
      const { data, isGroup, isReRender = true } = state;
      let newData = [...data];

      newData = newData.map((tempRow) => {
        if (tempRow['id'] == payload['id']) {
          tempRow = { ...tempRow, ...payload };
        }
        return tempRow;
      });
      return returnByIsReRender(state, { data: newData }, isReRender);
    },
  },
  effects: {
    // beforeCustomCols
    *initCustomCols({ payload }, { call, put, select }) {
      let initColumns = JSON.parse(JSON.stringify(initalState.columns))
      let queryColumns = JSON.parse(localStorage.getItem('__alert_query_userColumns'));
      let columns = queryColumns ? queryColumns : initColumns
      yield put({ type: 'customCols', payload: { columns } })
    },
    /**
     * open alertQuery page operate
     * 1. clear state
     * 3. 查询告警来源的options
     */
    *alertQuerySetup({ payload }, { call, put, select }) {
      // yield put({ type: 'initCustomCols' })
      // yield put({ type: 'alertDetail/toggleDetailModal', payload: false })
      // yield put({ type: 'clearQuery' })
      // yield put({ type: 'setCurrentQuery', payload: { currentQuery: {resObjectId: payload.resObjectId} } })

      yield put({
        type: 'clearQuery',
        payload: {}
      })

      // 若需要查找指定ci的告警
      if (payload && payload.resObjectId) {
        yield put({ type: 'setCurrentQuery', payload: { currentQuery: { resObjectId: payload.resObjectId } } })
      }

      yield put({ type: 'toggle' })

      yield put({ type: 'queryAlertList' })

      // 查询来源和扩展标签
      const [sourceOptions, propertyOptions, ownerOptions] = yield [
        call(querySource),
        call(queryProperty),
        call(getUsers)
      ]

      if (!sourceOptions.result) {
        yield message.error(sourceOptions.message, 3)
      }
      if (!propertyOptions.result) {
        yield message.error(propertyOptions.message, 3)
      }
      if (!ownerOptions.result) {
        yield message.error(ownerOptions.message, 3)
      }
      yield put({
        type: 'setOptions',
        payload: {
          sourceOptions: sourceOptions.result ? sourceOptions.data : [],
          propertyOptions: propertyOptions.result ? propertyOptions.data : [],
          ownerOptions: ownerOptions.result ? ownerOptions.data : [],
        }
      })
    },
    // 负责人查询过程中需要支持模糊查询
    *ownerQuery({ payload }, { call, put, select }) {
      const ownerOptions = yield call(getUsers, {
        realName: payload.realName
      });
      if (!ownerOptions.result) {
        yield message.error(ownerOptions.message, 3)
      }
      yield put({
        type: 'setOptions',
        payload: {
          ownerOptions: ownerOptions.result ? ownerOptions.data : [],
        }
      })
    },

    // 点击查找
    *queryBefore({ payload }, { call, put, select }) {
      yield put({ type: 'setCurrentQuery', payload: { ...payload } })
      yield put({ type: 'queryAlertList' })
      yield put({ type: 'alertDetail/removeGroupType' })
    },

    //查询告警列表
    *queryAlertList({ payload }, { call, put, select }) {

      // payload为空时是有内置的查询条件的
      yield put({
        type: 'changeState',
        payload: {
          isLoading: true,
          haveQuery: true,
        }
      })

      var {
        isGroup,
        groupBy,
        pageSize,
        orderBy,
        orderType,
        currentQuery,
        columns
      } = yield select(state => {
          const alertQuery = state.alertQuery

          return {
            isGroup: alertQuery.isGroup,
            groupBy: alertQuery.groupBy,
            pageSize: alertQuery.pageSize,
            orderBy: alertQuery.orderBy,
            orderType: alertQuery.orderType,
            currentQuery: alertQuery.currentQuery,
            columns: alertQuery.columns
          }
        })
      var extraParams = {};

      if (payload !== undefined && payload.isGroup !== undefined) {
        isGroup = payload.isGroup;
        groupBy = payload.groupBy;
        orderBy = payload.orderBy;
        orderType = payload.orderType;
      }

      // 这里触发时currentPage始终为1，如果从common取在分组转分页时会有问题
      extraParams = {
        pageSize: pageSize,
        currentPage: 1,
        orderBy: orderBy,
        orderType: orderType
      }

      const listData = yield call(queryAlertList, {
        ...currentQuery,
        ...extraParams
      })

      const countData = yield call(queryCount, {
        ...currentQuery
      })

      if (listData.result) {

        yield put({
          type: 'updateAlertListData',
          payload: {
            data: listData.data.data,
            isReRender: false
          }
        })

        yield put({
          type: 'updateShowMore',
          payload: { isShowMore: listData.data.hasNext, isReRender: false }
        })

        yield put({
          type: 'toggleGroupBy',
          payload: {
            isGroup: false,
            isReRender: false
          }
        })

        yield put({
          type: 'toggleLoading',
          payload: { isLoading: false, isReRender: false }
        })
        yield put({
          type: 'initColumn',
          payload: {
            baseCols: columns,
            extend: listData.data.properties,
            tags: listData.data.tagKeys
          }
        })

      } else {
        yield message.error(listData.message, 2)
      }

    },
    // 展开组
    *spreadGroup({ payload }, { call, put, select }) {
      yield put({ type: 'toggleGroupSpread', payload: { classify: payload } })
    },
    // 合拢组
    *noSpreadGroup({ payload }, { call, put, select }) {
      yield put({ type: 'addGroupSpread', payload: { classify: payload } })
    },
    // ------------------------------------------------------------------------------------------------

    // 点击分组时触发
    *setGroup({ payload }, { select, put, call }) {
      yield put({
        type: 'toggleLoading',
        payload: { isLoading: true }
      })
      yield put({
        type: 'toggleGroupBy',
        payload: {
          isGroup: payload.isGroup,
          groupBy: payload.group,
          isReRender: false
        }
      })
      yield put({
        type: 'toggleLoading',
        payload: { isLoading: false }
      })
      //yield put({ type: 'queryAlertList', payload: { isGroup: payload.isGroup, groupBy: payload.group } })
    },
    // show more
    *loadMore({ }, { call, put, select }) {
      const firstDate = new Date();
      // let tempDate = new Date();
      // 防止同时多次加载更多
      const isLoading = yield select((state) => state.alertQuery.isLoading);
      if (isLoading) {
        return;
      }

      yield put({
        type: 'toggleLoadingMore',
        payload: { isLoadingMore: true }
      })

      let { currentPage, listData, alertQuery } = yield select(state => {
        return {
          'currentPage': state.alertQuery.currentPage,
          'listData': state.alertQuery.data,
          'alertQuery': state.alertQuery
        }
      })

      currentPage = currentPage + 1
      const params = {
        currentPage: currentPage,
        orderBy: alertQuery.orderBy,
        orderType: alertQuery.orderType,
        pageSize: alertQuery.pageSize,
        ...alertQuery.currentQuery
      }

      const listReturnData = yield call(queryAlertList, params)

      if (listReturnData.result) {

        listData = listData.concat(listReturnData.data.data);

        yield put({
          type: 'updateShowMore',
          payload: { isShowMore: listReturnData.data.hasNext, isReRender: false }
        })

        yield put({
          type: 'updateAlertListData',
          payload: {
            data: listData,
            isReRender: false
          }
        })

        // tempDate = new Date();
        yield put({ type: 'setMore', payload: { currentPage, isReRender: false } })
        yield put({
          type: 'toggleLoadingMore',
          payload: { isLoadingMore: false, isReRender: false }
        })
        yield put({
          type: 'addProperties',
          payload: {
            properties: listReturnData.data.properties,
            tags: listReturnData.data.tagKeys
          }
        })
      } else {
        yield message.error(listReturnData.message, 2)
      }
    },
    //orderList排序
    *orderList({ payload }, { select, put, call }) {
      yield put({ type: 'queryAlertList', payload: { isGroup: false, orderBy: payload.orderBy, orderType: payload.orderType } })
    },
    //orderByTittle
    *orderByTittle({ payload }, { select, put, call }) {
      const { orderType } = yield select(state => {
        return {
          'orderType': state.alertQuery.orderType,
        }
      })
      if (payload !== undefined) {
        yield put({
          type: 'toggleOrder',
          payload: {
            orderBy: payload,
            orderType: orderType === undefined || orderType === 1 ? 0 : 1,
          }
        })
        yield put({ type: 'queryAlertList' })
      } else {
        console.error('orderBy error')
      }
    },
    // 工单号点击后跳转到工单详情页面并保留工单详情地址
    *orderFlowNumClick({ payload: { orderFlowNum, id } }, { select, put, call }) {
      const itsmDetailUrlData = yield call(viewTicket, orderFlowNum);
      if (itsmDetailUrlData.result) {
        const itsmDetailUrl = itsmDetailUrlData.data.url;
        yield put({ type: 'updateDataRow', payload: { itsmDetailUrl, id } })
        window.open(itsmDetailUrl);
      } else {
        yield message.error(itsmDetailUrlData.message, 2)
      }
    },
    // 分组显示
    *groupView({ payload }, { select, put, call }) {
      // const tempDate = new Date();
      yield put({
        type: 'setGroupType',
        payload: {
          selectGroup: payload,
          isReRender: false
        }
      })
      yield put({
        type: 'setGroup',
        payload: {
          isGroup: true,
          group: payload
        }
      })
    },
    // 无分组显示
    *noGroupView({ payload }, { select, put, call }) {
      yield put({
        type: 'removeGroupType',
        payload: {
          isReRender: false
        }
      })
      yield put({
        type: 'setGroup',
        payload: {
          isGroup: false,
        }
      })
    },
    // 列定制
    *checkColumn({ payload }, { select, put, call }) {
      yield put({ type: 'setColumn', payload: { selectCol: payload, isReRender: false } })
      const selectColumn = yield select(state => state.alertQuery.selectColumn)
      yield put({ type: 'customCols', payload: { columns: selectColumn } })
    },
  },

}
