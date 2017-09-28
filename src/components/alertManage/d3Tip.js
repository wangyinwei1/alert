import offset from 'document-offset'
import * as d3 from 'd3'
import {event as currentEvent} from 'd3'
import {assign} from 'es6-object-assign';
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
  format = d => d.value;

  /**
   * Initialize with the given `config`.
   */

  constructor(config) {
    assign(this, config)
  }

  /**
   * Show tip with the given data.
   */

  show = (d, stateMessage) => {
    const t = currentEvent.target
    const tb = t.getBoundingClientRect()
    const o = offset(t)
    let temp = d.name;
    if (d.parent.path == 'severity' || d.parent.path == 'status') {
      temp = window[`_${d.parent.path}`][d.name]
    }
    
    
    const val = d.noData ? 0 : (d.fixedValue ? d.trueVal : d.value)
    el.innerHTML = `${__alert_appLocaleData.messages['treemap.tagsGroup']}: ` + temp + '<br/>' + `${stateMessage}: ` + val 
    el.style.display = 'block'
    el.style.top = o.top - 55 + 'px'
    el.style.left = o.left + 'px'
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