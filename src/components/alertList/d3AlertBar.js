import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'
import { event as currentEvent } from 'd3'
import styles from './index.less'
import { connect } from 'dva'
import { Spin } from 'antd';
import elementResizeEvent from 'element-resize-event';
import _ from 'lodash';
import Tip from './d3Tip';
const d3Tip = new Tip;

class AlertBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notDidRender: false,
    }
  }
  shouldComponentUpdate(nextProps, nextState) {

    return this.props.alertList.barData !== nextProps.alertList.barData || this.props.alertList.isResize !== nextProps.alertList.isResize
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.props.alertList.isResize !== nextProps.alertList.isResize) {
      if (parseInt(d3.select(".leftMask").attr('width')) == 15) return;
      clearTimeout(this.timer1);
      //推迟渲染时间防止卡断
      this.timer1 = setTimeout(() => {
        this.rangeTotDefault();
      }, 500);
    };
  }
  //右边蒙蔽和brush的定位
  rightMaskPos(chartDom) {
    const chartWidth = chartDom.clientWidth;
    const initVal = 15;
    d3.select(".rightMask")
      .attr('x', (chartWidth - initVal));
    d3.select(`.${styles.rightBrush}`)
      .attr('transform', "translate(" + (chartWidth - initVal) + ",0)")
  }
  timeChartRequest(startTime, endTime) {
    const { dispatch } = this.props;
    dispatch({
      type: 'alertList/editAlertBar',
      payload: {
        begin: +startTime,
        end: +endTime
      }
    })
  }
  //拖拽移动函数
  dragmove(direction, singleBarData) {
    //隐藏tip
    d3Tip.hide()
    currentEvent.sourceEvent.stopPropagation();
    let timeChartDom = document.getElementById('time-chart');
    let clientWidth = timeChartDom.clientWidth;
    //拖拽计算到达第几个柱子的边缘，然后改变柱状颜色
    const initVal = currentEvent.x - singleBarData.spacing / 2 - 15;
    const barIndex = Math.ceil(initVal / (singleBarData.spacing + singleBarData.width));
    d3.select('.chartBody')
      .selectAll('rect')
      .classed(styles.deselected, (d, i) => {
        if (i < (barIndex)) {
          return true;
        } else {
          return false;
        }
      });
    //拖拽随着brush变化
    if (direction == 'left') {
      let clientX = currentEvent.x <= 15 ? 15 : currentEvent.x;
      let rightMaskWidth = d3.select(".rightMask").attr('width');
      let maxWidth = clientWidth - parseInt(rightMaskWidth);
      let posX = clientX >= maxWidth ? maxWidth : clientX;
      d3.select(".leftMask")
        .attr("width", posX + 'px');
      //得到时间戳比例尺
      var timeStampSCale = d3.time.scale()
        .domain([15, timeChartDom.clientWidth - 15])
        .range([singleBarData.startTime, singleBarData.endTime]);

      //选择时间发起请求
      const startTime = new Date(timeStampSCale(posX));
      const endTime = new Date(singleBarData.endTime);
      this.requestTime = {
        startTime,
        endTime
      }

      //改变transform
      d3.select(`.${styles.leftBrush}`)
        .attr("transform", "translate(" + posX + ",0)");
    }
    // else {
    //   let clientX = currentEvent.x >= (clientWidth - 15) ? (clientWidth - 15) : currentEvent.x;
    //   let rightMaskWidth = clientWidth - clientX;
    //   let leftMaskWidth = parseInt(d3.select(".leftMask").attr('width'));
    //   let posX = clientX <= leftMaskWidth ? leftMaskWidth : clientX;
    //   d3.select(".rightMask")
    //     .attr("width", clientX <= leftMaskWidth ? (clientWidth - leftMaskWidth) : rightMaskWidth + 'px')
    //     .attr("x", posX + 'px');
    //   this.dragTransform(posX);
    // };
  }
  //拖拽改变蒙版宽度和brush的坐标
  brushDrag(direction, singleBarData) {
    const drag = d3.behavior.drag()
      .on("drag", () => {
        this.dragmove(direction, singleBarData);
      })
      .on('dragend', (d, i) => {
        this.timeChartRequest(this.requestTime.startTime, this.requestTime.endTime);
      });
    return drag;
  }
  //根据时间段来设置时间间隔和时间格式化
  SetTimeFormat(selectedTime) {
    let minGranularity,
      format;
    switch (selectedTime) {
      case 'lastOneHour':
        minGranularity = 1;
        break;
      case 'lastFourHour':
        minGranularity = 5;
        break;
      case 'lastOneDay':
        minGranularity = 30;
        break;
      case 'lastOneWeek':
        minGranularity = 3 * 60;
        format = d3.time.format('%m-%d');
        break;
      case 'lastFifteenDay':
        minGranularity = 6 * 60;
        format = d3.time.format('%m-%d');
        break;
      case 'lastOneMonth':
        minGranularity = 12 * 60;
        format = d3.time.format('%m-%d');
        break;
      default:
        break;
    }
    return {
      minGranularity,
      format
    }
  }

  chartRender(barData, selectedTime) {
    const timeChartDom = document.getElementById('time-chart');

    //右边蒙版位置设置
    this.rightMaskPos(timeChartDom);

    //过滤时间格式和时间间隔
    let minGranularity = 2,
      format = d3.time.format('%H:%M');

    minGranularity = this.SetTimeFormat(selectedTime).minGranularity;
    this.SetTimeFormat(selectedTime).format && (format = this.SetTimeFormat(selectedTime).format);
    //获取开始和结束时间
    const len = barData.length
    const startTime = barData[0]['time'],
      endtTime = barData[barData.length - 1]['time'];
    const start = new Date(startTime - minGranularity * 60000),
      end = new Date(endtTime);
    //转化为以分钟为单位来计算数据条数
    const totalMinute = (+end - (+start)) / 60000;
    const totalNumber = totalMinute / minGranularity;
    //如果条数跟时间长度得出来的条数不符合就不执行了
    if (totalNumber != len) {
      console.error('数据条数不符合规定');
      return;
    };

    //计算一个单位的宽度和间隔的宽度
    const barWidthAndSpacing = (timeChartDom.clientWidth - 30) / (totalNumber);
    const spacing = barWidthAndSpacing * .10;
    const barWidth = barWidthAndSpacing - spacing;
    //获取count的最大值
    let sortArray = _.cloneDeep(barData);
    sortArray.sort((a, b) => { return b.count - a.count });
    const maxCount = sortArray[0].count;

    //数据比例尺
    const barScale = d3.scale.linear();
    barScale.domain([0, maxCount])
      .range([0, 55]);

    //隐身bg操作
    d3.select('.chartBodyBg')
      .attr('transform', "translate(" + (15 + spacing / 2) + ",0)");
    d3.select('.chartBodyBg')
      .selectAll('rect')
      .data(barData)
      .attr('width', barWidth + 'px')
      .attr('height', (d, i) => {
        return 55
      })
      .attr('x', (d, i) => {
        return i * barWidthAndSpacing;
      })
      .on('mouseenter', (d) => {
        d3Tip.show(d, timeChartDom, minGranularity);
      })
      .on('mouseleave', () => {
        d3Tip.hide()
      })
    //d3数据的操作
    d3.select('.chartBody')
      .attr('transform', "translate(" + (15 + spacing / 2) + ",0)");
    d3.select('.chartBody')
      .selectAll('rect')
      .data(barData)
      .attr('width', barWidth + 'px')
      .attr('height', (d, i) => {
        return barScale(d.count)
      })
      .attr('x', (d, i) => {
        return i * barWidthAndSpacing;
      })
      .on('mouseenter', (d) => {
        d3Tip.show(d, timeChartDom, minGranularity);
      })
      .on('mouseleave', () => {
        d3Tip.hide()
      })
    d3.select('.chartBody')
      .selectAll('rect')
      .attr('y', 55)
      .transition()
      .duration(1000)
      .ease("bounce")
      .attr('y', (d, i) => {
        return 55 - barScale(d.count)
      })
    //时间比例尺

    let timeScale = d3.time.scale()
      .domain([start, end])
      .range([0, timeChartDom.clientWidth - 30]);
    //坐标轴的预设定
    let xAxis = d3.svg.axis()
      .scale(timeScale)
      .tickFormat(format)
      .orient("bottom");
    //引用
    d3.select('.xaxis')
      .attr('transform', "translate(" + (15 + spacing / 2) + ",0)")
      .call(xAxis)
    //移除最后一个坐标
    d3.select('.xaxis .domain').remove();

    //绑定拖拽事件
    const singleBarData = {
      width: barWidth,
      spacing: spacing,
      startTime: start,
      endTime: end
    }
    d3.select(`.${styles.leftBrush}`)
      .call(this.brushDrag('left', singleBarData));
  }
  //窗口变化时间恢复到开始点
  revertToInitialValue() {
    if (parseInt(d3.select(".leftMask").attr('width')) == 15) return;
    const initVal = 15;
    d3.select(".leftMask")
      .attr('width', initVal);
    d3.select(`.${styles.leftBrush}`)
      .attr('transform', "translate(" + initVal + ",0)");
    d3.select('.chartBody')
      .selectAll('rect')
      .classed(styles.deselected, (d, i) => {
        return false;
      });
  }
  //联动列表数据
  rangeTotDefault() {
    const { alertList, selectedTime } = this.props;
    let barData = alertList.barData,
      minGranularity = 2,
      format = d3.time.format('%H:%M');

    //过滤时间格式和时间间隔
    minGranularity = this.SetTimeFormat(selectedTime).minGranularity;
    this.SetTimeFormat(selectedTime).format && (format = this.SetTimeFormat(selectedTime).format);

    const len = barData.length
    const startTime = barData[0]['time'],
      endtTime = barData[barData.length - 1]['time'];
    const start = new Date(startTime),
      end = new Date(endtTime + minGranularity * 60000);
    //请求
    this.timeChartRequest(start, end);
  }
  elementResize(timeChartDom) {
    //窗口改变左边刷子恢复原来位置并根据范围刷新数据
    window.onresize = () => {
      if (parseInt(d3.select(".leftMask").attr('width')) == 15) return;      
      clearTimeout(this.timer2);
      //防止渲染多次
      this.timer2 = setTimeout(() => {
        this.rangeTotDefault();
      }, 200);
    }
    //监听dom节点
    elementResizeEvent(timeChartDom, () => {
      clearTimeout(this.timer);
      //防止渲染多次
      this.timer = setTimeout(() => {
        const { alertList, selectedTime } = this.props;
        const barData = alertList.barData;
        this.revertToInitialValue(true);
        barData[0] && selectedTime && this.chartRender(barData, selectedTime);
      }, 200)
    });
  }
  componentDidMount() {
    this.setState({
      notDidRender: true
    });
    const timeChartDom = document.getElementById('time-chart');
    //等待列表
    this.timer = setTimeout(() => {
      const { alertList, selectedTime } = this.props;
      const barData = alertList.barData;
      barData[0] && selectedTime && this.chartRender(barData, selectedTime);
    },1000)
    
    //随着盒子的变化
    this.elementResize(timeChartDom);
  }

  componentDidUpdate() {
    const { alertList, selectedTime } = this.props;
    const barData = alertList.barData;
    //如果didMount没有执行的时候
    if (this.state.notDidRender) {
      this.revertToInitialValue(true);
      barData[0] && selectedTime && this.chartRender(barData, selectedTime);
    } else {
      const timeChartDom = document.getElementById('time-chart');
      this.elementResize(timeChartDom);
    }
  }
  render() {
    const { alertList } = this.props;
    const len = alertList.barData.length;
    return (
      <div id="time-chart" className={styles.timeChart}>
        {
          len && !this.props.alertList.isLoading ?
            <div>
              <svg className={styles.chartWrapper} width="100%" height="55">
                <defs>
                  <clipPath id="maskClip">
                    <rect className="leftMask" x="0" y="0" width="15" height="55" ></rect>
                    <rect className="rightMask" x="0" y="0" width="15" height="55" ></rect>
                  </clipPath>
                </defs>
                <g className="chartBodyBg" >
                  {_.map(alertList.barData || [], (d, i) => {
                    return <rect key={i} x={(i + 1) * 40} y="0" width="20" height="50" className={styles.histogramBg} />
                  })}
                </g>
                <g className="chartBody" >
                  {_.map(alertList.barData || [], (d, i) => {
                    return <rect key={i} x={(i + 1) * 40} y="0" width="20" height="0" className={styles.histogram} />
                  })}
                </g>

                <g>
                  <rect x="0" y="0" width="100%" height="55" clipPath="url(#maskClip)" className={styles.mask} />
                </g>

                <g className={styles.brush}>
                  <g className={styles.leftBrush} transform="translate(15,0)">
                    <rect x="-6" y="0" width="6" height="55" style={{ "fill": "transparent", "stroke": "transparent" }} />
                    <path d="M-0.5,18.333333333333332A6,6 0 0 0 -6.5,24.333333333333332V30.666666666666664A6,6 0 0 0 -0.5,36.666666666666664ZM-2.5,26.333333333333332V28.666666666666664M-4.5,26.333333333333332V28.666666666666664" />
                  </g>
                  <g className={styles.rightBrush} transform="translate(15,0)">
                    <rect x="0" y="0" width="6" height="55" style={{ "fill": "transparent", "stroke": "transparent" }} />
                    <path d="M0.5,18.333333333333332A6,6 0 0 1 6.5,24.333333333333332V30.666666666666664A6,6 0 0 1 0.5,36.666666666666664ZM2.5,26.333333333333332V28.666666666666664M4.5,26.333333333333332V28.666666666666664" />
                  </g>
                </g>
              </svg>
              <svg className={styles.chartAxisWrapper} width="100%" height="25">
                <g className="xaxis" transform="translate(0,0)"></g>
              </svg>
              <div className={styles.xAxisLine}></div>
            </div>
            :
            <Spin spinning={true} tip="加载中..." className={styles.chartLoading}>
              <div className={styles.noTimeAlert}></div>
            </Spin>
        }
      </div>
    )
  }

}
export default connect(state => {
  return {
    alertList: state.alertList,
    selectedTime: state.alertManage.selectedTime
  }
})(AlertBar)
