import React, { PropTypes, Component } from 'react'
import { default as cls } from 'classnames'
import { FormattedMessage, defineMessages } from 'react-intl';
import { Form, Input, Radio, Select, Popover, Checkbox } from 'antd';
import PureRender from '../../../utils/PureRender.js'
import _ from 'lodash'

import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import '../../../../node_modules/rc-calendar/assets/index.css';

import TimeSlider from './timeSlider';
import styles from './index.less'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const WeekArray = [
  { label: window.__alert_appLocaleData.messages['ruleEditor.mon'], value: '0' },
  { label: window.__alert_appLocaleData.messages['ruleEditor.tue'], value: '1' },
  { label: window.__alert_appLocaleData.messages['ruleEditor.wed'], value: '2' },
  { label: window.__alert_appLocaleData.messages['ruleEditor.thu'], value: '3' },
  { label: window.__alert_appLocaleData.messages['ruleEditor.fri'], value: '4' },
  { label: window.__alert_appLocaleData.messages['ruleEditor.sat'], value: '5' },
  { label: window.__alert_appLocaleData.messages['ruleEditor.sun'], value: '6' }
];

const MonthArray = _.range(31).map(item => {
    return {
        label: item + 1,
        value: item.toString()
    };
});

// locale Messages
const formatMessages = defineMessages({
  anyTime: {
      id: 'ruleEditor.anyTime',
      defaultMessage: '任意时间均执行'
  },
  peroid: {
      id: 'ruleEditor.peroid',
      defaultMessage: '周期性执行'
  },
  peroid1: {
      id: 'ruleEditor.peroid1',
      defaultMessage: '周期性时间点执行'
  },
  fixedTime: {
      id: 'ruleEditor.fixedTime',
      defaultMessage: '固定时间段执行'
  },
  fixedTime1: {
      id: 'ruleEditor.fixedTime1',
      defaultMessage: '固定时间点执行'
  }
})

// layout
const itemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 4 }
};
const desLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 }
};


@PureRender
class TimeCycle extends Component {
  constructor(props) {
    super(props)
    this.renderTimeCycle = this.renderTimeCycle.bind(this)
  }

  renderTimeCycle(time, timeStart, timeEnd, target, moment) {
    // 时间选择器选择之后的文字信息反馈，用'、'号隔开，同类信息用','隔开
    let cycleDay = '';
    switch (time.timeCycle) {
        case 1:
            let _timeCycleWeekArr = time.timeCycleWeek.map(item => {
                return String(item).replace(/\d/g, matchs => {
                    return WeekArray[matchs].label;
                });
            });
            _.remove(_timeCycleWeekArr, item => item === '');
            cycleDay = `${_timeCycleWeekArr}${_timeCycleWeekArr.length === 0 ? '' : '、'}`;
            break;
        case 2:
            let _timeCycleMonthArr = time.timeCycleMonth.map(item => {
                if (item !== '') {
                    return (parseInt(item) + 1).toString();
                } else {
                    return '';
                }
            });
            _.remove(_timeCycleMonthArr, item => item === '');
            cycleDay = `${_timeCycleMonthArr}${_timeCycleMonthArr.length === 0 ? '' : '、'}`;
            break;
        default:
            cycleDay = '';
    }
    this.cycleTimeStart = `${timeStart.hours}:${timeStart.mins}`;
    this.cycleTimeEnd = `${timeEnd.hours}:${timeEnd.mins}`;

    const cycleTimeString = (() => {
        if (time.timeCycle >= 0) {
            return target === 0
                ? `${cycleDay}${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")} ~ ${moment(this.cycleTimeEnd, 'H:mm').format("HH:mm")}`
                : `${cycleDay}${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")}`;
        } else {
            return '';
        }
    })();
    const dayTimeString = (() => {
        if (time.dayStart && time.dayEnd) {
            return target === 0
                ? `${moment(time.dayStart).format('YYYY-MM-DD')} ~ ${moment(time.dayEnd).format('YYYY-MM-DD')}、${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")} ~ ${moment(this.cycleTimeEnd, 'H:mm').format("HH:mm")}`
                : `${moment(time.dayStart).format('YYYY-MM-DD')} ~ ${moment(time.dayEnd).format('YYYY-MM-DD')}、${moment(this.cycleTimeStart, 'H:mm').format("HH:mm")}`;
        } else {
            return '';
        }
    })();
    return { cycleTimeString, dayTimeString }
  }

  // 更改time类型
  changeField(event) {
    const _time = _.cloneDeep(this.props.time)
    _time.timeCondition = event.target.value
    this.props.commonSetState('time', _time)
  }

  // 更改时间周期类型
  changeTimeCycleType(type) {
    const _time = _.cloneDeep(this.props.time)
    _time.timeCycle = type

    this.props.commonSetState('time', _time)
  }

  // 更改时间周期
  changeTimeCycle(name, options) {
    const _time = _.cloneDeep(this.props.time)
    _.remove(options, item => item === '')
    _time[name] = _.uniq(options).sort((pre, next) => pre - next)

    this.props.commonSetState('time', _time)
  }

  // 更改执行时间
  changeTime(name, type, value) {
    const _time = _.cloneDeep(this.props[name]);
    _time[type] = value

    if (name === 'timeStart') {
      this.props.commonSetState('timeStart', _time)
    } else {
      this.props.commonSetState('timeEnd', _time)
    }
  }

