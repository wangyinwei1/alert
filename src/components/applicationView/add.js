import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { getUUID } from '../../utils'
import AlertREST from './UYUN_Alert_REST'
import Monitor from './UYUN_Monitor'
import Itsm from './UYUN_Itsm'
import ChatOps from './UYUN_ChatOps'
import VideoMON from './UYUN_VideoMon'
import Trap from './SNMP_Trap'
import NetWork from './UYUN_NetWork'
import Webhook from './UYUN_Webhook'
import LeaveNotifyModal from '../common/leaveNotifyModal/index'

class Add extends Component {
  componentDidMount() {
    this.isNeedLeaveCheck = true;
  }
  render() {
    const props = this.props || {};
    const { currentOperateAppType } = props.alertConfig;

    const createApplication = ({ alertConfig, dispatch }) => {
      const { currentOperateAppType, UUID, currentDisplayName, apikey, webHook } = alertConfig;
      let targetApplication;
      let hostUrl = 'https://alert.uyun.cn'
      let origin = window.location.protocol + '//' + window.location.host;
      if (origin.indexOf("alert") > -1) {
        // 域名访问
        hostUrl = origin
        window.__alert_restApiUrl = hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`
      } else {
        // 顶级域名/Ip访问
        hostUrl = origin + '/alert'
        window.__alert_restApiUrl = hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`
      }
      switch (currentOperateAppType.uniqueCode) {
        case '1':
          targetApplication =
            <AlertREST
              route={props.route}
              appkey={UUID}
              builtIn={1}
              displayName={currentDisplayName}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/addApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
              keyCreate={(form, callback) => {
                let _UUID = getUUID(32);
                callback(_UUID)
                dispatch({
                  type: 'alertConfig/setUUID',
                  payload: {
                    UUID: _UUID,
                    currentDisplayName: form.getFieldsValue().displayName
                  }
                })
              }}
            />
          break;
        case '4':
          targetApplication =
            <Monitor
              route={props.route}
              appkey={UUID}
              displayName={currentDisplayName}
              builtIn={1}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/addApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
              keyCreate={(form) => {
                let _UUID = getUUID(32);
                dispatch({
                  type: 'alertConfig/setUUID',
                  payload: {
                    UUID: _UUID,
                    currentDisplayName: form.getFieldsValue().displayName
                  }
                })
              }}
            />
          break;
        case '6':
          targetApplication =
            <NetWork
              route={props.route}
              appkey={UUID}
              displayName={currentDisplayName}
              builtIn={1}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/addApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
              keyCreate={(form) => {
                let _UUID = getUUID(32);
                dispatch({
                  type: 'alertConfig/setUUID',
                  payload: {
                    UUID: _UUID,
                    currentDisplayName: form.getFieldsValue().displayName
                  }
                })
              }}
            />
          break;
        case '7':
          targetApplication =
            <Trap
              route={props.route}
              dispatch={dispatch}
              appkey={UUID}
              displayName={currentDisplayName}
              builtIn={1}
              url={hostUrl}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/addApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
              keyCreate={(form) => {
                let _UUID = getUUID(32);
                dispatch({
                  type: 'alertConfig/setUUID',
                  payload: {
                    UUID: _UUID,
                    currentDisplayName: form.getFieldsValue().displayName
                  }
                })
              }}
            />
          break;
        case '5':
          targetApplication =
            <VideoMON
              route={props.route}
              appkey={UUID}
              displayName={currentDisplayName}
              builtIn={1}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/addApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
              keyCreate={(form) => {
                let _UUID = getUUID(32);
                dispatch({
                  type: 'alertConfig/setUUID',
                  payload: {
                    UUID: _UUID,
                    currentDisplayName: form.getFieldsValue().displayName
                  }
                })
              }}
            />
          break;
        case '2':
          targetApplication =
            <Itsm
              route={props.route}
              appkey={UUID}
              displayName={currentDisplayName}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/addApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
              keyCreate={(form) => {
                let _UUID = getUUID(32);
                dispatch({
                  type: 'alertConfig/setUUID',
                  payload: {
                    UUID: _UUID,
                    currentDisplayName: form.getFieldsValue().displayName
                  }
                })
              }}
            />
          break;
        case '3':
          targetApplication =
            <ChatOps
              route={props.route}
              appkey={UUID}
              displayName={currentDisplayName}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/addApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
              keyCreate={(form) => {
                let _UUID = getUUID(32);
                dispatch({
                  type: 'alertConfig/setUUID',
                  payload: {
                    UUID: _UUID,
                    currentDisplayName: form.getFieldsValue().displayName
                  }
                })
              }}
            />
          break;
        case '8':
          targetApplication =
            <Webhook
              route={props.route}
              appkey={UUID}
              displayName={currentDisplayName}
              webHook={webHook}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  // 保证字段映射传到后台是一个JSON格式的字符串
                  let fieldMap = formData.fieldMap;
                  if(!fieldMap || fieldMap.trim() == '') {
                    fieldMap = '{}';
                  }
                  const webHook = {
                    url: formData.url,
                    timeout: formData.timeout,
                    requestMode: formData.requestMode,
                    fieldMap: fieldMap,
                    replyKey: formData.replyKey,
                    replySuccess: formData.replySuccess
                  }
                  dispatch({
                    type: 'alertConfig/addApplication',
                    payload: {
                      formData: {...formData, webHook},
                      resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
              keyCreate={(form) => {
                let _UUID = getUUID(32);
                const formData = form.getFieldsValue() || {};

                dispatch({
                  type: 'alertConfig/setUUID',
                  payload: {
                    UUID: _UUID,
                    currentDisplayName: formData.displayName,
                    webHook: {
                      url: formData.url,
                      requestMode: formData.requestMode,
                      timeout: formData.timeout,
                      fieldMap: formData.fieldMap,
                      replyKey: formData.replyKey,
                      replySuccess: formData.replySuccess
                    }
                  }
                })
              }}
            />
          break;
        default:
          targetApplication =
            <AlertREST
              route={props.route}
              appkey={UUID}
              builtIn={1}
              displayName={currentDisplayName}
              url={hostUrl + '/openapi/v2/create?' + `api_key=${apikey}`}
              onOk={(e, form) => {
                e.preventDefault();

                form.validateFieldsAndScroll((errors, values) => {
                  if (!!errors) {
                    return;
                  }
                  const formData = form.getFieldsValue()
                  dispatch({
                    type: 'alertConfig/addApplication',
                    payload: {
                      formData, resolve: (result) => {
                        this.isNeedLeaveCheck = !result;
                      }
                    },
                  })
                })
              }}
              keyCreate={(form, callback) => {
                let _UUID = getUUID(32);
                callback(_UUID)
                dispatch({
                  type: 'alertConfig/setUUID',
                  payload: {
                    UUID: _UUID,
                    currentDisplayName: form.getFieldsValue().displayName
                  }
                })
              }}
            />
          break;
      }
      return (
        <div>
          {targetApplication}
          <LeaveNotifyModal route={props.route} needLeaveCheck={() => {
            return this.isNeedLeaveCheck;
          }} />
        </div>
      )
    }

    if (currentOperateAppType !== undefined && Object.keys(currentOperateAppType).length !== 0) {
      return createApplication(props)
    } else {
      return false;
    }
  }
}
Add.propTypes = {
  dispatch: PropTypes.func
}
export default connect(({ alertConfig }) => ({ alertConfig }))(Add)
