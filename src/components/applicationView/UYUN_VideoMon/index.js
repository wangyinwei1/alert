import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Button, Input, Form} from 'antd'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import LeaveNotifyModal from '../../common/leaveNotifyModal/index'

const Item = Form.Item;
// 判断是否需要弹出离开确认框
let isNeedLeaveCheck = true;
const UYUN_VideoMON = (props) => {

    const { builtIn, appkey, url, form, onOk, keyCreate, intl: {formatMessage}} = props;

    const { getFieldDecorator, getFieldsValue } = form;

    const videoMonClass = classnames(
        'icon',
        'iconfont',
        'icon-videomon'
    )

    const localeMessage = defineMessages({
        videoMon_headerTitle: {
            id: 'alertApplication.videoMon.headerTitle',
            defaultMessage: '使用Web Hook接入快速VideoMon告警'
        },
        videoMon_step2: {
            id: 'alertApplication.videoMon.step2',
            defaultMessage: '向接口发送数据'
        },
        videoMon_step2Message: {
            id: 'alertApplication.videoMon.step2Message',
            defaultMessage: '请复制以下URL至您的应用中'
        },
        displayName: {
            id: 'alertApplication.displayName',
            defaultMessage: '设定显示名'
        },
        displayName_message: {
            id: 'alertApplication.displayName.message',
            defaultMessage: '设定一个显示名用于标识应用'
        },
        displayName_placeholder: {
            id: 'alertApplication.displayName.placeholder',
            defaultMessage: '请输入应用名称'
        },
        appKey: {
            id: 'alertApplication.appKey',
            defaultMessage: '点击生成AppKey'
        },
        save: {
            id: 'alertApplication.save',
            defaultMessage: '保存'
        }
    })

    return (
        <div className={styles.detailView}>
            <div className={styles.viewHeader}>
                <i className={classnames(videoMonClass, styles.headerIcon)}></i>
                <span className={styles.headerContent}>
                    <p className={styles.headerName}>VideoMon</p>
                    <p>{formatMessage({...localeMessage['videoMon_headerTitle']})}</p>
                </span>
            </div>
            <div className={styles.viewContent}>
                <div className={styles.step1}>
                    <span className={styles.step1Icon}></span>
                    <p className={styles.stepName}>{formatMessage({...localeMessage['displayName']})}</p>
                    <p className={styles.stepMessage}>{formatMessage({...localeMessage['displayName_message']})}</p>
                    <Form className={styles.viewForm}>
                        <Item>
                            {getFieldDecorator('displayName', {
                                rules: [
                                    { required: true, message: formatMessage({...localeMessage['displayName_placeholder']})}
                                ]
                            })(
                                <Input className={styles.nameInput} placeholder={formatMessage({...localeMessage['displayName_placeholder']})}></Input>
                            )}
                        </Item>
                    </Form>
                    {
                        appkey === undefined ?
                        <Button type="primary" className={styles.createBtn} onClick={() => {keyCreate(form)}}>{formatMessage({...localeMessage['appKey']})}</Button>
                        :
                        <p className={styles.readOnly}>{`App key：${appkey}`}</p>
                    }
                </div>
                {
                    builtIn !== undefined && builtIn == 1 ?
                    <div className={styles.step2}>
                        <span className={styles.step2Icon}></span>
                        <p className={styles.stepName}>{formatMessage({...localeMessage['videoMon_step2']})}</p>
                        <p className={styles.stepMessage}>{formatMessage({...localeMessage['videoMon_step2Message']})}</p>
                        <p className={styles.stepExample}>{appkey !== undefined ? url + `&app_key=${appkey}` : url}</p>
                    </div>
                    : undefined
                }
                { builtIn !== undefined && builtIn == 1 ? <span className={styles.stepLine}></span> : undefined }
                <Button type="primary" htmlType='submit' onClick={(e) => {onOk(e, form)}}>{formatMessage({...localeMessage['save']})}</Button>
            </div>
        </div>
    )
}

export default injectIntl(Form.create({
    mapPropsToFields: (props) => {
        return {
            displayName: {
                value: props.displayName || undefined
            }
        }
    }
})(UYUN_VideoMON))