  // 更改固定时间段, momentArray 为一个数组，包含起始时间和结束时间
  changeDate(momentArray) {
    if (momentArray.length >= 2) {
      const _time = _.cloneDeep(this.props.time);
      for (let i = 0, len = momentArray.length; i < len; i += 1) {
          let _day = momentArray[i].format('YYYY-MM-DDTHH:mmZ'); // 当前日历组件选择的时间
          i === 0
            ? _time['dayStart'] = _day
            : _time['dayEnd'] = _day;
      }
      this.props.commonSetState('time', _time)
    }
  }

  render() {
    const { time, timeStart, timeEnd, target, moment } = this.props

    // 获取TimeCycle Input显示内容
    const { cycleTimeString, dayTimeString } = this.renderTimeCycle(time, timeStart, timeEnd, target, moment)

    return (
      <FormItem
          {...desLayout}
          label={window.__alert_appLocaleData.messages['ruleEditor.excuteTime']}
      >
        <RadioGroup
            onChange={this.changeField.bind(this)}
            value={time.timeCondition}
        >
          {
              target === 0 &&
              <Radio value={0}><FormattedMessage {...formatMessages['anyTime']} /></Radio>
          }
          <Radio value={2}>
              {
                  target === 0
                      ? <FormattedMessage {...formatMessages['peroid']} />
                      : <FormattedMessage {...formatMessages['peroid1']} />
              }
          </Radio>
          <Radio value={1}>
              {
                  target === 0
                      ? <FormattedMessage {...formatMessages['fixedTime']} />
                      : <FormattedMessage {...formatMessages['fixedTime1']} />
              }
          </Radio>
        </RadioGroup>
        {
          time.timeCondition === 2 &&
          <div className={styles.pickTimeWrap}>
              <Popover
                  trigger="click"
                  placement="bottomLeft"
                  overlayClassName="pickTime"
                  content={(
                      <div className={styles.timeCycle}>
                          <div className={styles.timeCycleHd}>
                              <span className={cls({
                                  'active': time.timeCycle === 0
                              })} onClick={this.changeTimeCycleType.bind(this, 0)}>{window.__alert_appLocaleData.messages['ruleEditor.daily']}</span>
                              <span className={cls({
                                  'active': time.timeCycle === 1
                              })} onClick={this.changeTimeCycleType.bind(this, 1)}>{window.__alert_appLocaleData.messages['ruleEditor.weekly']}</span>
                              <span className={cls({
                                  'active': time.timeCycle === 2
                              })} onClick={this.changeTimeCycleType.bind(this, 2)}>{window.__alert_appLocaleData.messages['ruleEditor.monthly']}</span>
                          </div>
                          <div className={cls(styles.timeCycleBd, {
                              [styles.hidden]: time.timeCycle && time.timeCycle.length === 0
                          })}>
                              {
                                  time.timeCycle !== 0 &&
                                  <p>{window.__alert_appLocaleData.messages['ruleEditor.excutionCycle']}：</p>
                              }
                              { // 每周
                                  time.timeCycle === 1 &&
                                  <CheckboxGroup options={WeekArray} defaultValue={time.timeCycleWeek} className="weekCycle" onChange={this.changeTimeCycle.bind(this, 'timeCycleWeek')} />
                              }
                              { // 每月
                                  time.timeCycle === 2 &&
                                  <CheckboxGroup options={MonthArray} defaultValue={time.timeCycleMonth} onChange={this.changeTimeCycle.bind(this, 'timeCycleMonth')} />
                              }
                              <TimeSlider target={this.props.target} timeStart={timeStart} timeEnd={timeEnd} changeTime={this.changeTime.bind(this)} />
                          </div>
                      </div>
                  )}
              >
                  <Input placeholder={window.__alert_appLocaleData.messages['ruleEditor.schedule']} readOnly value={cycleTimeString} className={styles.selectTime} />
              </Popover>
          </div>
        }
        {
          time.timeCondition === 1 &&
          <div className={styles.pickTimeWrap}>
              <Popover
                  trigger="click"
                  placement="bottomLeft"
                  overlayClassName="pickTime"
                  content={(
                      <div className={styles.timeCycle}>
                          <RangeCalendar
                            // defaultSelectedValue={[moment(time.dayStart), moment(time.dayEnd)]}
                            onChange={this.changeDate.bind(this)}
                            dateInputPlaceholder={[window.__alert_appLocaleData.messages['ruleEditor.startDate'], window.__alert_appLocaleData.messages['ruleEditor.endDate']]}
                            className={styles.calendar}
                            renderFooter={() => {
                                return (
                                    <div className={styles.timeCycleBd}>
                                        <TimeSlider target={this.props.target} timeStart={timeStart} timeEnd={timeEnd} changeTime={this.changeTime.bind(this)} />
                                    </div>
                                );
                            }}
                          />
                      </div>
                  )}
              >
                  <Input placeholder={window.__alert_appLocaleData.messages['ruleEditor.schedule']} readOnly value={dayTimeString} className={styles.selectTime} />
              </Popover>
          </div>
        }
      </FormItem>
    )
  }
}

export default TimeCycle