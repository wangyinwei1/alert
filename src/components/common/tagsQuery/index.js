import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom';
import styles from './index.less'
import { Modal, Button, Form, Select, Row, Col, Input, Table, Popover, Radio} from 'antd';
import Animate from 'rc-animate'
import KeyCode from 'rc-util/lib/KeyCode';
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import scrollIntoView from 'dom-scroll-into-view';
import DOMWrap from './Domwrap.js'

const Item = Form.Item;
class TagsQuery extends Component{

    constructor(props) {
        super(props);
        this.timer = null;
        this.visibleTimer = null;
    }

    componentDidUpdate(nextProps) {
      if (this.domWrap && this.container && findDOMNode(this.container).parentNode) {
        scrollIntoView(findDOMNode(this.domWrap), findDOMNode(this.container).parentNode, {
          onlyScrollIfNeeded: true
        })
      }
    }

    delay(callback, delayS) {
      const delay = delayS * 1000;
      this.clearDelayTimer();
      if (delay) {
        this.visibleTimer = setTimeout(() => {
          callback();
          this.clearDelayTimer();
        }, delay);
      } else {
        callback();
      }
    }

    clearDelayTimer() {
      if (this.visibleTimer) {
        clearTimeout(this.visibleTimer)
        this.visibleTimer = null
      }
    }

    leave(tagGroup) {
      this.props.mouseLeave(JSON.stringify({field: tagGroup.key}))
      this.refs[`input_${tagGroup.key}`].blur();
    }

    selectHandler(tagGroup, e) {
      e.stopPropagation();
      let target = JSON.parse(e.currentTarget.getAttribute('data-id'));
      this.props.changeHandler({
        key: tagGroup.key,
        item: target
      })
      this.refs[`input_${tagGroup.key}`]['value'] = '';
    }

    loadMore(tagGroup) {
      this.props.loadMore(tagGroup.key, this.refs[`input_${tagGroup.key}`]['value'])
    }

    render() {

        const {
            form,
            tagsKeyList,
            selectList,
            closeOneItem,
            closeAllItem,
            deleteItemByKeyboard,
            queryTagValues,
            intl: {formatMessage}
        } = this.props;

        const removeClass = classnames(
            'icon',
            'iconfont',
            'icon-anonymous-iconfont'
        )

        const localeMessage = defineMessages({
          placeholder: {
              id: 'modal.tag.select',
              defaultMessage: '请选择{name}'
          }
        })

        const itemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        const renderName = (key, name) => {
            if (key == 'severity' || key == 'status') {
                return window[`_${key}`][name]
            } else {
                return name
            }
        }

        return (
            <div className={styles.tags_container} ref={container => this.container = container}>
                <Form>
                    {
                        tagsKeyList.length > 0 ? tagsKeyList.map( (tagGroup, index) => {
                            return (
                                <Item
                                    {...itemLayout}
                                    key={index}
                                    label={tagGroup.keyName}
                                >
                                    <div className={styles.tags_query_container}>
                                        <ul className={styles.tags_data_content}>
                                            {
                                                tagGroup.selectedChildren.length > 0 ? tagGroup.selectedChildren.map( (child, itemIndex) => {
                                                    return (
                                                        <li key={itemIndex}>
                                                            <span className={styles.tags_tag}>
                                                                {renderName(tagGroup.key, child.name)}
                                                                <i
                                                                    className={classnames(removeClass, styles.tags_remove)}
                                                                    data-id={JSON.stringify({field: tagGroup.key, id: child.id})}
                                                                    onClick={(e) => { closeOneItem(e) }}>
                                                                </i>
                                                            </span>
                                                        </li>
                                                    )
                                                }) : []
                                            }
                                            <li>
                                                <div className={styles.tags_input}>
                                                    <input ref={`input_${tagGroup.key}`} type={'text'} placeholder={formatMessage(localeMessage['placeholder'], {name: `${tagGroup.keyName}`})} onChange={ (e) => {
                                                        e.persist();
                                                        clearTimeout(this.timer)

                                                        this.timer = setTimeout( () => {
                                                            queryTagValues(tagGroup.key, e.target.value)
                                                        }, 500)
                                                    }} onKeyDown={ (event) => {
                                                        if (event.keyCode === KeyCode.BACKSPACE && event.target.value == '') {
                                                            deleteItemByKeyboard(JSON.stringify({field: tagGroup.key}))
                                                        }
                                                    }} onFocus={ () => { queryTagValues(tagGroup.key, '') } }/>
                                                </div>
                                            </li>
                                            {
                                                tagGroup.selectedChildren.length > 0 ?
                                                <i
                                                    className={classnames(removeClass, styles.tags_removeAll)}
                                                    data-id={JSON.stringify({field: tagGroup.key})}
                                                    onClick={(e) => { closeAllItem(e) }}></i>
                                                :
                                                undefined
                                            }
                                        </ul>
                                        <Animate
                                            transitionName={{
                                              enter: 'enter',
                                              enterActive: 'enterActive',
                                              leave: 'leave',
                                              leaveActive: 'leaveActive',
                                              appear: 'appear',
                                              appearActive: 'appearActive'
                                            }}
                                        >
                                        {
                                            tagGroup.tagSpread ?
                                            <DOMWrap
                                              tag='ul'
                                              ref={ domWrap => this.domWrap = domWrap }
                                              onMouseLeave={ this.delay.bind(this, this.leave.bind(this, tagGroup), 0.2)}
                                              selectList={this.props.selectList}
                                              selectHandler={this.selectHandler.bind(this, tagGroup)}
                                              loadMore={this.loadMore.bind(this, tagGroup)}
                                              onkeyEnter={(item) => {
                                                this.props.changeHandler({
                                                  key: tagGroup['key'],
                                                  item: item
                                                })
                                              }}
                                            />
                                            :
                                            undefined
                                        }
                                        </Animate>
                                    </div>
                                </Item>
                            )
                        }) : []
                    }
                </Form>
            </div>
        )

    }
}

TagsQuery.defaultProps = {

}

TagsQuery.propTypes = {

}

export default injectIntl(Form.create()(TagsQuery));
