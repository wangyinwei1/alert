import { queryAlertList, queryChild, queryAlertListTime } from '../services/alertList'
import { viewTicket } from '../services/alertOperation'
import { parse } from 'qs'
import { message } from 'antd'
import { assign } from 'es6-object-assign';
import { groupSort, returnByIsReRender } from '../utils'

const initialState = {
  isGroup: false,
  groupBy: 'source',

  selectedAlertIds: [], //选中的告警(合并告警)
  operateAlertIds: [], //选中的告警(派发 关闭)
  viewDetailAlertId: false, // 查看详细告警ID
  isResize: false, //是否折叠
  isShowMore: false,
  isLoading: false,
  isLoadingMore: false,

  orderBy: 'lastOccurTime',
  orderType: 0,
  pageSize: 40,
  currentPage: 1,

  levels: {}, // 告警级别

  begin: 0,
  end: 0,

  tagsFilter: {}, // 过滤标签
  selectedAll: false,

  checkAlert: {}, //此对象将alertId作为属性，用来过滤checked的alert

  groupMap: {}, // 存储分组情况{index: isSpread},index表示分组的序号，isSpread表示是否展开

  lineW: 800, //时间线长度
  gridWidth: 100,
  minuteToWidth: 5, //以分钟单位计算间隔

  data: [],

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
    key: 'lastOccurTime',
    order: true
  }, {
    key: 'status',
    order: true
  }, {
    key: 'tags',
    order: false
  },],
}

