import React, { PropTypes, Component } from 'react'
import { Select, Popover, Checkbox, Dropdown, Menu, Button, Icon, Tooltip } from 'antd';
import { connect } from 'dva'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Option = Select.Option;
const DropdownButton = Dropdown.Button;
const SubMenu = Menu.SubMenu;
const alertOperation = ({
  position,
  columnList,
  selectGroup,
  extendColumnList,
  extendTagsKey,
  checkCloumFunc,
  relieveFunc,
  takeOverFunc,
  dispatchFunc,
  closeFunc,
  resolveFunc,
  mergeFunc,
  groupFunc,
  noGroupFunc,
  showChatOpsFunc,
  suppressIncidents,
  showSuppressTimeSlider,
  takeOverDisabled,
  dispatchDisabled,
  closeDisabled,
  resolveDisabled,
  notifyDisabled,
  shareDisabled,
  mergeDisabled,
  reassignDisabled,
  suppressDisabled,
  chatOpsDisabled,
  showNotifyFunc,
  showReassiginFunc,
  disableReasonMap = {},
  showOperations = ['takeOver', 'reassign', 'dispatch', 'close', 'resolve', 'other'],
  isShowColSetBtn,
  intl: { formatMessage }
}) => {

  const localeMessage = defineMessages({
    operate_takeOver: {
      id: 'alertOperate.takeOver',
      defaultMessage: '接手'
    },
    operate_reassign: {
      id: 'alertOperate.reassign',
      defaultMessage: '转派'
    },
    owner: {
      id: 'alertDetail.owner',
      defaultMessage: '负责人'
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
    entityName: {
      id: 'alertList.title.enityName',
      defaultMessage: '对象',
    },
    name: {
      id: 'alertList.title.name',
      defaultMessage: '告警名称',
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
    classCode: {
      id: 'alertList.title.classCode',
      defaultMessage: '资源类型',
    },
    tags: {
      id: 'alertList.title.tags',
      defaultMessage: '标签',
    },
    lastTime: {
      id: 'alertList.title.lastTime',
      defaultMessage: '持续时间',
    },
    lastOccurTime: {
      id: 'alertList.title.lastOccurTime',
      defaultMessage: '最后发送时间',
    },
    firstOccurTime: {
      id: 'alertList.title.firstOccurTime',
      defaultMessage: '首次发生时间',
    },
    entityAddr: {
      id: 'alertList.title.entityAddr',
      defaultMessage: 'IP地址',
    },
    orderFlowNum: {
      id: 'alertList.title.orderFlowNum',
      defaultMessage: '关联工单',
    },
    notifyList: {
      id: 'alertList.title.notifyList',
      defaultMessage: '是否分享',
    },
    basic: {
      id: 'alertList.title.basic',
      defaultMessage: '常规',
    },
    additional: {
      id: 'alertList.title.additional',
      defaultMessage: '扩展',
    },
    suppressionFlag: {
      id: 'alertList.title.suppressionFlag',
      defaultMessage: '是否被抑制'
    },
    moreOperate: {
      id: 'alertOperate.moreAcitons',
      defaultMessage: '更多操作',
    },
    suppress: {
      id: 'alertOperate.suppress',
      defaultMessage: '抑制告警',
    },
    suppress_five: {
      id: 'alertOperate.suppress.five',
      defaultMessage: '5分钟内不再提醒',
    },
    suppress_ten: {
      id: 'alertOperate.suppress.ten',
      defaultMessage: '10分钟内不再提醒',
    },
    suppress_halfHour: {
      id: 'alertOperate.suppress.halfHour',
      defaultMessage: '半小时内不再提醒',
    },
    suppress_customer: {
      id: 'alertOperate.suppress.customer',
      defaultMessage: '自定义时间',
    },
    chatOps: {
      id: 'alertOperate.shareChatOps',
      defaultMessage: '分享到ChatOps',
    },
    notify: {
      id: 'alertOperate.manualNotify',
      defaultMessage: '告警通知',
    },
    columns: {
      id: 'alertOperate.columns',
      defaultMessage: '列定制',
    },
    groupBy: {
      id: 'alertOperate.groupBy',
      defaultMessage: '分组显示',
    },
    groupByEnityName: {
      id: 'alertOperate.groupByEnityName',
      defaultMessage: '按对象分组',
    },
    groupBySource: {
      id: 'alertOperate.groupBySource',
      defaultMessage: '按来源分组',
    },
    groupByStatus: {
      id: 'alertOperate.groupByStatus',
      defaultMessage: '按状态分组',
    },
    groupBySeverity: {
      id: 'alertOperate.groupBySeverity',
      defaultMessage: '按级别分组',
    },
    groupByIPAddress: {
      id: 'alertOperate.groupByIPAddress',
      defaultMessage: '按IP地址分组'
    },
    groupByOther: {
      id: 'alertOperate.groupByOther',
      defaultMessage: '按{other}分组',
    },
  })

  const setClass = classnames(
    'icon',
    'iconfont',
    'icon-bushu'
  )

  const switchClass = classnames(
    'icon',
    'iconfont',
    'icon-anonymous-iconfont'
  )

  const popoverContent = position === 'list' ?
    <div className={styles.popoverMain}>
      {
        columnList.map((group, index) => {
          return (
            <div key={index} className={styles.colGroup}>
              <p>{group.type == 0 ? <FormattedMessage {...localeMessage['basic']} /> : <FormattedMessage {...localeMessage['additional']} />}</p>
              {
                group.cols.map((item, index) => {
                  if (item.id === 'entityName' || item.id === 'name') {
                    return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={true} disabled={true} >
                      {item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}
                    </Checkbox></div>
                  } else {
                    return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={item.checked} onChange={(e) => {
                      checkCloumFunc(e)
                    }}>{item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}</Checkbox></div>
                  }
                })
              }
            </div>
          )
        })
      }
    </div>
    :
    undefined

  // 解除合并的下拉菜单
  // const menu = (
  //   <Menu onClick={relieveFunc}>
  //     <Menu.Item key="1" className={styles.menuItem}><FormattedMessage {...localeMessage['operate_relieve']} /></Menu.Item>
  //   </Menu>
  // )

  const reassign = (
    <Menu onClick={() => {
      showReassiginFunc(position);
    }}>
      <Menu.Item key="1" className={styles.menuItem}><FormattedMessage {...localeMessage['operate_reassign']} /></Menu.Item>
    </Menu>
  )

  const menu = (
    <Menu
      onClick={(e) => {
        const key = e.key;
        const min = parseInt(key);
        // 以分钟计 --> 100 customer
        if (min) {
          if (min !== 100) {
            suppressIncidents(min, position)
          } else {
            showSuppressTimeSlider(position)
          }
        } else {
          switch (key) {
            case 'merge':
              mergeFunc();
              break;
            case 'chatOps':
              showChatOpsFunc(position);
              break;
            case 'notify':
              showNotifyFunc(position);
              break;
            default: return;
          }
        }
      }}
    >
      {
        position !== 'detail' && showOperations.indexOf('merge') < 0 &&
        <Menu.Item key="merge" className={styles.menuItem} disabled={mergeDisabled}>
          <FormattedMessage {...localeMessage['operate_merge']} />
        </Menu.Item>
      }
      <SubMenu title={formatMessage({ ...localeMessage['suppress'] })} className={styles.menuItem} disabled={suppressDisabled}>
        <Menu.Item key="5" className={styles.menuItem}><FormattedMessage {...localeMessage['suppress_five']} /></Menu.Item>
        <Menu.Item key="10" className={styles.menuItem}><FormattedMessage {...localeMessage['suppress_ten']} /></Menu.Item>
        <Menu.Item key="30" className={styles.menuItem}><FormattedMessage {...localeMessage['suppress_halfHour']} /></Menu.Item>
        <Menu.Item key="100" className={styles.menuItem}><FormattedMessage {...localeMessage['suppress_customer']} /></Menu.Item>
      </SubMenu>
      <Menu.Item key="chatOps" className={styles.menuItem} disabled={chatOpsDisabled}>
        <FormattedMessage {...localeMessage['chatOps']} />
      </Menu.Item>
      <Menu.Item key="notify" className={styles.menuItem} disabled={notifyDisabled}>
        <FormattedMessage {...localeMessage['notify']} />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.operateMain}>
      {/*{
        showOperations.indexOf('takeOver') >= 0 && showOperations.indexOf('reassign') < 0 ?
          <DropdownButton
            overlay={reassign}
            className={styles.myDropdown}
            disabled={takeOverDisabled && reassignDisabled}
            onClick={() => { takeOverDisabled && takeOverFunc(position) }}
          >
            <FormattedMessage {...localeMessage['operate_takeOver']} />
          </DropdownButton>
          :
          showOperations.indexOf('reassign') >= 0 ?
            takeOverDisabled && disableReasonMap['takeOverDisabled'] ?
              <Tooltip title={disableReasonMap['takeOverDisabled']}>
                <Button className={styles.myButton} disabled={takeOverDisabled} onClick={() => { takeOverFunc(position) }} >
                  <FormattedMessage {...localeMessage['operate_takeOver']} />
                </Button>
              </Tooltip>
              :
              <Button className={styles.myButton} disabled={takeOverDisabled} onClick={() => { takeOverFunc(position) }} >
                <FormattedMessage {...localeMessage['operate_takeOver']} />
              </Button>
            :
            undefined
      }*/}

      {
        showOperations.indexOf('takeOver') >= 0 ?
          takeOverDisabled && disableReasonMap['takeOverDisabled'] ?
            <Tooltip title={disableReasonMap['takeOverDisabled']}>
              <Button className={styles.myButton} disabled={takeOverDisabled} onClick={() => { takeOverFunc(position) }} >
                <FormattedMessage {...localeMessage['operate_takeOver']} />
              </Button>
            </Tooltip>
            :
            <Button className={styles.myButton} disabled={takeOverDisabled} onClick={() => { takeOverFunc(position) }} >
              <FormattedMessage {...localeMessage['operate_takeOver']} />
            </Button>
          :
          undefined
      }

      {
        showOperations.indexOf('reassign') >= 0 ?
          reassignDisabled && disableReasonMap['reassignDisabled'] ?
            <Tooltip title={disableReasonMap['reassignDisabled']}>
              <Button className={styles.myButton} disabled={reassignDisabled} onClick={() => { showReassiginFunc(position) }} >
                <FormattedMessage {...localeMessage['operate_reassign']} />
              </Button>
            </Tooltip>
            :
            <Button className={styles.myButton} disabled={reassignDisabled} onClick={() => { showReassiginFunc(position) }} >
              <FormattedMessage {...localeMessage['operate_reassign']} />
            </Button>
          :
          undefined
      }

      {
        showOperations.indexOf('dispatch') >= 0 ?
          dispatchDisabled && disableReasonMap['dispatchDisabled'] ?
            <Tooltip title={disableReasonMap['dispatchDisabled']}>
              <Button className={styles.myButton} disabled={dispatchDisabled} onClick={() => { dispatchFunc(position) }} >
                <FormattedMessage {...localeMessage['operate_dispatch']} />
              </Button>
            </Tooltip>
            :
            <Button className={styles.myButton} disabled={dispatchDisabled} onClick={() => { dispatchFunc(position) }} >
              <FormattedMessage {...localeMessage['operate_dispatch']} />
            </Button>
          :
          undefined
      }

      {
        showOperations.indexOf('close') >= 0 ?
          closeDisabled && disableReasonMap['closeDisabled'] ?
            <Tooltip title={disableReasonMap['closeDisabled']}>
              <Button className={styles.myButton} disabled={closeDisabled} onClick={() => { closeFunc(position) }} >
                <FormattedMessage {...localeMessage['operate_close']} />
              </Button>
            </Tooltip>
            :
            <Button className={styles.myButton} disabled={closeDisabled} onClick={() => { closeFunc(position) }} >
              <FormattedMessage {...localeMessage['operate_close']} />
            </Button>
          :
          undefined
      }

      {
        showOperations.indexOf('resolve') >= 0 ?
          resolveDisabled && disableReasonMap['resolveDisabled'] ?
            <Tooltip title={disableReasonMap['resolveDisabled']}>
              <Button className={styles.myButton} disabled={resolveDisabled} onClick={() => { resolveFunc(position) }} >
                <FormattedMessage {...localeMessage['operate_resolve']} />
              </Button>
            </Tooltip>
            :
            <Button className={styles.myButton} disabled={resolveDisabled} onClick={() => { resolveFunc(position) }} >
              <FormattedMessage {...localeMessage['operate_resolve']} />
            </Button>
          :
          undefined
      }

      {
        showOperations.indexOf('merge') >= 0 ?
          <Button className={styles.myButton} disabled={mergeDisabled} onClick={() => { mergeFunc() }} >
            <FormattedMessage {...localeMessage['operate_merge']} />
          </Button>
          :
          undefined
      }

      {
        showOperations.indexOf('other') >= 0 ?
          <Dropdown overlay={menu}>
            <span className={styles.moreOperateDropdown}>{formatMessage({ ...localeMessage['moreOperate'] })}<Icon type="down" /></span>
          </Dropdown>
          :
          undefined
      }


      {/*<Dropdown overlay={menu} trigger={['click']} >
        <span className={styles.moreActionDropdown}>{formatMessage({ ...localeMessage['moreOperate'] })}<Icon type="down" /></span>
      </Dropdown>

      {
        // 合并
        position !== 'detail' &&
        <DropdownButton className={styles.myDropdown} overlay={menu} trigger={['click']} onClick={mergeFunc}>
          <FormattedMessage {...localeMessage['operate_merge']} />
        </DropdownButton>
      }

      {
        position !== 'detail' &&
        <Button className={styles.myButton} onClick={mergeFunc} >
          <FormattedMessage {...localeMessage['operate_merge']} />
        </Button>
      }*/}

      {/*抑制*/}
      {/*<Select getPopupContainer={() => document.getElementById("content")} allowClear
        style={{ width: '100px' }} className={styles.selectSingle}
        placeholder={formatMessage({ ...localeMessage['suppress'] })}
        onChange={(min) => {
          // 以分钟计 --> 100 customer
          if (min) {
            if (min !== '100')
              suppressIncidents(min, position)
            else
              showSuppressTimeSlider(position)
          }
        }}>
        <Option value="5"><FormattedMessage {...localeMessage['suppress_five']} /></Option>
        <Option value="10"><FormattedMessage {...localeMessage['suppress_ten']} /></Option>
        <Option value="30"><FormattedMessage {...localeMessage['suppress_halfHour']} /></Option>
        <Option value="100"><FormattedMessage {...localeMessage['suppress_customer']} /></Option>
      </Select>*/}

      {/*更多*/}
      {/*<Select getPopupContainer={() => document.getElementById("content")}
        className={styles.showChatOps} style={{ width: '100px' }} allowClear
        placeholder={formatMessage({ ...localeMessage['moreOperate'] })}
        onChange={(operate) => {
          switch (operate) {
            case 'ChatOps':
              showChatOpsFunc(position)
              break;
            case 'notify':
              showNotifyFunc(position)
              break;
            default:
              () => { }
              break;
          }
        }}>
        <Option disabled={notifyDisabled} value="notify"><FormattedMessage {...localeMessage['notify']} /></Option>
        {
          window.__alert_appLocaleData.locale == 'zh-cn' ?
            <Option value="ChatOps" disabled={shareDisabled}><FormattedMessage {...localeMessage['chatOps']} /></Option>
            :
            []
        }
      </Select>*/}


      { //分组显示的下拉菜单
        position !== 'detail' &&
        <div className={styles.groupMain}>
          <Select getPopupContainer={() => document.getElementById("content")} className={classnames(styles.setGroup, styles.selectSingle)} placeholder={formatMessage({ ...localeMessage['groupBy'] })} value={selectGroup} onChange={(value) => {
            groupFunc(value)
          }}>
            <Option key={'severity'} className={styles.menuItem} value="severity"><FormattedMessage {...localeMessage['groupBySeverity']} /></Option>
            <Option key={'entityName'} className={styles.menuItem} value="entityName"><FormattedMessage {...localeMessage['groupByEnityName']} /></Option>
            <Option key={'source'} className={styles.menuItem} value="source"><FormattedMessage {...localeMessage['groupBySource']} /></Option>
            <Option key={'status'} className={styles.menuItem} value="status"><FormattedMessage {...localeMessage['groupByStatus']} /></Option>
            <Option key={'IPAddress'} className={styles.menuItem} value="entityAddr"><FormattedMessage {...localeMessage['groupByIPAddress']} /></Option>
            {
              extendColumnList.length > 0 ? extendColumnList.map((col, index) => {
                return <Option key={col.id} className={styles.menuItem} value={col.id}><FormattedMessage {...localeMessage['groupByOther']} values={{ other: col.name }} /></Option>
              }) : []
            }
            {
              extendTagsKey.length > 0 ? extendTagsKey.map((tag, index) => {
                return <Option key={tag} className={styles.menuItem} value={tag}><FormattedMessage {...localeMessage['groupByOther']} values={{ other: tag }} /></Option>
              }) : []
            }
          </Select>
          <i className={selectGroup !== undefined && classnames(switchClass, styles.switch)} onClick={noGroupFunc}></i>
        </div>
      }

      { //列定制的popover
        position === 'list' && isShowColSetBtn != false &&
        <Popover placement='bottomRight' overlayClassName={styles.popover} content={popoverContent} >
          <div className={classnames(styles.button, styles.rightBtn)}>
            <i className={classnames(setClass, styles.setCol)}></i>
            <p className={styles.col}> <FormattedMessage {...localeMessage['columns']} /></p>
          </div>
        </Popover>
      }
    </div>
  )
}

alertOperation.defaultProps = {
  position: 'list',
  columnList: [],
  selectGroup: undefined,
  extendColumnList: [],
  checkCloumFunc: () => { },
  relieveFunc: () => { },
  takeOverFunc: () => { },
  dispatchFunc: () => { },
  closeFunc: () => { },
  resolveFunc: () => { },
  mergeFunc: () => { },
  groupFunc: () => { },
  noGroupFunc: () => { },
  showChatOpsFunc: () => { },
  showNotifyFunc: () => { },
  suppressIncidents: () => { },
  showSuppressTimeSlider: () => { },
  showReassiginFunc: () => { }
  // takeOverDisabled: true,
  // dispatchDisabled: true,
  // closeDisabled: true,
  // resolveDisabled: true,
  // notifyDisabled: false,
  // shareDisabled: false,
}

alertOperation.propTypes = {
  position: React.PropTypes.oneOf(['list', 'timeAxis', 'detail']).isRequired,
  columnList: React.PropTypes.array,
}

export default injectIntl(alertOperation)
