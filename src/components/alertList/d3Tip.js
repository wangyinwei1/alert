import offset from 'document-offset'
import * as d3 from 'd3'
import { event as currentEvent } from 'd3'
import { assign } from 'es6-object-assign';
/**
 * Tip element.
 */

const el = document.createElement('div')

el.id = 'tip'
el.style.display = 'none'
document.body.appendChild(el)

/**
 * Tip.
 */

export default class Tip {

  // format function
  format = d => { return d.value };

  /**
   * Initialize with the given `config`.
   */

  constructor(config) {
    assign(this, config)
  }

  /**
   * Show tip with the given data.
   */

  show = (d, chartDom, minGranularity) => {
    const timeRange = minGranularity * 60000
    const t = currentEvent.target
    const tb = t.getBoundingClientRect()
    const chartClientDom = chartDom.getBoundingClientRect();
    const o = offset(t);
    const dis = o.left - offset(chartDom).left;//盒子内部的X偏移量
    const format = d3.time.format("%Y/%m/%d %H:%M");//时间格式化
    const val = d.count ? d.count : '-';
    const endTime = d.time ? new Date(d.time) : new Date();
    const time = new Date(+endTime - timeRange);
    el.innerHTML = `告警时间: &nbsp;` + format(time) + ' - ' + format(endTime) + '<br/>' + `告警数量: &nbsp;` + val;
    el.style.display = 'block';
    el.style.top = o.top - 55 - (55 - tb.height) + 'px';//让固定在最顶部，高度相同
    el.style.left = (chartClientDom.width - dis < 275 ? (o.left - 275 + tb.width) : o.left) + 'px';//判断右边位置不够，向左显示
    el.classList.add('alertShow')
  }

  /**
   * Hide tip.
   */

  hide = () => {
    el.classList.remove('alertShow')
    el.style.display = 'none'
  }
}