export default {
  namespace: 'alertListTable',
  state: initialState,
  subscriptions: {
    setup({ dispatch }) {


    }
  },
  reducers: {
    // 更新时间线每分钟占宽
    updateMinToWidth(state, { payload: payload }) {
      return {
        ...state,
        ...payload
      }
    },
    // 折叠状态
    updateResize(state, { payload: isResize }) {
      return {
        ...state,
        ...isResize
      }
    },
    // 加载状态
    toggleLoading(state, { payload: { isLoading, isReRender = true } }) {
      return returnByIsReRender(state, { isLoading }, isReRender);
    },
    // 切换加载更多状态
    toggleLoadingMore(state, { payload: { isLoadingMore, isReRender = true } }) {
      return returnByIsReRender(state, { isLoadingMore, isReRender })
    },
    // // 更改全选状态
    toggleSelectedAll(state, { payload }) {
      // const { checkAlert } = state;
      // // let newStatus = !selectedAll;
      // let ids = Object.keys(checkAlert);

      // let newOperateAlertIds = [];
      // let newSelectedAlertIds = [];
      // if (checked) {
      //   newOperateAlertIds = ids;
      //   newSelectedAlertIds = ids.map(id => checkAlert[id].info);
      // } else {
      //   newOperateAlertIds = [];
      //   newSelectedAlertIds = [];
      // }
      // ids.forEach((id) => {
      //   checkAlert[id].checked = checked;
      // });
      const { selectedAll, checkAlert, operateAlertIds, selectedAlertIds, isReRender = true } = payload;
      return returnByIsReRender(
        state,
        {
          selectedAll,
          checkAlert,
          operateAlertIds,
          selectedAlertIds
        },
        isReRender
      )
    },
    // 更新分组字段
    updateGroup(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    // 更新显示更多字段
    updateShowMore(state, { payload: { isShowMore, isReRender = true } }) {
      return returnByIsReRender(
        state,
        { isShowMore },
        isReRender
      )
    },
    // 点击查看更多
    setMore(state, { payload: { currentPage, isReRender = true } }) {
      return returnByIsReRender(
        state,
        { currentPage },
        isReRender
      )
    },
    // 注入通用状态
    setInitvalScope(state, { payload }) {
      return { ...state, ...payload }
    },
    // 设置viewDetailAlertId
    toggleDetailAlertId(state, { payload: viewDetailAlertId }) {
      return { ...state, viewDetailAlertId }
    },
    // 初始化
    clear(state) {
      return { ...state, ...initialState }
    },

    toggleGroupBy(state, { payload: { isGroup, groupBy, isReRender } }) {
      return returnByIsReRender(state, { isGroup, groupBy, isShowMore: !isGroup });
    },

    // 记录下原先checked数据
    //将loadMore取得的新数据放入checkAlert中
    resetCheckAlert(state, { payload: { moreData, isReRender = true } }) {
      // let ids = Object.keys(origin);
      let checkList = {};
      // newObj.forEach((item, index) => {
      //   checkList[`${item.id}`] = {
      //     info: item,
      //     checked: false
      //   }
      //   ids.forEach((id) => {
      //     if (item.id == id && origin[id].checked) {
      //       checkList[`${item.id}`] = {
      //         info: item,
      //         checked: true
      //       }
      //     }
      //   })
      // })
      // return { ...state, checkAlert: checkList }
      moreData.forEach(item => {
        checkList[item.id] = {
          info: item,
          checked: false
        }
      })
      return returnByIsReRender(
        state,
        {
          checkAlert: {
            ...state.checkAlert,
            ...checkList
          }
        },
        isReRender
      )
    },
    // 删除勾选项
    deleteCheckAlert(state, { payload: arr }) {
      let { checkAlert } = state;
      arr.forEach((id) => {
        if (checkAlert[id]) delete checkAlert[id]
      })
      return { ...state, checkAlert }
    },
    // 重置勾选状态
    resetCheckedAlert(state) {
      const { checkAlert } = state;
      let ids = Object.keys(checkAlert);
      ids.forEach((id) => {
        checkAlert[id].checked = false
      })
      return { ...state, checkAlert: checkAlert, operateAlertIds: [], selectedAlertIds: [], selectedAll: false }
    },
    // 更改勾选状态
    changeCheckAlert(state, { payload: { alertId } }) {
      const previousChecked = state.checkAlert[alertId].checked
      let newOperateAlertIds = [];
      let newSelectedAlertIds = [];
      let newCheckAlert = {
        ...state.checkAlert,
        [alertId]: {
          ...state.checkAlert[alertId],
          checked: !previousChecked
        }
      };
      if (!previousChecked) {
        newOperateAlertIds = [
          ...state.operateAlertIds,
          alertId
        ];
        newSelectedAlertIds = [
          ...state.selectedAlertIds,
          state.checkAlert[alertId].info
        ];
      } else {
        let index = state.operateAlertIds.indexOf(alertId);
        //index逻辑上来说不可能出现小于-1的情况，但还是判断一下吧
        if (index > -1) {
          newOperateAlertIds = [
            ...state.operateAlertIds.slice(0, index),
            ...state.operateAlertIds.slice(index + 1)
          ];
          newSelectedAlertIds = [
            ...state.selectedAlertIds.slice(0, index),
            ...state.selectedAlertIds.slice(index + 1)
          ];
        }
      }
      return {
        ...state,
        operateAlertIds: newOperateAlertIds,
        selectedAlertIds: newSelectedAlertIds,
        checkAlert: newCheckAlert
      }
      // if (checkAlert[alertInfo.id] !== undefined) {
      //   checkAlert[alertInfo.id].checked = !checkAlert[alertInfo.id].checked
      //   return { ...state, checkAlert: checkAlert }
      // } else {
      //   return { ...state }
      // }
    },
    // 在点击操作时进行过滤处理
    // filterCheckAlert(state) {
    //   const { checkAlert } = state;
    //   let operateAlertIds = [], selectedAlertIds = [];
    //   let keyArr = Object.keys(checkAlert) || [];
    //   keyArr.forEach((id) => {
    //     if (checkAlert[id].checked) {
    //       operateAlertIds.push(id);
    //       // selectedAlertIds.push(checkAlert[id].info)
    //     }
    //   })
    //   return { ...state, operateAlertIds: operateAlertIds, selectedAlertIds: selectedAlertIds }
    // },
    // ----------------------------------------------------------------------------------------------
    setTimeLineWidth(state, { payload: { gridWidth, minuteToWidth, lineW } }) {

      return {
        ...state,
        gridWidth,
        minuteToWidth,
        lineW
      }
    },
    // 自定义列
    customCols(state, { payload: columns }) {
      return {
        ...state,
        columns
      }

    },
    // 更新告警列表
    updateAlertListData(state, { payload: { data, newLevels, hasNext, isReRender = true } }) {
      let { levels, data: oldData } = state;

      // const tempDate = new Date();

      // // 去重：将告警列表中相同id的告警去掉（移除先加载的告警）
      const ids = [];
      const tempData = [];
      for (let i = data.length - 1; i >= 0; i--) {
        const item = data[i];
        if (ids.indexOf(item.id) < 0) {
          ids.push(item.id);
          tempData.push(item);
        }
      }

      const newData = [];
      for(let i = tempData.length - 1; i >= 0; i--) {
        newData.push(tempData[i]);
      }

      return returnByIsReRender(state, { data: newData }, isReRender);
    },
    // 手动添加子告警
    addChild(state, { payload: { children, parentId, isGroup } }) {
      const { data } = state;
      const newData = data.map((item, index) => {
        if (item.id == parentId) {
          item.childrenAlert = children;
          item.isSpread = true
        }
        return item;
      })
      return { ...state, data: newData }
    },
    // 收拢子告警
    toggleSpreadChild(state, { payload: { parentId, isGroup } }) {
      const { data } = state;
      const newData = data.map((item, index) => {
        if (item.id == parentId) {
          item.isSpread = !item.isSpread
        }
        return item;
      })
      return { ...state, data: newData }
    },
    // 合并告警
    mergeChildrenAlert(state, { payload: { parentId, childItems, isGroup, relieveItem } }) {
      const { data, checkAlert } = state;
      const childIds = childItems.map(item => item.id)
      let childsItem = [];

      data.forEach((item, index) => {
        if (item.id == parentId) {
          // 若被合并的告警
          item.childrenAlert = childItems;
          item.isSpread = true;
          item.hasChild = true;
        }
        childItems.forEach((childItem) => {
          // 判断被合并的子告警是否有自己的子告警，若无才从列表中删除
          if ((childItem.id == item.id && !childItem.hasChild) || index == 1) {
            item.isRemoved = true;
            checkAlert[childItem.id] = { checked: false };
          }
        })
      })

      return { ...state, data: data, checkAlert: checkAlert }
    },
    // 移除子告警
    removeChildren(state, { payload: { parentId, childItems, isReRender } }) {
      const { isGroup, data, groupBy } = state;
      let parentItem = undefined;
      const toAddItems = [];
      let newData = [];

      const ids = data.map((item) => item.id);

      // 删除父告警下的子告警已经hasChild字段
      parentItem = data[ids.indexOf(parentId)];
      parentItem.hasChild = false;
      parentItem.childrenAlert = undefined;

      newData = [...data];
      childItems.forEach((childItem) => {
        if (ids.indexOf(childItem.id) < 0) {
          newData.push(childItem);
        }
      })

      return returnByIsReRender(state, { data: newData }, isReRender);
    },
    // addParent再没展开过的情况下去解除告警
    addParent(state, { payload: { addItem, parentId, isGroup } }) {
      const { data, checkAlert } = state;
      let status = false;
      const newData = data.map((item, index) => {
        if (item.id == parentId) {
          status = true;
          item.hasChild = false;
          item.isSpread = false;
          delete item.childrenAlert
        }
        return item;
      })
      if (status) {
        newData.push(...addItem);
        addItem.forEach((item) => { checkAlert[item.id] = { info: item, checked: false } })
      }
      return { ...state, data: newData, checkAlert: checkAlert }
    },
    // 手动添加分组展开状态
    addGroupSpread(state, { payload }) {
      const { data, groupMap } = state;
      const newData = data.map((group) => {
        if (group.classify == payload) {
          if (typeof group.isGroupSpread === 'undefined') {
            group.isGroupSpread = false;
          } else if (typeof group.isGroupSpread === 'boolean') {
            group.isGroupSpread = !group.isGroupSpread;
          } else {
            group.isGroupSpread = false;
          }
        }
        return group
      })
      return { ...state, data: newData }
    },
    // 转换分组的展开状态
    toggleGroupSpread(state, { payload={} }) {
      const { groupMap } = state;
      const { groupIndex, isSpread } = payload;
      if(typeof isSpread !== 'undefined') {
        groupMap[groupIndex] = isSpread;
      } else {
        groupMap[groupIndex] = !groupMap[groupIndex];
      }

      return { ...state, groupMap };
    },
    // 排序
    toggleOrder(state, { payload: { orderBy, orderType, isReRender = true } }) {
      return returnByIsReRender(state, { orderBy, orderType }, isReRender);
    },
    // 删除告警
    deleteIncident(state, { payload: arr }) {
      const { data, isGroup } = state;
      const newData = data.filter((item) => {
        let status = true;
        // arr.forEach((id) => {
        //   if (id === item.id) status = false
        // })
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i] === item.id) {
            status = false;
            break;
          }
        }
        return status;
      })
      return { ...state, data: newData }
    },

    // 修改状态为处理中
    changeCloseState(state, { payload: { arrList, status } }) {
      const { data, isGroup } = state;

      const newData = data.map((item, index) => {
        arrList.forEach((id) => {
          if (item.id == id) {
            item['status'] = status; // 手动变为150 -> 已解决
          }
          if (item.childrenAlert !== undefined) {
            item.childrenAlert.forEach((childItem) => {
              childItem['status'] = status; // 子告警也变为已解决
            })
          }
        })
        return item;
      })
      return { ...state, data: newData }
    },

    // 修改data数组多行的值
    updateDataRows(state, { payload }) {
      const { datas, isReRender = true } = payload;
      const { data, isGroup, tagsFilter: { status }, checkAlert } = state;
      const ids = datas.map((data) => data.id);
      let newData = assign([], data);

      newData = newData.map((tempRow) => {
        if (ids.indexOf(tempRow['id']) >= 0) {
          tempRow = { ...tempRow, ...(datas[ids.indexOf(tempRow['id'])]) };

          // 如果告警的状态与当前过滤条件的状态不一致，则设置“移除字段”为true
          if (status.indexOf(',') < 0 && status != tempRow.status) {
            tempRow.isRemoved = true;
          }

          if (!tempRow.checked) {
            if (checkAlert[tempRow.id] && checkAlert[tempRow.id].checked) {
              checkAlert[tempRow.id].checked = false;
            }
          }
        }

        return tempRow
      });

      return returnByIsReRender(state, { data: newData, checkAlert, operateAlertIds: [], selectedAlertIds: [] }, isReRender);
    },

    // 修改data数组某一行的值
    updateDataRow(state, { payload }) {
      const { data, isGroup, tagsFilter: { status }, isReRender = true } = state;
      let newData = assign([], data);
      newData = newData.map((tempRow) => {
        if (tempRow['id'] == payload['id']) {
          tempRow = { ...tempRow, ...payload };
          // 如果告警的状态与当前过滤条件的状态不一致，则设置“移除字段”为true
          if (status.indexOf(',') < 0 && status != tempRow.status) {
            tempRow.isRemoved = true;
          }
        }
        return tempRow;
      });
      return returnByIsReRender(state, { data: newData }, isReRender);
    },

    // 清空selectedAlertIds和operateAlertIds： 接手成功后要手动清除
    // deleteOperateIds(state) {
    //   return {
    //     ...state,
    //     operateAlertIds: [],
    //     selectedAlertIds: []
    //   }
    // },

    //
    resetCheckboxStatus(state) {
      return {
        ...state,
        operateAlertIds: [],
        selectedAlertIds: [],
        selectedAll: false
      }
    }
  },

  effects: {
    // beforeCustomCols
    *initCustomCols({ payload: custome }, { call, put, select }) {
      let initColumns = JSON.parse(JSON.stringify(initialState.columns))
      let columns = custome.length > 0 ? custome : initColumns;
      let userColumns = custome.length > 0 ? JSON.stringify(columns) : JSON.stringify(initColumns)
      localStorage.setItem('__alert_list_userColumns', userColumns)
      yield put({ type: 'customCols', payload: columns })
    },
    //查询告警列表
    *queryAlertList({ payload }, { call, put, select }) {

      yield put({
        type: 'toggleLoading',
        payload: { isLoading: true }
      })

      var {
        isGroup,
        groupBy,
        begin,
        end,
        pageSize,
        orderBy,
        lineW,
        orderType,
        columns,
      } = yield select(state => {
          const alertListTable = state.alertListTable
          return {
            isGroup: alertListTable.isGroup,
            groupBy: alertListTable.groupBy,
            begin: alertListTable.begin,
            end: alertListTable.end,
            lineW: alertListTable.lineW,
            pageSize: alertListTable.pageSize,
            orderBy: alertListTable.orderBy,
            orderType: alertListTable.orderType,
            columns: alertListTable.columns,
          }
        })

      // 更新每分钟占宽
      const countMins = (end - begin) / (60 * 1000)
      const minuteToWidth = lineW / countMins
      const gridWidth = lineW / 10
      yield put({
        type: 'updateMinToWidth',
        payload: {
          minuteToWidth,
          gridWidth
        }
      })

      var extraParams = {};

      if (payload !== undefined && payload.isGroup !== undefined) {
        isGroup = payload.isGroup;
        groupBy = payload.groupBy;
        orderBy = payload.orderBy;
        orderType = payload.orderType;
      }

      const tagsFilter = yield select(state => {

        return {
          ...state.alertListTable.tagsFilter,
          begin: begin,
          end: end
        }
      })

      // 这里触发时currentPage始终为1，如果从common取在分组转分页时会有问题
      extraParams = {
        pageSize: pageSize,
        currentPage: 1,
        orderBy: orderBy,
        orderType: orderType
      }

      const listData = yield call(queryAlertList, {
        ...tagsFilter,
        ...extraParams
      })

      if (listData.result) {
        const userInfo = yield select((state) => {
          return state.app && state.app.userInfo
        })
        const list = listData.data.datas.map((alert) => {
          if (alert.owner == userInfo.userId) {
            alert.isOwn = true;
          } else {
            alert.isOwn = false;
          }

          return alert;
        })
        yield put({
          type: 'toggleGroupBy',
          payload: {
            isGroup: false,
            isReRender: false
          }
        })
        yield put({
          type: 'updateAlertListData',
          payload: {
            data: list,
            isReRender: false
          }
        })

        yield put({
          type: 'updateShowMore',
          payload: {
            isShowMore: listData.data.hasNext,
            isReRender: false,
          }
        })
        yield put({
          type: 'resetCheckAlert',
          payload: {
            // origin: alertListTable.checkAlert,
            // newObj: listData
            moreData: list,
            isReRender: false
          }
        })
        yield put({
          type: 'toggleLoading',
          payload: { isLoading: false }
        })
        yield put({
          type: 'alertOperation/initColumn',
          payload: {
            baseCols: columns,
            extend: listData.data.properties,
            tags: listData.data.tagKeys
          }
        })

        const tags = yield select((state) => {
          const tagsFilter = state.alertListTable.tagsFilter;

          // tags过滤条件去掉status
          const tags = Object.keys(tagsFilter).filter((key) => key != 'status').map((key) => {
            return {
              "value": tagsFilter[key],
              "key": key
            }
          })

          return tags;
        })

        yield put({
          type: 'alertListLevels/queryLevels',
          payload: {
            begin: begin,
            end: end,
            tags: tags,
            status: tagsFilter.status
          }
        })

      } else {
        yield message.error(listData.message, 2)
      }
    },
    // 展开子告警
    *spreadChild({ payload }, { call, put, select }) {
      let haveChild;
      const { data, isGroup, begin, end } = yield select(state => {
        return {
          'isGroup': state.alertListTable.isGroup,
          'data': state.alertListTable.data,
          'begin': state.alertListTable.begin,
          'end': state.alertListTable.end
        }
      })
      // 先看下有没有子告警，没有就查询 有就隐藏
      data.forEach((item, index) => {
        if (item.id == payload) {
          haveChild = !(typeof item.childrenAlert === 'undefined')
        }
      })

      if (typeof haveChild !== undefined && !haveChild) {
        const childResult = yield call(queryChild, { incidentId: payload, begin: begin, end: end })
        if (childResult.result) {
          yield put({ type: 'addChild', payload: { children: childResult.data, parentId: payload, isGroup: isGroup } })

        } else {
          yield message.error(childResult.message, 2)
        }
      } else if (typeof haveChild !== undefined && haveChild) {
        yield put({ type: 'toggleSpreadChild', payload: { parentId: payload, isGroup: isGroup } })
      } else {
        console.error('haveChild is undefined')
      }
    },
    // 收拢子告警
    *noSpreadChild({ payload }, { call, put, select }) {
      const { isGroup } = yield select(state => {
        return {
          'isGroup': state.alertListTable.isGroup,
        }
      })

      yield put({ type: 'toggleSpreadChild', payload: { parentId: payload, isGroup: isGroup } })
    },
    // 合并告警
    *mergeChildAlert({ payload }, { call, put, select }) {
      let { totalItems, pId, cItems } = payload;
      let relieveItem = []; // 需要释放的子告警
      const { data, isGroup, begin, end } = yield select(state => {
        return {
          'isGroup': state.alertListTable.isGroup,
          'data': state.alertListTable.data,
          'begin': state.alertListTable.begin,
          'end': state.alertListTable.end
        }
      })
      const childResult = yield call(queryChild, { incidentId: payload.pId, begin: begin, end: end })
      let childItems = [];
      if (childResult.result) {
        childItems = childResult.data;
      } else {
        yield message.error(childResult.message, 2)
      }
      // push childrenAlert/ remove parent/ hasChild -> true/ isSpread -> true
      yield put({ type: 'mergeChildrenAlert', payload: { parentId: pId, childItems: childItems, isGroup: isGroup, relieveItem: relieveItem } })
      yield put({ type: 'alertListLevels/queryLevels' });
    },
    // 解除告警
    *relieveChildAlert({ payload: { relieveId } }, { call, put, select }) {

      const { isGroup, begin, end } = yield select(state => {
        return {
          'isGroup': state.alertListTable.isGroup,
        }
      })

      const childResult = yield call(queryChild, { incidentId: relieveId, begin: begin, end: end })
      let childItems = [];
      if (childResult.result) {
        childItems = childResult.data;
      } else {
        yield message.error(childResult.message, 2)
      }

      yield put({
        type: 'removeChildren',
        payload: {
          parentId: relieveId,
          childItems: childItems
        }
      })

      yield put({ type: 'alertListLevels/queryLevels' });

    },
    // 展开组
    *spreadGroup({ payload: groupIndex }, { call, put, select }) {
      yield put({ type: 'toggleGroupSpread', payload: { groupIndex, isSpread: true } })
    },
    // 合拢组
    *noSpreadGroup({ payload: groupIndex }, { call, put, select }) {
      yield put({ type: 'toggleGroupSpread', payload: { groupIndex, isSpread: false } })
    },
    // ------------------------------------------------------------------------------------------------

    // 点击分组时触发
    *setGroup({ payload }, { select, put, call }) {

      yield put({
        type: 'toggleLoading',
        payload: { isLoading: true }
      })
      // if (payload.group !== undefined && payload.group === 'severity') {
      //   groupList.sort((prev, next) => {
      //     return Number(next.classify) - Number(prev.classify);
      //   })
      // }

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

      // yield put({ type: 'queryAlertList', payload: { isGroup: payload.isGroup, orderBy: undefined, orderType: undefined } })
    },
    // show more
    *loadMore({ }, { call, put, select }) {
      const { isLoading, isLoadingMore } = yield select((state) => state.alertListTable);
      if (isLoading || isLoadingMore) {
        return;
      }

      yield put({
        type: 'toggleLoadingMore',
        payload: { isLoadingMore: true }
      })

      let { currentPage, listData, alertListTable } = yield select(state => {
        return {
          'currentPage': state.alertListTable.currentPage,
          'listData': state.alertListTable.data,
          'alertListTable': state.alertListTable
        }
      })

      currentPage = currentPage + 1
      const params = {
        currentPage: currentPage,
        begin: alertListTable.begin,
        end: alertListTable.end,
        orderBy: alertListTable.orderBy,
        orderType: alertListTable.orderType,
        pageSize: alertListTable.pageSize,
        ...alertListTable.tagsFilter,
      }

      const listReturnData = yield call(queryAlertList, params)

      if (listReturnData.result) {

        listData = listData.concat(listReturnData.data.datas);

        yield put({
          type: 'resetCheckAlert',
          payload: {
            // origin: alertListTable.checkAlert,
            // newObj: listData
            moreData: listReturnData.data.datas,
            isReRender: false
          }
        })
        if (!listReturnData.data.hasNext) {
          yield put({
            type: 'updateShowMore',
            payload: { isShowMore: listReturnData.data.hasNext, isReRender: false }
          })
        }

        yield put({
          type: 'updateAlertListData',
          payload: {
            data: listData,
            newLevels: listReturnData.data.levels,
            isReRender: false
          }
        })

        yield put({ type: 'setMore', payload: { currentPage, isReRender: false } })

        yield put({
          type: 'alertOperation/addProperties',
          payload: {
            properties: listReturnData.data.properties,
            tags: listReturnData.data.tagKeys
          }
        })
      } else {
        yield message.error(listReturnData.message, 2)
      }

      yield put({
        type: 'toggleLoadingMore',
        payload: { isLoadingMore: false }
      })
    },
    //orderList排序
    *orderList({ payload }, { select, put, call }) {
      //yield put({ type: 'toggleOrder', payload: payload })
      yield put({ type: 'queryAlertList', payload: { isGroup: false, orderBy: payload.orderBy, orderType: payload.orderType } })
    },
    //orderByTittle
    *orderByTittle({ payload }, { select, put, call }) {
      const { orderType } = yield select(state => {
        return {
          'orderType': state.alertListTable.orderType,
        }
      })
      if (payload !== undefined) {
        yield put({
          type: 'toggleOrder',
          payload: {
            orderBy: payload,
            orderType: orderType === undefined || orderType === 1 ? 0 : 1,
            isReRender: false
          }
        })
        yield put({ type: 'queryAlertList' })
      } else {
        console.error('orderBy error')
      }
    },
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

    // 响应列表项的选中状态
    *handleCheckboxClick({ payload: { alertId } }, { select, put, call }) {
      // const startDate = new Date();

      yield put({ type: 'changeCheckAlert', payload: { alertId } });

      const selectedAlertIds = yield select(state => state.alertListTable.selectedAlertIds)
      // 如果列表为空，或者其中有一个未接手的，disabled都为true
      const disabled = selectedAlertIds.length === 0;

      yield put({
        type: 'alertOperation/setButtonsDisable',
        payload: disabled
      })
    },

    // 点击全选按钮
    *handleSelectAll({ payload: { checked, isNeedCheckOwner } }, { select, put, call }) {
      const checkAlert = yield select(state => state.alertListTable.checkAlert);
      // let newStatus = !selectedAll;
      let ids = Object.keys(checkAlert);

      let newOperateAlertIds = [];
      let newSelectedAlertIds = [];
      if (checked) {
        newOperateAlertIds = ids;
        newSelectedAlertIds = ids.map(id => checkAlert[id].info);
      } else {
        newOperateAlertIds = [];
        newSelectedAlertIds = [];
      }
      if (isNeedCheckOwner) {
        ids.forEach((id) => {
          const info = checkAlert[id].info;
          if (info.isOwn) {
            checkAlert[id].checked = checked;
          } else {
            checkAlert[id].checked = false;
          }
        });
      } else {
        ids.forEach((id) => {
          checkAlert[id].checked = checked;
        })
      }

      yield put({
        type: 'toggleSelectedAll',
        payload: {
          selectedAll: checked,
          checkAlert,
          operateAlertIds: newOperateAlertIds,
          selectedAlertIds: newSelectedAlertIds
        }
      });
      const disabled = newSelectedAlertIds.length === 0;
      yield put({
        type: 'alertOperation/setButtonsDisable',
        payload: disabled
      })
    }
  },
}
