import fetch from 'dva/fetch'
import constants from './constants'
import $ from 'jquery'
let Promise = require('es6-promise').Promise;
let Mock = require('./mock.js');
const ROOT_PATH = constants.api_root;

(function () {
  if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
    window.__DEV_MOCK__ = true; // dev环境默认开启
  }
})()

/**
 * Set URL before ajax
 */
function isApiUrl(url) {
  if (url.indexOf(ROOT_PATH) !== -1) {
    return url;
  }
  if (url.indexOf('chatops') > -1) {
    // 这边是直接对接chatOps接口
    return url;
  }
  //请求本地资源文件时以"#localAsset#"开头
  if (url.substring(0, 12) === '#localAsset#') {
    return url.substring(12)
  }
  return `${ROOT_PATH}${url}`;
}

/**
 * Use Mock Date ?
 */
function mockStart(use) {
  window.__DEV_MOCK__ = use;
}

/**
 * Requests URL, Response Mock data
 */
function mockAjax(url, options, rule) {
  return new Promise(function (resolve, reject) {
    try {
      const configs = {
        url,
        method: options.method.toLowerCase() || 'get',
        dataType: 'json'
      }
      /* Mock */
      Mock.invoke(configs.url, rule, configs.method)
      // before ajax you need use mock
      $.ajax(configs).done(data => {
        if(typeof data.template !== 'undefined') {
          data = data.template;
        }
        resolve({
          result: true,
          data: data
        })
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

function ajax(url, options) {
  return new Promise(function (resolve, reject) {
    const configs = {
      url,
      cache: false,
      method: options.method || 'GET',
      data: options.body,
      headers: {
        ...options.headers,
      },
      xhrFields: {
        withCredentials: false
      },
      // timeout: 10000
    }
    $.ajax(configs).done(data => {
      // use mock valid
      // Mock.valid(configs.url, data, (warning, data) => {
      //   if (warning) console.warn(warning)
      //   resolve({
      //     result: true,
      //     data: data
      //   })
      // })
      resolve({
        result: true,
        data: data
      })
    }).fail((xhr, textStatus, error) => {
      const serverName = url.split('/')[3];
      const serverNameList = [ // 若增加产品，在此数组里增加相应名称
        'ChatOps'
      ];
      if (xhr.status == 401) {
        location.href = location.origin + '/tenant/#/login_admin/'
      } else if (xhr.status == 502) {
        for (let i = serverNameList.length - 1; i >= 0; i -= 1) {
          if (serverNameList[i].toLowerCase() === serverName) {
            resolve({
              result: false,
              message: serverNameList[i] + window.__alert_appLocaleData.messages['server.notStarted']
            })
            break;
          }
        }
      } else {
        resolve({
          result: false,
          message: xhr.responseJSON !== undefined && xhr.responseJSON.message !== undefined ? xhr.responseJSON.message : 'unknown.Error'
        })
      }
    })
  })
}

export default async function request(url, options) {
  // or stop mock
  //mockStart(false)
  if (Mock && window.__DEV_MOCK__) {
    // 匹配数据生成规则
    // 需要用规则中的正则进行二次比较
    let isMock = false;
    let rule = undefined
    if (Mock.rule[url]) {
      isMock = true;
      rule = Mock.rule[url];
    } else if(typeof url === 'string') {
      Object.keys(Mock.rule).forEach((ruleKey) => {
        const tempRule = Mock.rule[ruleKey];
        if (!isMock && tempRule.regex && url.match(tempRule.regex) ) {
          isMock = true;
          rule = tempRule.template || tempRule ;
        }
      })
    }

    if (isMock) {
      const response = await mockAjax(isApiUrl(url), options, rule)
      return response
    } else {
      const response = await ajax(isApiUrl(url), options)
      return response
    }
  } else {
    const response = await ajax(isApiUrl(url), options)
    return response
  }
}
