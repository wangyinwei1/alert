import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Checkbox} from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

class suppressModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            checked: false
        }
    }

    render() {
        const { isShowRemindModal, onKnow } = this.props;

        const tixingIcon = classnames(
            'iconfont',
            'icon-danchuangchenggongtishi'
        )

        const localeMessage = defineMessages({
            know: {
                id: 'modal.know',
                defaultMessage: '知道了'
            },
            title: {
                id: 'modal.suppress.success',
                defaultMessage: '抑制成功'
            },
            content: {
                id: 'modal.suppress.successRemind',
                defaultMessage: '告警将临时关闭，取消抑制请移步 “设置———关联规则”，禁用或删除对应的规则'
            },
            remind: {
                id: 'modal.remind',
                defaultMessage: '不再提醒',
            }
        })

        const modalFooter = []
        modalFooter.push(<div key={1} className={styles.modalFooter} key={ 1 }>
        <Button type="primary" onClick={ () => {
            onKnow(this.state.checked)
        }} ><FormattedMessage {...localeMessage['know']} /></Button>
        </div>
        )

        return (
            <Modal
                wrapClassName={styles.suppressWrap}
                maskClosable={false}
                onCancel={ () => {onKnow(false)} }
                visible={ isShowRemindModal }
                footer={ modalFooter }
            >
                <div className={styles.suppressMain}>
                    <i className={tixingIcon}></i>
                    <div>
                        <p className={styles.title}><FormattedMessage {...localeMessage['title']} /></p>
                        <p className={styles.content}><FormattedMessage {...localeMessage['content']} /></p>
                        <Checkbox value={this.state.checked} onChange={(function() {
                            this.setState({
                                checked: !this.state.checked
                            })
                        }).bind(this)}><FormattedMessage {...localeMessage['remind']} /></Checkbox>
                    </div>
                </div>
            </Modal>
        )
    }
}

suppressModal.propTypes = {

}

export default injectIntl(suppressModal);