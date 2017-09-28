import React, { PropTypes,Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import styles from './index.less'
import { classnames } from '../../utils'
import TagsQuery from '../common/tagsQuery/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const formatMessages = defineMessages({
    set:{
      id: 'alertManage.addTags',
      defaultMessage: '关注设置',
    },
    ok: {
      id: 'alertManage.setModal.ok',
      defaultMessage: '确认',
    },
    reset: {
      id: 'alertManage.setModal.reset',
      defaultMessage: '重置',
    }
})

const AlertSetModal = ({dispatch, alertTagsSet}) => {
    const {
      modalVisible,
      tagsKeyList,
      selectList,
    } = alertTagsSet;


    const closeTagsModal = () => {
      dispatch({
        type: 'alertTagsSet/closeModal',
        payload: false
      })
    }

    const tagsQueryProps = {
      tagsKeyList,
      selectList,
      closeOneItem: (e) => {
        e.stopPropagation();

        let tagrget = JSON.parse(e.target.getAttribute('data-id'));
        dispatch({
          type: 'alertTagsSet/closeOneItem',
          payload: tagrget
        })
      },
      closeAllItem: (e) => {
        e.stopPropagation();

        let tagrget = JSON.parse(e.target.getAttribute('data-id'));
        dispatch({
          type: 'alertTagsSet/closeAllItem',
          payload: tagrget
        })
      },
      mouseLeave: (target) => {
        dispatch({
          type: 'alertTagsSet/mouseLeave',
          payload: JSON.parse(target)
        })
      },
      deleteItemByKeyboard: (target) => {
        dispatch({
          type: 'alertTagsSet/deleteItemByKeyboard',
          payload: JSON.parse(target)
        })
      },
      queryTagValues: (key, message) => {
        dispatch({
          type: 'alertTagsSet/queryTagValues',
          payload: {
            key: key,
            value: message
          }
        })
      },
      changeHandler: (target) => {
        dispatch({
          type: 'alertTagsSet/changeSelectedItem',
          payload: target
        })
      },
      loadMore: (key, message) => {
        dispatch({
          type: 'alertTagsSet/loadMore',
          payload: {
            key: key,
            value: message
          }
        })
      }
    }

    const modalFooter = []
    modalFooter.push(<div key={'0'} className={styles.modalFooter} key={ 1 }>
      <Button type="primary" onClick={ () => {
        dispatch({
          type: 'alertTagsSet/addAlertTags'
        })
      }} ><FormattedMessage {...formatMessages['ok']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
        dispatch({
          type: 'alertTagsSet/resetItems',
        })
      }}><FormattedMessage {...formatMessages['reset']} /></Button>
      </div>
    )

    return (
        <Modal
          wrapClassName={styles.myModal}
          title={<FormattedMessage {...formatMessages['set']} />}
          maskClosable="true"
          onCancel={closeTagsModal}
          visible={modalVisible}
          footer={modalFooter}
        >
          <TagsQuery
            {...tagsQueryProps}
          />
        </Modal>
  )
}
export default connect(({alertTagsSet}) => ({alertTagsSet}))(AlertSetModal)
