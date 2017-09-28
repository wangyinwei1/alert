import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { Select, Radio, Tooltip} from 'antd'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const formatMessages = defineMessages({
    oneHour: {
      id: 'alertManage.oneHour',
      defaultMessage: '最近 1 小时',
    },
    fourHours: {
      id: 'alertManage.fourHours',
      defaultMessage: '最近 4 小时'
    },
    oneDay: {
      id: 'alertManage.oneDay',
      defaultMessage: '最近 24 小时'
    },
    sevenDays: {
      id: 'alertManage.sevenDays',
      defaultMessage: '最近 7 天'
    },
    fifteenDays: {
      id: 'alertManage.fifteenDays',
      defaultMessage: '最近 15 天'
    },
    thirtyDays: {
      id: 'alertManage.thirtyDays',
      defaultMessage: '最近 30 天'
    },
    newIncident: {
      id: 'alertManage.newIncident',
      defaultMessage: '待处理告警'
    },
    assignedIncident: {
      id: 'alertManage.assignedIncident',
      defaultMessage: '处理中告警'
    },
    resolvedIncident: {
      id: 'alertManage.resolvedIncident',
      defaultMessage: '已解决告警'
    },
    exceptCloseIncident: {
      id: 'alertManage.exceptCloseIncident',
      defaultMessage: '所有未关闭'
    }
})

const filterHead = ({queryByTime, queryByStatus, style = undefined, defaultTime, defaultStatus, intl}) => {
    const {formatMessage} = intl;
    return (
        <div style={style} id="__alert_filterRadioGroup" >
            <Select defaultValue={defaultTime} getPopupContainer={() =>document.getElementById("content")} style={{ width: 150 }} onChange={ (value) => {
                queryByTime(value)
            }}>
                <Option value='lastOneHour' >{formatMessage(formatMessages['oneHour'])}</Option>
                <Option value='lastFourHour'>{formatMessage(formatMessages['fourHours'])}</Option>
                <Option value='lastOneDay'>{formatMessage(formatMessages['oneDay'])}</Option>
                <Option value='lastOneWeek'>{formatMessage(formatMessages['sevenDays'])}</Option>
                <Option value='lastFifteenDay'>{formatMessage(formatMessages['fifteenDays'])}</Option>
                <Option value='lastOneMonth'>{formatMessage(formatMessages['thirtyDays'])}</Option>
            </Select>
            <RadioGroup className={styles.myRadioGroup} defaultValue={defaultStatus} onChange={ (e) => {
                queryByStatus(e.target.value)
            }}>
                <Radio value='NEW'><FormattedMessage {...formatMessages['newIncident']}/></Radio>
                <Radio value='PROGRESSING'><FormattedMessage {...formatMessages['assignedIncident']}/></Radio>
                <Radio value='RESOLVED'><FormattedMessage {...formatMessages['resolvedIncident']}/></Radio>
                <Radio value='EXCEPTCLOSE'><FormattedMessage {...formatMessages['exceptCloseIncident']}/></Radio>
            </RadioGroup>
        </div>
    )
}

filterHead.defaultProps = {
    style: undefined,
    queryByTime: () => {},
    queryByStatus: () => {},
    defaultTime: 'lastOneHour',
    defaultStatus: 'NEW'
}

filterHead.propTypes = {
    queryByTime: React.PropTypes.func.isRequired,
    queryByStatus: React.PropTypes.func.isRequired,
    defaultTime: React.PropTypes.string.isRequired,
    defaultStatus: React.PropTypes.string.isRequired,
}

export default injectIntl(filterHead)