const indexDispatch = (dispatch) => ({
  //开关按钮切换回调函数
  switchClick: (bOK, row, index) => {
    dispatch({
      type: 'alertMotionManagement/changeStatus',
      payload: {
        id: row.id,
        opened: !bOK
      }
    })
  },
  //编辑按钮切换回调函数
  editClick: (text, row, index) => {
    dispatch({
      type: 'am_addActionModal/toggleEditModal',
      payload: {
        applicationItem: row,
        status: true,
      }
    })
  },
  //删除按钮切换回调函数
  deleteClick: (text, row, index) => {
    dispatch({
      type: 'alertMotionManagement/toggleDeleteModal',
      payload: {
        applicationItem: row,
        status: true,
      }
    })
  },
  //删除按钮切换回调函数
  sortClick: (sorter) => {
    dispatch({
      type: 'alertMotionManagement/sortTable',
      payload: {
        orderBy: sorter.columnKey,
        orderType: sorter.order,
      }
    })
  },
  addActionClick: () => {
    dispatch({
      type: 'am_addActionModal/toggleAddModal',
      payload: {
        status: true,
      }
    })
  },
  exportFileClick: (ids) => {
    dispatch({
      type: 'alertMotionManagement/exportFile',
      payload: {
        ids
      }
    })
  },
  importFileClick: (res) => {
    dispatch({
      type: 'am_importActionModal/importFile',
      payload: res
    })
  },
  saveExportSelectedRowId: (ids) => {
    dispatch({
      type: 'alertMotionManagement/setSaveExportSelectedRowIds',
      payload: {
        ids
      }
    })
  }
})

const addActionModalDispatch = (dispatch) => ({
  uploadAction: (payload) => {
    dispatch({
      type: 'am_addActionModal/uploadAction',
      payload
    })
  },
  homonymousTest: (payload) => {
    dispatch({
      type: 'am_addActionModal/homonymousTest',
      payload
    })
  },
  editAction: (payload) => {
    dispatch({
      type: 'am_addActionModal/editAction',
      payload
    })
  },
  checkBoxChange: (checkedValues) => {
    dispatch({
      type: 'am_addActionModal/changeCheckedValue',
      payload: {
        value: checkedValues
      }
    })
  },
  descriptionChange: (e) => {
    dispatch({
      type: 'am_addActionModal/changeActionDescriptionValue',
      payload: {
        value: e.target.value,
      }
    })
  },
  actionNameChange: (e) => {
    dispatch({
      type: 'am_addActionModal/changeActionNameValue',
      payload: {
        value: e.target.value,
      }
    })
  },
  saveJarId: ({ jarId }) => {
    dispatch({
      type: 'am_addActionModal/saveJarId',
      payload: {
        jarId
      }
    })
  },
  changeFileList: (info) => {
    dispatch({
      type: 'am_addActionModal/changeFileList',
      payload: {
        fileList: [info]
      }
    })
  },
  onRemoveFile: () => {
    dispatch({
      type: 'am_addActionModal/changeFileList',
      payload: {
        fileList: [],
      }
    })
  }
})

export default {
  indexDispatch,
  addActionModalDispatch
};