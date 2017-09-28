import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'
import crossfilter from 'crossfilter'
import dc from 'dc'
import styles from './index.less'
import { connect } from 'dva'
import { Spin } from 'antd';

let d3_date = Date;
function d3_time_interval(local, step, number) {

  function round(date) {
    var d0 = local(date), d1 = offset(d0, 1);
    return date - d0 < d1 - date ? d0 : d1;
  }

  function ceil(date) {
    step(date = local(new d3_date(date - 1)), 1);
    return date;
  }

  function offset(date, k) {
    step(date = new d3_date(+date), k);
    return date;
  }

  function range(t0, t1, dt) {
    var time = ceil(t0), times = [];
    if (dt > 1) {
      while (time < t1) {
        if (!(number(time) % dt)) times.push(new Date(+time));
        step(time, 1);
      }
    } else {
      while (time < t1) times.push(new Date(+time)), step(time, 1);
    }
    return times;
  }

  function range_utc(t0, t1, dt) {
    try {
      d3_date = d3_date_utc;
      var utc = new d3_date_utc();
      utc._ = t0;
      return range(utc, t1, dt);
    } finally {
      d3_date = Date;
    }
  }

  local.floor = local;
  local.round = round;
  local.ceil = ceil;
  local.offset = offset;
  local.range = range;

  var utc = local.utc = d3_time_interval_utc(local);
  utc.floor = utc;
  utc.round = d3_time_interval_utc(round);
  utc.ceil = d3_time_interval_utc(ceil);
  utc.offset = d3_time_interval_utc(offset);
  utc.range = range_utc;

  return local;
}
function d3_time_interval_utc(method) {
  return function(date, k) {
    try {
      d3_date = d3_date_utc;
      var utc = new d3_date_utc();
      utc._ = date;
      return method(utc, k)._;
    } finally {
      d3_date = Date;
    }
  };
}
function n_minutes_interval(nmins) {
    var denom = 6e4*nmins;
    return d3_time_interval(function(date) {
      return new d3_date(Math.floor(date / denom) * denom);
    }, function(date, offset) {
      date.setTime(date.getTime() + Math.floor(offset) * denom); // DST breaks setMinutes
    }, function(date) {
      return date.getMinutes();
    });
}


class AlertBar extends Component{
  constructor(props){
    super(props)

  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props.alertList.barData !== nextProps.alertList.barData || this.props.alertList.isResize !== nextProps.alertList.isResize
  }
  renderBar(barData, selectedTime){
    const { dispatch } = this.props
    let timer = null,
        minGranularity = 2,
        format = d3.time.format('%H:%M');

    switch(selectedTime) {
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
    const startTime = barData[0]['time']
    const endtTime = barData[barData.length - 1]['time']
    const start = new Date(startTime)
    const end = new Date(endtTime)

    // Create the crossfilter for the relevant dimensions and groups.
    const min5 = n_minutes_interval(minGranularity);
    const alertList = crossfilter(barData)
    const clientWidth = document.documentElement.clientWidth || document.body.clientWidth

    const leftMenuWidth = this.props.alertList.isResize ? 50 : 160 //是否折叠
    const width = clientWidth - leftMenuWidth - 50;

    const height = 80
    const margins = {top: 0, right: 20, bottom: 25, left: 15}
    const dim = alertList.dimension(function(d) { return d.time; })
    const grp = dim.group(min5).reduceSum(function(d) { return d.count; })
    this.chart = dc.barChart(".dc-chart")
                   .width(width)
                  .height(height)
                  .margins(margins)
                  .dimension(dim)
                  .group(grp)
                  .round(dc.round.floor)
                  .renderHorizontalGridLines(true)
                  .x(d3.time.scale().domain([start, end]))
                  .xUnits(min5.range)
                  .filter([start, end])

    this.chart.xAxis().tickSize(0).tickPadding(10).tickFormat(format)
    // this.chart.selectAll('g.tick text')
    //           .call(function (text, width) {
    //             text.each(function() {

    //               var text = d3.select(this);
    //               console.log(text.text())
    //               var words = text.text().split(/\s/).reverse(),
    //                   y = text.attr("y"),
    //                   dy = parseFloat(text.attr("dy")),
    //                   tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    //               console.log(words)
    //               words.forEach( (word, index) => {
    //                 console.log(word)
    //                 if(index === 0) tspan.text(word)
    //                 if(index > 0) text.append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em").text(word);
    //               })
    //             })
    //           })
    this.chart.render()
      // brush拖动选择过滤
    this.chart.on('filtered', function(d, f){

      clearTimeout(timer)

      timer = setTimeout( () => {
        dispatch({
          type: 'alertList/editAlertBar',
          payload: {
            begin: f[0],
            end: f[1]
          }
        })
      }, 1000)
    })


  }
  componentDidMount(){
    // this.chart = dc.barChart(".dc-chart")
    const { alertList, selectedTime } = this.props
    const { dispatch }  = this.props

    const len = alertList.barData.length

    if(len > 0) {
        this.renderBar(alertList.barData, selectedTime)
    }


      // alertList.remove()
      // alertList.add(genData(new Date(2013, 10, 1, 3),new Date(2013, 10, 1, 7)))
      // chart.x(d3.time.scale().domain([new Date(2013, 10, 1, 3),new Date(2013, 10, 1, 7)]))
      //      .filter([new Date(2013, 10, 1, 4), new Date(2013, 10, 1, 7)])
      // dc.redrawAll()

  }
  componentDidUpdate(){
    const { alertList, selectedTime } = this.props
    this.renderBar(alertList.barData, selectedTime)

  }
  render(){

    const {
      barData
    } = this.props.alertList

    const len = barData.length

    return (
      <div>
        { len && !this.props.alertList.isLoading ?
        <div className={styles.timeAlert} style={{ height: '80px'}}>
          <div id="date-chart" className="dc-chart"></div>
          <div className={styles.xAxisLine} style={{ bottom: '22px'}}></div>
        </div>
        :
        <Spin spinning={this.props.alertList.isLoading}>
          <div className={styles.noTimeAlert}></div>
        </Spin>
        }
      </div>

    )
  }

}
export default connect( state => {
  return {
    alertList: state.alertList,
    selectedTime: state.alertManage.selectedTime
  }
})(AlertBar)
