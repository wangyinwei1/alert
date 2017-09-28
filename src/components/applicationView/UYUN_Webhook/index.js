import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Button, Input, InputNumber, Form, Radio, Collapse } from 'antd'
import { classnames, isJSON, isEmpty } from '../../../utils'
import constants from '../../../utils/constants'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import LeaveNotifyModal from '../../common/leaveNotifyModal/index'
import VarsSelect from '../../varsSelect'

const Item = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Panel = Collapse.Panel;
const { TextArea } = Input;

const webhookApi = constants['webhook_api'];

const zhankaiClass = classnames(
  'iconfont',
  'icon-xialasanjiao'
)

const shouqiClass = classnames(
  'iconfont',
  'icon-xialasanjiao-copy'
)

const webhookClass = classnames(
  'icon',
  'iconfont',
  'icon-webhook'
)

const itemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const localeMessage = defineMessages({
  webhook_headerTitle: {
    id: 'alertApplication.webhook.headerTitle',
    defaultMessage: '把Alert告警以Web Hook方式实时分享到第三方系统'
  },
  webhook_step2: {
    id: 'alertApplication.webhook.step2',
    defaultMessage: '配置Alert'
  },
  webhook_step2Message: {
    id: 'alertApplication.webhook.step2Message',
    defaultMessage: '把从第三方系统获取的Web Hook接口地址粘贴到文本框'
  },
  url: {
    id: 'alertApplication.webhook.url',
    defaultMessage: 'URL'
  },
  httpMethod: {
    id: 'alertApplication.webhook.httpMethod',
    defaultMessage: 'HTTP方法'
  },
  overTime: {
    id: 'alertApplication.webhook.overTime',
    defaultMessage: '超时时间'
  },
  overTimeMsg: {
    id: 'alertApplication.webhook.overTimeMsg',
    defaultMessage: '若告警发送失败,在{ overTime }s内再次尝试发送，如果仍不成功即放弃发送'
  },
  seniorModule: {
    id: 'alertApplication.webhook.seniorModule',
    defaultMessage: '高级模式'
  },
  fieldMap: {
    id: 'alertApplication.webhook.fieldMap',
    defaultMessage: '字段映射'
  },
  fieldMapMsg: {
    id: 'alertApplication.webhook.fieldMapMsg',
    defaultMessage: '允许开发人员制定Web Hook服务与Alert数据字典的对应关系。Alert数据字段说明请参照{ API }'
  },
  webhookApi: {
    id: 'alertApplication.webhook.webhookApi',
    defaultMessage: 'API文档'
  },
  returnKey: {
    id: 'alertApplication.webhook.returnKey',
    defaultMessage: '返回码key'
  },
  returnSuccessMark: {
    id: 'alertApplication.webhook.returnSuccessMark',
    defaultMessage: '返回成功标识'
  },
  returnKeyMsg: {
    id: 'alertApplication.webhook.returnKeyMsg',
    defaultMessage: '根据http应答内容判断告警是否发送成功，若不清楚请查阅Web Hook接口文档.'
  },
  returnBlankMsg: {
    id: 'alertApplication.webhook.returnBlankMsg',
    defaultMessage: '如果没有配置返回码，系统默认以http是否返回200来判断是否发送成功.'
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
  },
  requireWarn: {
    id: 'form.requireWarn',
    defaultMessage: '请输入{ content }'
  },
  JSONRequire: {
    id: 'form.JSONRequire',
    defaultMessage: '请输入JSON格式的字符串'
  }
})

const fieldMapMsgPlaceholder = window.fieldMapMsgPlaceholder;

class UYUN_Webhook extends Component {

  constructor(props) {
    super(props);
    this.state = { isShowSenior: false }
  }

  toggleSeniorVisible() {
    this.setState({ isShowSenior: !this.state.isShowSenior });
  }

