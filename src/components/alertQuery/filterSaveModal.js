import React, { Component } from 'react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import CommonModal from '../common/commonModal/index'
import { Form, Input, message } from 'antd'

const localeMessages = defineMessages({
  saveFilter: {
    id: 'alertQueryFilter.saveFilter',
    defaultMessage: '保存过滤条件'
  },
  savePlaceholder: {
    id: 'alertQueryFilter.savePlaceholder',
    defaultMessage: '请输入当前过滤条件的名称'
  }
})

class FilterSaveModal extends Component {
  render() {
    const { dispatch, form, intl: { formatMessage }, isShowSaveModal } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const okProps = {
      onClick: () => {
        form.validateFields((errors, values) => {
          if (!!errors) {
            return;
          }
          const formData = form.getFieldsValue();

          // 如果输入为空
          if(!formData.name || formData.name.trim() == '' ) {
            return;
          }

          dispatch({
            type: 'alertQueryFilter/saveFilter',
            payload: {
              name: formData.name
            }
          })
        })
      }
    }

    const cancelProps = {
      onClick: () => {
        dispatch({
          type: 'alertQueryFilter/closeSaveModal'
        })
      }
    }
    return (
      <CommonModal
        title={formatMessage({ ...localeMessages['saveFilter'] })}
        isShow={isShowSaveModal}
        okProps={okProps}
        cancelProps={cancelProps}
      >
        <Form>
          {getFieldDecorator('name', {
            initialValue: '',
            rules: {
              required: true
            }
          })(
            <Input placeholder={formatMessage({ ...localeMessages['savePlaceholder'] })} />
            )}
        </Form>
      </CommonModal>
    )
  }
}

export default injectIntl(Form.create({
  mapPropsToFields: (props) => {
    return { name: '' }
  }
})(FilterSaveModal));

