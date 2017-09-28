import React, { Component } from 'react';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import CommonModal from '../common/commonModal/index'
import { Form, Input } from 'antd'
import { classnames } from '../../utils/'

const localeMessages = defineMessages({
  saveFilter: {
    id: 'alertQueryFilter.deleteFilter',
    defaultMessage: '删除过滤条件'
  },
  deleteMessage: {
    id: 'alertQueryFilter.deleteFilterMessage',
    defaultMessage: '是否删除过滤条件{ name }'
  }
})

const FilterDeleteModal = ({ dispatch, form, intl: { formatMessage }, isShowDeleteModal, toDeleteFilter }) => {
  const okProps = {
    onClick: () => {
      dispatch({
        type: 'alertQueryFilter/deleteFilter',
        payload: {
          id: toDeleteFilter.id
        }
      })
    }
  }

  const cancelProps = {
    onClick: () => {
      dispatch({
        type: 'alertQueryFilter/closeDeleteModal',
      })
    }
  }

  const tishiIcon = classnames(
    'iconfont',
    'icon-tishi'
  )

  return (
    <CommonModal
      title={formatMessage({ ...localeMessages['saveFilter'] })}
      isShow={isShowDeleteModal}
      okProps={okProps}
      cancelProps={cancelProps}
      iconClass={ tishiIcon }
    >
      <p><FormattedMessage { ...localeMessages['deleteMessage'] } values={{ name: toDeleteFilter.name }}/></p>
    </CommonModal>
  )
}

export default injectIntl(FilterDeleteModal);

