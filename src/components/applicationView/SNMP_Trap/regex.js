import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col, Input, Table, Popover, Radio } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const RadioGroup = Radio.Group;
const Regex = ({changeValue, toggle16Radix, validateRadix, saveRegex, clear, type, hex, intl: {formatMessage}}) => {

  const itemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
  }

  const localeMessage = defineMessages({
      regex_type: {
        id: 'modal.trap.regex.type',
        defaultMessage: '类型'
      },
      regex_type_string: {
        id: 'modal.trap.regex.string',
        defaultMessage: '普通字符串'
      },
      regex_type_radix: {
        id: 'modal.trap.regex.radix',
        defaultMessage: '16进制字符串'
      },
      regex_type_integer: {
        id: 'modal.trap.regex.integer',
        defaultMessage: '整型'
      },
      regex_type_ip: {
        id: 'modal.trap.regex.ip',
        defaultMessage: 'IP'
      },
      regex_toggle: {
        id: 'modal.trap.regex.toggle',
        defaultMessage: '转换'
      },
      regex_afterToggle: {
        id: 'modal.trap.regex.afterToggle',
        defaultMessage: '转换后'
      },
      regex_expression: {
        id: 'modal.trap.regex.expression',
        defaultMessage: '正则表达式'
      },
      regex_validate: {
        id: 'modal.trap.regex.validate',
        defaultMessage: '验证'
      },
      regex_result: {
        id: 'modal.trap.regex.result',
        defaultMessage: '结果'
      },
      regex_validate_error: {
        id: 'modal.trap.regex.error',
        defaultMessage: '未匹配到结果'
      },
      regex_noValidate: {
        id: 'modal.trap.regex.noResult',
        defaultMessage: '暂无结果'
      },
      regex_validate_ok: {
        id: 'modal.trap.regex.ok',
        defaultMessage: '完成'
      },
      regex_validate_goBack: {
        id: 'modal.trap.regex.goBack',
        defaultMessage: '返回'
      }
  })
  return (
    <div>
      <Item
        {...itemLayout}
        label={formatMessage({ ...localeMessage['regex_type'] })}
      >
        <RadioGroup onChange={(e) => {
          changeValue(type, e.target.value, 'hexType')
        } } defaultValue={1} value={hex.hexType}>
          <Radio value={1}>{formatMessage({ ...localeMessage['regex_type_string'] })}</Radio>
          <Radio value={2}>{formatMessage({ ...localeMessage['regex_type_radix'] })}</Radio>
          <Radio value={3}>{formatMessage({ ...localeMessage['regex_type_integer'] })}</Radio>
          <Radio value={4}>{formatMessage({ ...localeMessage['regex_type_ip'] })}</Radio>
        </RadioGroup>
      </Item>
      <Row>
        <Item
          {...itemLayout}
          label={'Binding_value'}
        >
            <Input onBlur={ (e) => {
              changeValue(type, e.target.value, 'hexValue')
            }}></Input>
        </Item>
        {
          hex.hexType === 2 &&
          <Button className={classnames(styles.ghostBtn, styles.btnAbsoulte)} type='ghost' onClick={ () => {
            if (hex.hexValue !== undefined && hex.hexValue !== '') {
              toggle16Radix(hex.hexType, hex.hexValue)
            }
          }}>{formatMessage({ ...localeMessage['regex_toggle'] })}</Button>
        }
      </Row>
      {
        hex.hexType === 2 &&
        <Item
          {...itemLayout}
          label={formatMessage({ ...localeMessage['regex_afterToggle'] })}
        >
            <Input value={hex.value} onChange={ (e) => {
              changeValue(type, e.target.value, 'value')
            }}></Input>
        </Item>
      }
      <Row>
        <Item
          {...itemLayout}
          label={formatMessage({ ...localeMessage['regex_expression'] })}
        >
            <Input onBlur={ (e) => {
              changeValue(type, e.target.value, 'regex')
            }}></Input>
        </Item>
        <Button className={classnames(styles.ghostBtn, styles.btnAbsoulte)} type='ghost' onClick={ () => {
          switch (hex.hexType) {
            case 2:
              if (hex.value !== undefined && hex.value !== '' && hex.regex !== undefined && hex.regex !== '') {
                  validateRadix(hex.value, hex.regex)
              }
              break;
            default:
              if (hex.hexValue !== undefined && hex.hexValue !== '' && hex.regex !== undefined && hex.regex !== '') {
                  validateRadix(hex.hexValue, hex.regex)
              }
              break;
          }
        }}>{formatMessage({ ...localeMessage['regex_validate'] })}</Button>
      </Row>
      <Item
        {...itemLayout}
        label={formatMessage({ ...localeMessage['regex_result'] })}
      >
        <p className={styles.result}>{typeof hex.result !== 'undefined' ? hex.result !== '' ? hex.result : formatMessage({ ...localeMessage['regex_validate_error'] }) : formatMessage({ ...localeMessage['regex_noValidate'] }) }</p>
      </Item>
      <Item
        wrapperCol={{ span: 12, offset: 6}}
      >
        <Button className={styles.ghostBtn} type='ghost' onClick={ () => {
          // 保存regex（16进制）到列表页面
          saveRegex(type)
        }}>{formatMessage({ ...localeMessage['regex_validate_ok'] })}</Button>
        <Button className={classnames(styles.ghostBtn, styles.btnSpace)} type='ghost' onClick={ () => {
          // 清除数据，并返回列表
          clear(type)
        }}>{formatMessage({ ...localeMessage['regex_validate_goBack'] })}</Button>
      </Item>
    </div>
  )
}

export default injectIntl(Regex)
