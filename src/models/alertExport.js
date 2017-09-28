import {parse} from 'qs'
import { getFormOptions, dispatchForm, close, resolve} from '../services/alertOperation'
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd'

const initalState = {
  currentIncidentId: undefined,
  formOptions: [],
  isShowTicketModal: false,
  ticketUrl: '',
}

export default {

  namespace: 'alertExport',

  state: initalState,

  subscriptions: {
    resolve({dispatch, history}) {
      history.listen((location) => {
        if (pathToRegexp('/export/resolve/:id').test(location.pathname)) {
          const match = pathToRegexp('/export/resolve/:id').exec(location.pathname);
          const incidentId = match[1];
          dispatch({
            type: 'setCurrentId',
            payload: incidentId
          })
        }
      })
    },
    close({dispatch, history}) {
      history.listen((location) => {
        if (pathToRegexp('/export/close/:id').test(location.pathname)) {
          const match = pathToRegexp('/export/close/:id').exec(location.pathname);
          const incidentId = match[1];
          dispatch({
            type: 'setCurrentId',
            payload: incidentId
          })
        }
      })
    },
    dispatch({dispatch, history}) {
      history.listen((location) => {
        if (pathToRegexp('/export/dispatch/:id').test(location.pathname)) {
          const match = pathToRegexp('/export/dispatch/:id').exec(location.pathname);
          const incidentId = match[1];
          dispatch({
            type: 'openFormModal',
            payload: incidentId
          })
        }
      })
    }
  },

  effects: {
    *resolveAlert({payload: {resolveMessage, callback}}, {select, put, call}) {
        const { currentIncidentId } = yield select( state => {
            return {
                'currentIncidentId': state.alertExport.currentIncidentId
            }
        })
        if (currentIncidentId) {
            let stringId = '' + currentIncidentId;
            const resultData = yield resolve({
                incidentIds: [stringId],
                resolveMessage: resolveMessage
            })
            if (resultData.result) {
                if (resultData.data.result) {
                  yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                  yield callback();
                } else {
                  yield message.error(`${resultData.data.failures}`, 3);
                }
            } else {
                yield message.error(resultData.message, 3);
            }
        } else {
            console.error('currentIncidentId error');
        }
    },
    *closeAlert({payload: {closeMessage, callback}}, {select, put, call}) {
        const { currentIncidentId } = yield select( state => {
            return {
                'currentIncidentId': state.alertExport.currentIncidentId
            }
        })
        if (currentIncidentId) {
            let stringId = '' + currentIncidentId;
            const resultData = yield close({
                incidentIds: [stringId],
                closeMessage: closeMessage
            })
            if (resultData.result) {
                if (resultData.data.result) {
                  yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                  yield callback();
                } else {
                  yield message.error(`${resultData.data.failures}`, 3);
                }
            } else {
                yield message.error(resultData.message, 3);
            }
        } else {
            console.error('currentIncidentId error');
        }
    },
    *openFormModal({payload: incidentId}, {select, put, call}) {
        yield put({type: 'setCurrentId', payload: incidentId})
        const options = yield getFormOptions();
        if (options.result) {
            yield put({
                type: 'setFormOptions',
                payload: options.data || []
            })
        } else {
            yield message.error(`${options.message}`, 3)
        }
    },
    *dispatchForm({payload: {formOption}}, {select, put, call}) {

        const currentIncidentId = yield select( state => state.alertExport.currentIncidentId )

        if (currentIncidentId) {
            let stringId = '' + currentIncidentId;
            const data = yield call(dispatchForm, {
                id: stringId,
                code: formOption.id,
                name: formOption.name
            })
            if(data.result){
                 yield put({ 
                    type: 'toggleTicketModal', 
                    payload: {
                        isShowTicketModal: true,
                        ticketUrl: data.data.url
                    }
                })
            } else {
                yield message.error(data.message, 3);
            }
        } else {
            console.error('currentIncidentId error');
        }
    },
  },

  reducers: {
    setCurrentId(state, {payload: currentIncidentId}) {
      return { ...state, currentIncidentId }
    },
    setFormOptions(state, { payload }) {
        return { ...state, formOptions: payload }
    },
    toggleTicketModal(state, {payload: payload}){
        return { ...state , ...payload }
    },
    closeTicketModal(state){
        return { ...state, isShowTicketModal: false, ticketUrl: '' }
    }
  }
}