import React, { PropTypes, Component } from 'react'
import { Link } from 'dva/router'
import { Button, Input, Form, Timeline, Spin } from 'antd';
import { connect } from 'dva'
import styles from './index.less'
import { classnames, formatDate, getOperationExcutionMap, isMobile, strToLink } from '../../../utils'
import AlertOperation from '../alertOperation/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import Wrap from './wrap'
import $ from 'jquery'

class alertDetail extends Component {
  componentDidMount() {
    this._setAutoHide();
  }

  componentWillUnmount() {
    this._cancelAutoHide();
  }

  // 设置当鼠标点击不处于本区域时隐藏右侧滑动栏的全局事件
  _setAutoHide() {
    $(window.document.body).on("click.detail", (e) => {
      const $target = $(e.target);
      const $toCloseSlider = $target.closest("div#alertDetailSlider");
      const $toCloseModal = $target.closest(".ant-modal-wrap ");
      const $toCloseLi = $target.closest("li");
      // const $toCloseContent = $target.closest(".layout");

      // 如果点击的组件补上下拉框选项或者不在弹出框上或者不在右侧滑动栏上，则隐藏右侧滑动栏
      if (($target.attr("role") != 'menuitem' && ($toCloseLi.attr("role") != 'menuitem' || $target.attr("href")) && $toCloseSlider.length == 0 && $toCloseModal.length == 0)) {
        this.props.closeDeatilModal();
      }
    })
  }

  // 取消当鼠标点击不处于本区域时隐藏右侧滑动栏的全局事件
  _cancelAutoHide() {
    $(window.document.body).off("click.detail");
  }

