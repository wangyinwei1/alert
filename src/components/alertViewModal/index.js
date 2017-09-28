import React, { Component } from 'react'
import { connect } from 'dva'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Form, Input, Dropdown, Spin } from 'antd'
import AlertInput from '../common/input/alertInput.js'
import icons from '../../config/menuIcons.json'
import { classnames } from '../../utils/index.js'
import CommonModal from '../common/commonModal/index'
import IconSelect from '../common/iconSelect/index'

import styles from './index.less'

const DropdownBtn = Dropdown.Button;

const localeMessages = defineMessages({
  addSceneMonitor: {
    id: 'leftMenu.sceneMonitor.add',
    defaultMessage: "添加视图"
  },
  editSceneMonitor: {
    id: 'leftMenu.sceneMonitor.edit',
    defaultMessage: "编辑视图"
  },
  namePlaceholder: {
    id: 'leftMenu.sceneMonitor.namePlaceholder',
    defaultMessage: '请输入视图名称'
  },
  name: {
    id: 'leftMenu.sceneMonitor.name',
    defaultMessage: '视图名称'
  },
  ok: {
    id: 'alertDetail.save'
  },
  maxLength: {
    id: 'form.maxLengthWarn'
  },
  icon: {
    id: 'alertView.icon',
    defaultMessage: '图标'
  }
})

const deleteIcon = classnames(
  'icon',
  'iconfont',
  'icon-shanchu'
)

class AlertViewModal extends Component {
  render() {
    const { alertView = {}, dispatch, form, intl: { formatMessage } } = this.props;
    const { currentView = {}, isShowViewModal, isLoadingView } = alertView;
    const { getFieldDecorator } = form;
    console.log(isShowViewModal);
    const okProps = {
      title: formatMessage({ ...localeMessages['ok'] }),
      disabled: isLoadingView,
      onClick: () => {
        form.validateFields((errors, values) => {
          if (!!errors) {
            return;
          }

          dispatch({
            type: currentView.id ? 'alertView/updateView' : 'alertView/saveView',
            payload: {
              view: {
                name: values.name,
                icon: values.icon
              }
            }
          })
        })
      }
    }

    const cancelProps = {
      onClick: () => {
        dispatch({
          type: 'alertView/toggleViewModalVisible',
          payload: {
            isShowViewModal: false
          }
        })
      }
    }

    const itemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    }



    return (
      <CommonModal
        title={currentView.id ? formatMessage({ ...localeMessages['editSceneMonitor'] }) : formatMessage({ ...localeMessages['addSceneMonitor'] })}
        isShow={isShowViewModal}
        okProps={okProps}
        cancelProps={cancelProps}
        width={ 416 }
      >
        <Spin spinning={isLoadingView}>
          <Form>
            <Form.Item
              {...itemLayout}
              label={formatMessage({ ...localeMessages['name'] })}
            >
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  { required: true, message: formatMessage({ ...localeMessages['namePlaceholder'] }) },
                  { max: 50, message: formatMessage({...localeMessages['maxLength']}, { field: formatMessage({ ...localeMessages['name'] }), wordNum: 50 } ) }
                ]
              })(
                <AlertInput autoComplete="off" wordLimit={50} placeholder={formatMessage({ ...localeMessages['namePlaceholder'] })} />
              )}
              {
                currentView.id?
                <a onClick={(e) => {
                  dispatch({
                    type: 'alertView/deleteView',
                    payload: {
                      id: currentView.id
                    }
                  })
                }} className={styles.deleteBtn}><i className={deleteIcon}/></a>
                :
                undefined
              }
            </Form.Item>
            <Form.Item
              {...itemLayout}
              label={formatMessage({ ...localeMessages['icon'] })}
            >
              {getFieldDecorator('icon', {

              })(
                <IconSelect onChange={(value) => {
                  form.setFieldsValue({ icon: value })
                }} />
              )}
            </Form.Item>
          </Form>
        </Spin>
      </CommonModal>
    )
  }
}

export default injectIntl(Form.create({
  mapPropsToFields: (props) => {
    const alertView = props.alertView || {};
    const currentView = alertView.currentView || {}
    return {
      name: { value: currentView.name },
      icon: { value: currentView.icon }
    }
  }
})(AlertViewModal))