  render() {

    const { builtIn, appkey, url, form, onOk, keyCreate, intl: { formatMessage } } = this.props;

    const { getFieldDecorator, getFieldsValue } = form;

    const { isShowSenior } = this.state;

    return (
      <div className={styles.detailView}>
        <div className={styles.viewHeader}>
          <i className={classnames(webhookClass, styles.headerIcon)}></i>
          <span className={styles.headerContent}>
            <p className={styles.headerName}>Web Hook</p>
            <p>{formatMessage({ ...localeMessage['webhook_headerTitle'] })}</p>
          </span>
        </div>
        <div className={styles.viewContent}>
          <div className={styles.step1} style={{ height: 130 }}>
            <span className={styles.step1Icon}></span>
            <p className={styles.stepName}>{formatMessage({ ...localeMessage['displayName'] })}</p>
            <p className={styles.stepMessage}>{formatMessage({ ...localeMessage['displayName_message'] })}</p>
            <Form className={styles.viewForm}>
              <Item>
                {getFieldDecorator('displayName', {
                  rules: [
                    { required: true, message: formatMessage({ ...localeMessage['displayName_placeholder'] }) }
                  ]
                })(
                  <Input className={styles.nameInput} placeholder={formatMessage({ ...localeMessage['displayName_placeholder'] })}></Input>
                  )}
              </Item>
            </Form>
            {
              appkey === undefined ?
                <Button type="primary" className={styles.createBtn} onClick={() => { keyCreate(form) }}>{formatMessage({ ...localeMessage['appKey'] })}</Button>
                :
                <p className={styles.readOnly}>{`App key：${appkey}`}</p>
            }
          </div>

          <div className={styles.step2}>
            <span className={styles.step2Icon}></span>
            <p className={styles.stepName}>{formatMessage({ ...localeMessage['webhook_step2'] })}</p>
            <p className={styles.stepMessage}>{formatMessage({ ...localeMessage['webhook_step2Message'] })}</p>
            <Form className={styles.secondForm}>
              <Item
                required
                {...itemLayout}
                label={formatMessage({ ...localeMessage['url'] })}
              >
                {getFieldDecorator('url', {
                  initialValue: '',
                  rules: [
                    { required: true, message: formatMessage({ ...localeMessage['requireWarn'] }, { content: formatMessage({ ...localeMessage['url'] }) }) },
                  ]
                })(
                  <Input />
                  )}
              </Item>
              <Item
                {...itemLayout}
                label={formatMessage({ ...localeMessage['httpMethod'] })}
              >
                {getFieldDecorator('requestMode', {
                  initialValue: 'GET',

                })(
                  <RadioGroup>
                    <RadioButton value='GET'>GET</RadioButton>
                    <RadioButton value='POST'>POST</RadioButton>
                  </RadioGroup>
                  )}
              </Item>
              <Item
                required
                {...itemLayout}
                label={formatMessage({ ...localeMessage['overTime'] })}
              >
                {getFieldDecorator('timeout', {
                  initialValue: '30',
                  rules: [
                    { required: true, message: formatMessage({ ...localeMessage['requireWarn'] }, { content: formatMessage({ ...localeMessage['overTime'] }) }) },
                  ]
                })(
                  <InputNumber
                    min={0}
                    max={30}
                    step={ 5 }
                    readOnly
                    upHandler={<div className={ styles.num } onClick={() => { const { timeout } = form.getFieldsValue(); timeout < 30 && form.setFieldsValue({ timeout: parseInt(timeout) + 5 }) }}><i className={shouqiClass}/></div>}
                    downHandler={<div className={ styles.num } onClick={() => { const { timeout } = form.getFieldsValue(); timeout > 0 && form.setFieldsValue({ timeout: parseInt(timeout) - 5 }) }}><i className={zhankaiClass}/></div>}
                  />
                  )}
                <span className={styles.overTimeMsg}><FormattedMessage { ...localeMessage['overTimeMsg']} values={{ overTime: form.getFieldsValue().timeout }} /></span>
              </Item>
              <Item
                {...itemLayout}
                colon={false}
                label={<a onClick={() => this.toggleSeniorVisible()}>{formatMessage({ ...localeMessage['seniorModule'] })}<i className={isShowSenior ? shouqiClass : zhankaiClass} /></a>}
              >

              </Item>
              <div className={isShowSenior ? styles.showItem : styles.hideItem}>
                <Item
                  {...itemLayout}
                  colon={false}
                  label={
                    <div>
                      <div style={{ lineHeight: 1 }}>{ formatMessage({ ...localeMessage['fieldMap'] }) }：</div>
                      <VarsSelect insertVar={(item) => {
                        const oldValue = form.getFieldValue("fieldMap") || '';
                        form.setFieldsValue({ fieldMap: oldValue + '${' + item + '}' })
                      }}/>
                    </div>
                  }
                >
                  {getFieldDecorator('fieldMap', {
                    rules: [
                      {
                        validator: function (rule, value, cb) {
                          if (isEmpty(value) || isJSON(value)) {
                            cb();
                          } else {
                            cb(false);
                          }

                        },
                        message: formatMessage({ ...localeMessage['JSONRequire'] })
                      }
                    ]
                  })(
                    <Input.TextArea className={ styles.mapFieldTextarea } placeholder={fieldMapMsgPlaceholder} />
                    )}
                  <span className={styles.fieldMapMsg}><FormattedMessage { ...localeMessage['fieldMapMsg']} values={{ API: <a target="_blank" href={webhookApi}>{formatMessage({ ...localeMessage['webhookApi'] })}</a> }} /></span>
                </Item>
                <Item
                  {...itemLayout}
                  label={formatMessage({ ...localeMessage['returnKey'] })}
                >
                  {getFieldDecorator('replyKey', {
                  })(
                    <Input className={styles.shortInput} />
                    )}
                </Item>
                <Item
                  {...itemLayout}
                  label={formatMessage({ ...localeMessage['returnSuccessMark'] })}
                >
                  {getFieldDecorator('replySuccess', {
                  })(
                    <Input className={styles.shortInput} />
                    )}
                  <span className={styles.msg}>
                    <FormattedMessage { ...localeMessage['returnKeyMsg']} />
                    <br />
                    <span className={styles.returnBlankMsg}><FormattedMessage { ...localeMessage['returnBlankMsg']} /></span>
                  </span>
                </Item>
              </div>
            </Form>
          </div>

          <span className={styles.stepLine} style={{ height: 180 }}></span>
          <Button type="primary" htmlType='submit' onClick={(e) => { onOk(e, form) }}>{formatMessage({ ...localeMessage['save'] })}</Button>
        </div>
      </div>
    )
  }
}

export default injectIntl(Form.create({
  mapPropsToFields: (props) => {
    const webHook = props.webHook || {};
    const webHookValues = {}

    Object.keys(webHook).forEach(key => {
      webHookValues[key] = { value:  webHook[key]}
    })

    return {
      displayName: {
        value: props.displayName || undefined,
      },
      ...webHookValues
    }
  }
})(UYUN_Webhook))