  render() {
    const { extraProps, operateProps, form, closeDeatilModal, clickTicketFlow, editForm, openForm, closeForm, openRemark, editRemark, closeRemark, userInfo, intl: { formatMessage } } = this.props;
    const { currentAlertDetail, isShowOperateForm, operateForm, isShowRemark, operateRemark, ciUrl, invokeByOutside } = extraProps;
    const { getFieldDecorator, getFieldsValue } = form;
    const { incidentLog = [], ci = [] } = currentAlertDetail;
    const ciIds = ci.filter(({ code, value }) => code == 'ciId');
    const ciId = ciIds.length > 0 ? ciIds[0] : undefined

    // <div className={styles.infoBody}>
    //     <p className={styles.remarkTitle}>备注信息</p>
    //     <div className={styles.remark} onClick={openRemark}>
    //         <i className={classnames(styles.bianji, bianjiClass)}></i>
    //         <span>添加备注</span>
    //     </div>
    //     {
    //         isShowRemark ?
    //         <Form>
    //             <Form.Item>
    //                 {getFieldDecorator('remark', {
    //                     initialValue: operateRemark
    //                 })(
    //                     <Input type="textarea" placeholder="请输入备注信息" autosize={ true } />
    //                 )}
    //             </Form.Item>
    //             <div className={styles.remarkOperate}>
    //                 <Button type="primary" onClick={ () => {
    //                     const formData = form.getFieldsValue();
    //                     editRemark(formData)
    //                 }}>保存</Button>
    //                 &nbsp;
    //                 <Button type="ghost" onClick={ closeRemark }>取消</Button>
    //             </div>
    //         </Form>
    //         :
    //         undefined
    //     }
    // </div>

    // <i className={classnames(setClass, styles.stateClass)}></i>

    // <li><span>{formatMessage({...localeMessage['owner']})}:</span><span>{currentAlertDetail.responsiblePerson ? currentAlertDetail.responsiblePerson : formatMessage({...localeMessage['unknown']})}</span></li>
    // <li><span>{formatMessage({...localeMessage['department']})}:</span><span>{currentAlertDetail.responsibleDepartment ? currentAlertDetail.responsibleDepartment : formatMessage({...localeMessage['unknown']})}</span></li>

    const dateTransfer = (begin, end) => {
      let date = {};
      let beginTime = new Date(+begin);
      let endTime = new Date(+end);

      // date.continueTime = Math.round(((+end) - (+begin)) / 1000 / 60 / 60); // hours
      date.begin = formatDate(+begin);
      date.end = formatDate(+end);
      return date
    }

    const durationFunc = (duration) => {
      if (duration > 3600000) {
        return (duration / 3600000).toFixed(1)
      } else {
        return (duration / 60000).toFixed(1)
      }
    }
    // 目前只有完成，后期可根据状态改变class
    const setClass = classnames(
      'iconfont',
      'icon-wancheng'
    )

    const shanchuClass = classnames(
      'iconfont',
      'icon-shanchux'
    )

    const bianjiClass = classnames(
      'iconfont',
      'icon-yijianfankui'
    )

    // 根据severity选择不同的颜色
    const severityColor = currentAlertDetail.severity == 3 ? styles.jjLevel
      : currentAlertDetail.severity == 2 ? styles.gjLevel
        : currentAlertDetail.severity == 1 ? styles.txLevel
          : currentAlertDetail.severity == 0 ? styles.hfLevel : false

    const localeMessage = defineMessages({
      name: {
        id: 'alertList.title.name',
        defaultMessage: '告警名称'
      },
      entityName: {
        id: 'alertList.title.enityName',
        defaultMessage: '对象'
      },
      entityAddr: {
        id: 'alertList.title.entityAddr',
        defaultMessage: 'IP地址'
      },
      notifyList: {
        id: 'alertList.title.notifyList',
        defaultMessage: '是否分享'
      },
      unknown: {
        id: 'alertList.unknown',
        defaultMessage: '未知',
      },
      severity: {
        id: 'alertList.title.severity',
        defaultMessage: '告警级别',
      },
      source: {
        id: 'alertList.title.source',
        defaultMessage: '告警来源',
      },
      status: {
        id: 'alertList.title.status',
        defaultMessage: '告警状态',
      },
      description: {
        id: 'alertList.title.description',
        defaultMessage: '告警描述',
      },
      count: {
        id: 'alertList.title.count',
        defaultMessage: '次数',
      },
      duration: {
        id: 'alertQuery.label.duration',
        defaultMessage: '持续时间',
      },
      firstOccurred: {
        id: 'alertList.title.firstOccurTime',
        defaultMessage: '首次发生时间',
      },
      lastOccurTime: {
        id: 'alertList.title.lastOccurTime',
        defaultMessage: '最后发生时间',
      },
      basic: {
        id: 'alertDetail.basic',
        defaultMessage: '基本信息',
      },
      enrich: {
        id: 'alertDetail.enrich',
        defaultMessage: '丰富信息',
      },
      owner: {
        id: 'alertDetail.owner',
        defaultMessage: '负责人',
      },
      department: {
        id: 'alertDetail.department',
        defaultMessage: '负责部门',
      },
      hour: {
        id: 'alertDetail.hour',
        defaultMessage: '小时',
      },
      min: {
        id: 'alertDetail.min',
        defaultMessage: '分钟',
      },
      ticket: {
        id: 'alertDetail.ticket',
        defaultMessage: '工单',
      },
      edit: {
        id: 'alertDetail.edit',
        defaultMessage: '编辑',
      },
      save: {
        id: 'alertDetail.save',
        defaultMessage: '保存',
      },
      cancel: {
        id: 'alertDetail.cancel',
        defaultMessage: '取消',
      },
      text: {
        id: 'alertDetail.text',
        defaultMessage: '文本',
      },
      tags: {
        id: 'alertQuery.label.tags',
        defaultMessage: '标签',
      },
      ci: {
        id: 'alertDetail.ciInfo',
        defaultMessage: 'CI信息',
      },
      link: {
        id: 'alertDetail.link',
        defaultMessage: '链接',
      },
      ciDetail: {
        id: 'alertDetail.link.ciDetail',
        defaultMessage: '查看CI详情',
      },
      ciHistory: {
        id: 'alertDetail.ciHistory',
        defaultMessage: 'CI历史告警'
      },
      ciHistoryLink: {
        id: 'alertDetail.link.ciHistory',
        defaultMessage: '查询该CI的历史告警'
      },
      ciHistoryLabel: {
        id: 'alertDetail.link.ciHistoryLabel',
        defaultMessage: '查询'
      },
      log: {
        id: 'alertOperate.log',
        defaultMessage: '审计日志'
      },
      remark: {
        id: 'alertDetail.remark',
        defaultMessage: '备注'
      },
      operator: {
        id: 'alertDetail.operator',
        defaultMessage: '处理人'
      },
      itsmType: {
        id: 'ruleEditor.itsmType',
        defaultMessage: '工单类型'
      },
      recipient: {
        id: 'alertDetail.recipient',
        defaultMessage: '接收人'
      },
      roomName: {
        id: 'modal.roomName',
        defaultMessage: '群组名称'
      },
      suppressionMessage: {
        id: 'alertDetail.suppressionMessage',
        defaultMessage: '抑制{ minutes }分钟'
      },
      reassignMessage: {
        id: 'alertDetail.reassignMessage',
        defaultMessage: '转派给'
      },
      operateType: {
        10: {
          id: 'alertDetail.action.t10',
          defaultMessage: '新告警创建'
        },
        30: {
          id: 'alertDetail.action.t30',
          defaultMessage: '更改状态'
        },
        50: {
          id: 'alertDetail.action.t50',
          defaultMessage: '更改级别'
        },
        70: {
          id: 'alertDetail.action.t70',
          defaultMessage: '告警删除'
        },
        90: {
          id: 'alertDetail.action.t90',
          defaultMessage: '通知'
        },
        110: {
          id: 'alertDetail.action.t110',
          defaultMessage: 'chatOps群组'
        },
        130: {
          id: 'alertDetail.action.t130',
          defaultMessage: '派发工单'
        },
        150: {
          id: 'alertDetail.action.t150',
          defaultMessage: '派发cross工单'
        },
        170: {
          id: 'alertDetail.action.t170',
          defaultMessage: '解决'
        },
        200: {
          id: 'alertDetail.action.t200',
          defaultMessage: '接手'
        },
        210: {
          id: 'alertDetail.action.t210',
          defaultMessage: '转派'
        },
        220: {
          id: 'alertDetail.action.t220',
          defaultMessage: '抑制'
        },
        250: {
          id: 'alertDetail.action.t250',
          defaultMessage: '关闭'
        }
      },
      operate_takeOver: {
        id: 'alertOperate.takeOver',
        defaultMessage: '接手'
      },
      operate_reassign: {
        id: 'alertOperate.reassign',
        defaultMessage: '转派'
      },
      operate_dispatch: {
        id: 'alertOperate.dispatch',
        defaultMessage: '派发工单'
      },
      operate_close: {
        id: 'alertOperate.close',
        defaultMessage: '关闭告警'
      },
      operate_resolve: {
        id: 'alertOperate.resolve',
        defaultMessage: '解决告警'
      },
      operate_merge: {
        id: 'alertOperate.merge',
        defaultMessage: '合并告警'
      },
      operate_relieve: {
        id: 'alertOperate.relieve',
        defaultMessage: '解除告警'
      },
      // 操作禁用的理由
      disableReason: {
        owner: {
          id: 'alertDetail.operation.reason1',
          defaultMessage: '因为告警由他人负责所以无法{ control }'
        },
        status: {
          id: 'alertDetail.operation.reason2',
          defaultMessage: '处于{ status }状态的告警无法{ control }'
        }
      },
    })

    const sharedFunc = (notifyList) => {
      let temp = notifyList.map((key) => {
        return window.__alert_appLocaleData.messages[`alertList.notifyList.${key}`]
      })
      return temp.join(' / ');
    }
    const statusType = {
      0: window._status["0"],
      40: window._status["40"],
      150: window._status["150"],
      190: window._status["190"],
      255: window._status["255"]
    };

    const statusMap = {
      "0": "NEW",
      "150": "PROCESSING",
      "190": "RESOLVED",
      "255": "CLOSED"
    }

    const disabledObj = getOperationExcutionMap({ userId: userInfo.userId, owner: currentAlertDetail.owner, isAdmin: userInfo.supervisor == "1", status: statusMap[currentAlertDetail.status] })

    let disableMap = {};
    let disableReasonMap = {}
    Object.keys(disabledObj).forEach((key) => {
      disableMap[key + 'Disabled'] = disabledObj[key].disabled;
      if (disabledObj[key].disabled) {
        disableReasonMap[key + 'Disabled'] = formatMessage(
          { ...(localeMessage['disableReason'][disabledObj[key].reason]) },
          {
            control: formatMessage({ ...localeMessage['operate_' + key] }),
            status: currentAlertDetail.statusName
          }
        );
      }
    })

    return (
      <div id="alertDetailSlider" className={styles.main}>
        <Spin spinning={extraProps.isLoading}>
          <div className={!invokeByOutside ? styles.detailHead : styles.detailHeadByOutside}>
            <p>{currentAlertDetail.name ? currentAlertDetail.name : formatMessage({ ...localeMessage['unknown'] })}</p>
            {!invokeByOutside && <i className={classnames(styles.shanChu, shanchuClass)} onClick={closeDeatilModal}></i>}
            {!(isMobile()) && <AlertOperation position="detail" {...operateProps} {...disableMap} disableReasonMap={disableReasonMap}/>}
          </div>
          <div className={!(isMobile()) ? styles.detailBody : classnames(styles.detailBody, styles.mobileBody)}>
            <Wrap title={formatMessage({ ...localeMessage['basic'] })}>
              <ul>
                <li><span>{formatMessage({ ...localeMessage['name'] })}:</span><span>{currentAlertDetail.name ? currentAlertDetail.name : formatMessage({ ...localeMessage['unknown'] })}</span></li>
                <li><span>{formatMessage({ ...localeMessage['entityName'] })}:</span><span>{currentAlertDetail.entityName ? currentAlertDetail.entityName : formatMessage({ ...localeMessage['unknown'] })}</span></li>
                <li><span>{formatMessage({ ...localeMessage['entityAddr'] })}:</span><span>{currentAlertDetail.entityAddr ? currentAlertDetail.entityAddr : formatMessage({ ...localeMessage['unknown'] })}</span></li>
                <li><span>{formatMessage({ ...localeMessage['notifyList'] })}:</span><span>{currentAlertDetail.isNotify ? sharedFunc(currentAlertDetail.notifyList) : formatMessage({ ...localeMessage['unknown'] })}</span></li>
                <li><span>{formatMessage({ ...localeMessage['status'] })}:</span><span>{window['_status'][currentAlertDetail.status]}</span></li>
                <li><span>{formatMessage({ ...localeMessage['severity'] })}:</span><span className={classnames(severityColor, styles.icon)} /><span>{window['_severity'][currentAlertDetail.severity]}</span></li>
                <li><span>{formatMessage({ ...localeMessage['source'] })}:</span><span>{currentAlertDetail.source ? currentAlertDetail.source : formatMessage({ ...localeMessage['unknown'] })}</span></li>
                {
                  currentAlertDetail.tags && currentAlertDetail.tags.length !== 0 ?
                    <li><span>{formatMessage({ ...localeMessage['tags'] })}:</span>
                      {
                        currentAlertDetail.tags.map((tag, index) => {
                          if (tag.key == 'severity' || tag.key == 'status') {
                            return <span title={`${tag.keyName} : ` + window[`_${tag.key}`][tag.value]} key={index} className={styles.tag}>{`${tag.keyName} : ` + window[`_${tag.key}`][tag.value]}</span>
                          } else if (tag.value == '') {
                            return <span title={tag.keyName} key={index} className={styles.tag}>{tag.keyName}</span>
                          } else {
                            return <span title={`${tag.keyName} : ${tag.value}`} key={index} className={styles.tag}>{`${tag.keyName} : ${tag.value}`}</span>
                          }

                        })
                      }
                    </li>
                    :
                    <li><span>{formatMessage({ ...localeMessage['tags'] })}:</span><span>{formatMessage({ ...localeMessage['unknown'] })}</span></li>
                }
                <li><span>{formatMessage({ ...localeMessage['description'] })}:</span><span>{currentAlertDetail.description ? currentAlertDetail.description : formatMessage({ ...localeMessage['unknown'] })}</span></li>
                <li><span>{formatMessage({ ...localeMessage['firstOccurred'] })}:</span><span>{dateTransfer(currentAlertDetail.firstOccurTime, currentAlertDetail.lastOccurTime).begin}</span></li>
                <li><span>{formatMessage({ ...localeMessage['lastOccurTime'] })}:</span><span>{dateTransfer(currentAlertDetail.firstOccurTime, currentAlertDetail.lastOccurTime).end}</span></li>
                <li><span>{formatMessage({ ...localeMessage['duration'] })}:</span><span>{durationFunc(currentAlertDetail.lastTime)}&nbsp;{currentAlertDetail.lastTime > 3600000 ? formatMessage({ ...localeMessage['hour'] }) : formatMessage({ ...localeMessage['min'] })}</span></li>
                <li><span>{formatMessage({ ...localeMessage['count'] })}:</span><span>{currentAlertDetail.count}</span></li>
                <li className={styles.gongDan}>
                  <span>{formatMessage({ ...localeMessage['ticket'] })}:</span>
                  {
                    !isShowOperateForm ?
                      <div className={styles.formMain}>
                        <span className={operateForm !== undefined && operateForm != '' && classnames(styles.content, styles.ticketFlow)} onClick={() => { clickTicketFlow(operateForm) }}>{operateForm}</span>
                        <span className={styles.editForm} onClick={openForm}>{formatMessage({ ...localeMessage['edit'] })}</span>
                      </div>
                      :
                      <Form>
                        <Form.Item>
                          {getFieldDecorator('formContent', {
                            initialValue: operateForm
                          })(
                            <Input placeholder={formatMessage({ ...localeMessage['text'] })} />
                            )}
                        </Form.Item>
                        <div className={styles.formMain}>
                          <Button type="primary" onClick={() => {
                            const formData = form.getFieldsValue();
                            editForm(formData)
                          }}>{formatMessage({ ...localeMessage['save'] })}</Button>
                          &nbsp;
                          <Button type="ghost" onClick={closeForm}>{formatMessage({ ...localeMessage['cancel'] })}</Button>
                        </div>
                      </Form>
                  }
                </li>
              </ul>
            </Wrap>
            {
              currentAlertDetail.properties !== undefined && Array.isArray(currentAlertDetail.properties) && currentAlertDetail.properties.length !== 0 ?
                <Wrap title={formatMessage({ ...localeMessage['enrich'] })}>
                  <ul>
                    {
                      currentAlertDetail.properties.map((item, index) => {
                        const linkVal = strToLink(item.val);
                        return <li key={index}><span>{item.name}</span><span>{linkVal? <a href={ linkVal.href } target="_blank" className={ styles.editForm }>{ linkVal.content }</a> : item.val}</span></li>
                      })
                    }
                  </ul>
                </Wrap>
                :
                undefined
            }
            {
              ci.length > 0 ?
                <Wrap visible={false} title={<span> {formatMessage({ ...localeMessage['ci'] })} &nbsp;&nbsp;<Link to="/alertQuery" query={{ resObjectId: ciId.value }}><span className={styles.ciDetailLink}>{formatMessage({ ...localeMessage['ciHistoryLink'] })}</span></Link></span>}>
                  {/*<ul>
                                <li><span>{formatMessage({...localeMessage['link']})}:</span><span><a href={ciUrl} target={'_blank'}>{formatMessage({...localeMessage['ciDetail']})}</a></span></li>
                            </ul>*/}
                  <ul>
                    {
                      ci.map((detail, index) => <li key={index}><span>{detail.code}:</span><span>&nbsp;{detail.value}</span></li>)
                    }
                  </ul>
                </Wrap>
                :
                undefined
            }
            {
              incidentLog.length > 0 ?
                (
                  <Wrap title={formatMessage({ ...localeMessage['log'] })}>
                    <Timeline>
                      {
                        incidentLog.map((log, index) => {
                          const date = new Date(log.operateTime);
                          const today = new Date();
                          const minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
                          let isShowOperateDate = false;
                          let isShowOperateYear = false;
                          if (index == incidentLog.length - 1) {
                            isShowOperateDate = true;
                            if (date.getFullYear() != today.getFullYear()) {
                              isShowOperateYear = true;
                            }
                          } else {
                            const nextDate = new Date(incidentLog[index + 1].operateTime);
                            isShowOperateDate = (date.getFullYear() != nextDate.getFullYear() || date.getMonth() != nextDate.getMonth() || date.getDate() != nextDate.getDate());
                            isShowOperateYear = (date.getFullYear() != nextDate.getFullYear());
                            if (date.getFullYear() != today.getFullYear()) {
                              isShowOperateYear = true && isShowOperateDate;
                            }
                          }
                          return (
                            <Timeline.Item key={log.incidentId + '' + index} color={index == 0 ? 'green' : 'blue'}>
                              <div className={classnames(styles.timeLineLabel)}>
                                {
                                  (isShowOperateYear ? (date.getFullYear() + "/") : '') + (isShowOperateDate ? ((date.getMonth() + 1) + "/" + date.getDate() + ' ') : '') + date.getHours() + ":" + minutes
                                }
                              </div>
                              <p>
                                <span>{formatMessage({ ...localeMessage['operateType'][log.operateType] })}</span>
                                {
                                  log.operatorName ?
                                    <span className={styles.operator_label}>{formatMessage({ ...localeMessage['operator'] })}&nbsp;:&nbsp;{log.operatorName}</span>
                                    :
                                    ""
                                }
                              </p>
                              {
                                log.attributes && log.attributes['flowNo'] ?
                                  (
                                    <p>
                                      <span>{formatMessage({ ...localeMessage['ticket'] })}&nbsp;:&nbsp;{log.attributes['flowNo']}</span>
                                    </p>
                                  )
                                  :
                                  ''
                              }
                              {
                                log.attributes && log.attributes['modalName'] ?
                                  (
                                    <p>
                                      <span>{formatMessage({ ...localeMessage['itsmType'] })}&nbsp;:&nbsp;{log.attributes['modalName']}</span>
                                    </p>
                                  )
                                  :
                                  ''
                              }
                              {
                                log.attributes && log.attributes['roomName'] ?
                                  (
                                    <p>
                                      <span>{formatMessage({ ...localeMessage['roomName'] })}&nbsp;:&nbsp;{log.attributes['roomName']}</span>
                                    </p>
                                  )
                                  :
                                  ''
                              }
                              {
                                log.attributes && log.attributes['recipient'] ?
                                  (
                                    <p>
                                      <span>{formatMessage({ ...localeMessage['recipient'] })}&nbsp;:&nbsp;{log.attributes['recipient'].map((recipient, index) => ((index > 0 ? ',' : '') + recipient))}</span>
                                    </p>
                                  )
                                  :
                                  ''
                              }
                              {
                                log.attributes && log.attributes['old_value'] && log.attributes['new_value'] ?
                                  <p>
                                    <span>{window._status[log.attributes['old_value']]}&nbsp;:&nbsp;->&nbsp;:&nbsp;{log.attributes['new_value']}</span>
                                  </p>
                                  :
                                  undefined
                              }
                              {
                                log.attributes && log.attributes['toUser'] ?
                                  (
                                    <p>
                                      <span>{formatMessage({ ...localeMessage['reassignMessage'] })}&nbsp;:&nbsp;{log.attributes['toUser']}</span>
                                    </p>
                                  )
                                  :
                                  ''
                              }
                              {
                                log.attributes && log.attributes['suppressionTime'] ?
                                  (
                                    <p>
                                      <span><FormattedMessage { ...localeMessage['suppressionMessage']} values={{ minutes: log.attributes['suppressionTime'] }} /></span>
                                    </p>
                                  )
                                  :
                                  ''
                              }
                              {
                                log.attributes && log.attributes['message'] ?
                                  (
                                    <p>
                                      <span>{formatMessage({ ...localeMessage['remark'] })}&nbsp;:&nbsp;{log.attributes['message']}</span>
                                    </p>
                                  )
                                  :
                                  ''
                              }
                            </Timeline.Item>
                          )
                        })
                      }
                    </Timeline>
                  </Wrap>
                )
                :
                undefined
            }

          </div>
        </Spin>
      </div>
    )
  }
}

alertDetail.defaultProps = {
  visible: false,
  extraProps: {},
  closeDeatilModal: () => { },
  clickTicketFlow: () => { },
  editForm: () => { },
  openForm: () => { },
  closeForm: () => { },
  openRemark: () => { },
  editRemark: () => { },
  closeRemark: () => { }
}

alertDetail.propTypes = {

}

export default injectIntl(Form.create()(alertDetail))
