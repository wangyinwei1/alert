import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { message, Upload, Button, Form, Input, Checkbox } from 'antd';
import styles from './index.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import CommonModal from '../common/commonModal'
import SelfInput from '../common/input/alertInput'
import { addActionModalMessages } from './I18Message'
import { addActionModalDispatch } from './dispatch'
import AlertComfirm from './alertComfirm'
import constants from '../../utils/constants'


const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;


const appDeleteModal = ({ form, am_addActionModal, dispatch, intl: { formatMessage } }) => {
  const { jarId, isEdit, isReplace, actionNameValue, actionDescriptionValue, isShow, currentEditApp, fileList, checkboxValue } = am_addActionModal;
  //国际化
  const localeMessage = addActionModalMessages;
  //统一dispatch
  const { homonymousTest, editAction, checkBoxChange, descriptionChange, actionNameChange, changeFileList, saveJarId, onRemoveFile } = addActionModalDispatch(dispatch);

  const okProps = {
    onClick: () => {
      if (isEdit) {
        editAction({
          actionName: actionNameValue,
          description: actionDescriptionValue,
          scope: checkboxValue,
          id: currentEditApp.id
        })
        form.resetFields();
      } else {
        form.validateFields(
          (err) => {
            if (!err) {
              if (!fileList[0] || !actionNameValue || !checkboxValue[0]) return;
              homonymousTest({
                params: {
                  jarId: jarId,
                  actionName: actionNameValue,
                  description: actionDescriptionValue,
                  scope: checkboxValue
                },
                form: form
              })
            }
          },
        );
      }

    }
  }
  const cancelProps = {
    onClick: () => {
      if (isEdit) {
        dispatch({
          type: 'am_addActionModal/toggleEditModal',
          payload: {
            status: false,
          }
        })
      } else {
        dispatch({
          type: 'am_addActionModal/toggleModal',
          payload: {
            status: false,
          }
        })
      }
      form.resetFields();
    }
  }

  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 10
    },
  };
  const beforeUpload = (info) => {
    const filename = info.name;
    const index = filename.lastIndexOf(".");
    const filenameLen = filename.length;
    const suffixName = filename.substring(index, filenameLen);
    if (suffixName !== '.jar') {
      message.error(formatMessage({ ...localeMessage['jarTypeTest'] }));
      return false;
    }
    changeFileList(info);
  }
  const props = {
    fileList: fileList,
    name: 'file',
    multiple: false,
    beforeUpload: beforeUpload,
    action: constants['api_root'] + '/action/uploadActionJar',
    onRemove() {
      onRemoveFile();
    },
    onChange(info, fileList) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (info.file.status === 'done') {
        console.log(info.file.response);
        saveJarId({ jarId: info.file.response.jarId || '' })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div>
      <CommonModal
        title={formatMessage({ ...localeMessage['addAction'] })}
        isShow={isShow}
        okProps={okProps}
        width={458}
        cancelProps={cancelProps}
      >
        <div className={styles.addActionModal} >
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
            label={formatMessage({ ...localeMessage['actionName'] })}
            hasFeedback
          >
            {getFieldDecorator('action-name', {
              initialValue: actionNameValue,
              rules: [{ max: 20, message: formatMessage({ ...localeMessage['limit_subject'] }) }, { required: true, message: formatMessage({ ...localeMessage['emptyName'] }) }]
            })(
              <SelfInput
                wordLimit={20}
                onChange={(e) => {
                  actionNameChange(e)
                }}
                placeholder={formatMessage({ ...localeMessage['actionNamePlaceholder'] })} />
              )}
          </FormItem>
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17 }}
            label={formatMessage({ ...localeMessage['actionDescription'] })}
          >
            {getFieldDecorator('action-Description', {
              initialValue: actionDescriptionValue,
              rules: [
                { max: 50, message: formatMessage({ ...localeMessage['limit_subject'] }) }
              ]
            })(
              <SelfInput
                onChange={(e) => {
                  descriptionChange(e);
                }}

                type="textarea"
                autosize={{ minRows: 2, maxRows: 6 }}
                wordLimit={50}
                placeholder={formatMessage({ ...localeMessage['addDescription'] })} />
              )}
          </FormItem>
          {!isEdit ?
            <FormItem
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              label={formatMessage({ ...localeMessage['actionUpload'] })}
            >
              {getFieldDecorator('action-selectFile', {
                rules: [{ required: true, message: formatMessage({ ...localeMessage['selectUploadFile'] }) }]
              })(
                <Upload {...props}>
                  <Button className={styles.uploadBtn}>
                    {formatMessage({ ...localeMessage['selectFile'] })}
                  </Button>
                  {!fileList[0] && <span className={styles.unselected}><FormattedMessage {...localeMessage['noSelectedFile']} /></span>}
                </Upload>
                )}
            </FormItem>

            : null}
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            label={formatMessage({ ...localeMessage['scope'] })}
          >
            {getFieldDecorator('action-checkbox', {
              initialValue: checkboxValue,
              rules: [{ required: true, message: formatMessage({ ...localeMessage['selectedCheckBox'] }) }],
              valuePropName: 'checked',
            })(
              <CheckboxGroup
                value={checkboxValue}
                options={[
                  { label: formatMessage({ ...localeMessage['newAlarm'] }), value: 1 },
                  { label: formatMessage({ ...localeMessage['existingAlarm'] }), value: 2 },
                ]}
                onChange={(checkedValues) => {
                  checkBoxChange(checkedValues)
                }} />
              )}
          </FormItem>
        </div>
      </CommonModal >
      <AlertComfirm form={form} />
    </div>
  )
}

appDeleteModal.propTypes = {

}

export default injectIntl(connect(state => {
  return {
    am_addActionModal: state.am_addActionModal,
  }
})(Form.create()(appDeleteModal)));