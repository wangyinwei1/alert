import Mock from 'mockjs'
import __DataRule from './mockJson.js'
/**
 * Intercept fidld
 */
const __Intercept = 'api/v2'

/**
 * data rule (Alert 的接口的key和service统一, 其他产品的一律使用全URL作为key)
 * DTD: https://github.com/nuysoft/Mock/wiki/Syntax-Specification
 * DPD: https://github.com/nuysoft/Mock/wiki/Mock.Random
 */

/**
 * Intercept URL
 */
function interceptURL(url) {
  if (url.indexOf(__Intercept) > -1) {
    return url.slice(url.indexOf(__Intercept) + __Intercept.length, url.length);
  }
  return url;
}

/**
 * Set up timeout (current)
 * @param {Object} config
 */
function setup(config = { timeout: '200-600' }) {
  Mock.setup({
    ...config
  })
}

/**
 * valid response data
 * @param {Object} data  response data
 * @param {Function} callback
 */
function valid(url, data, cb = () => { }) {
  data = true
  let warning = undefined;
  let key = interceptURL(url);
  if (Mock) {
    Mock.valid(__DataRule[key], data)
    warning = `${key} Interface response data error to template rule`;
  }
  cb(warning, data)
}

/**
 * invoke mock request
 * @param {string} url    request url (toLowerCase)
 * @param {string} method request method
 * @param {Function} callback
 */
function invoke(url, rule, method = 'get', cb = () => { }) {
  let key = interceptURL(url);
  if (Mock) {
    if(rule.template && typeof rule.template == 'function') {
      rule = rule.template;
    }
    Mock.mock(url, method, rule);
  } else {
    throw new Error('Invalid Mock by mockjs')
  }
}

module.exports = {
  setup,
  invoke,
  valid,
  rule: __DataRule
}
