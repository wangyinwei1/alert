import React, {
  PropTypes,
  Component
} from 'react';
import { default as cls } from 'classnames';
import { Slider } from 'antd';

import styles from './timeSlider.less';

class TimeSlider extends Component {
  render() {
    const { timeStart, timeEnd, changeTime, target } = this.props;
    return (
      <div className={styles.timeWrap}>
        <div className={styles.timeStart}>
          <p className={styles.title}>{window.__alert_appLocaleData.messages['ruleEditor.startTime']}：</p>
          <Slider onChange={changeTime.bind(this, 'timeStart', 'hours')} value={timeStart.hours} className={cls(styles.hours, `timeMarks${timeStart.hours}`)} tipFormatter={null} max={23} />
          <Slider onChange={changeTime.bind(this, 'timeStart', 'mins')} value={timeStart.mins} className={cls(styles.mins, `timeMarks${timeStart.mins}`)} tipFormatter={null} max={59} />
        </div>
        <div className={styles.timeEnd} style={{display: `${target === 0 ? 'block' : 'none'}`}}>
          <p className={styles.title}>{window.__alert_appLocaleData.messages['ruleEditor.endTime']}：</p>
          <Slider onChange={changeTime.bind(this, 'timeEnd', 'hours')} value={timeEnd.hours} className={cls(styles.hours, `timeMarks${timeEnd.hours}`)} tipFormatter={null} max={23} />
          <Slider onChange={changeTime.bind(this, 'timeEnd', 'mins')} value={timeEnd.mins} className={cls(styles.mins, `timeMarks${timeEnd.mins}`)} tipFormatter={null} max={59} />
        </div>
      </div>
    );
  }
}

TimeSlider.defaultProps = {
  timeStart: {
    hours: 0,
    mins: 0
  },
  timeEnd: {
    hours: 0,
    mins: 0
  },
  changeTime: () => { throw new Error('changeTime方法未定义') }
};

TimeSlider.propsTypes = {
  timeStart: PropTypes.shape({
    hours: PropTypes.number.isRequired,
    mins: PropTypes.number.isRequired
  }),
  timeEnd: PropTypes.shape({
    hours: PropTypes.number.isRequired,
    mins: PropTypes.number.isRequired
  }),
  changeTime: PropTypes.func.isRequired
};

export default TimeSlider;


