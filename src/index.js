import 'babel-polyfill'
import dva from 'dva'
import React, { PropTypes, Component } from 'react'
import { Router } from 'dva/router'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import appLocaleZhData from 'react-intl/locale-data/zh'
import antdEn from 'antd/lib/locale-provider/en_US'
import appLocaleEnData from 'react-intl/locale-data/en'
import { addLocaleData, IntlProvider } from 'react-intl'
import { request } from './utils'
import constants from './utils/constants'
import Intl from 'intl'

global.Intl = Intl;


async function getMessages(lang) {
  let messages;
  if (typeof lang === 'string' && lang.indexOf('en') > -1) {
    if (process.env.NODE_ENV === 'development') {
      messages = await request('#localAsset#../locales/en.json', { method: 'GET' });
    } else {
      messages = await request('#localAsset#./locales/en.json', { method: 'GET' })
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      messages = await request('#localAsset#../locales/zh.json', { method: 'GET' });
    }
    else {
      messages = await request('#localAsset#./locales/zh.json', { method: 'GET' })
    }
  }
  if (messages.result) {
    return messages.data;
  } else {
    console.error('can\'t resovle local asset file')
  }
}

function _readCookie(name) {
  var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
  result && (result = result[1]);
  return result;
}

async function setLang(lang) {
  lang = lang || _readCookie('language') || 'zh_CN';
  const messages = await getMessages(lang)
  let appLocaleData
  switch (lang) {
    case 'en_US':
      appLocaleData = {
        messages,
        antd: antdEn,
        locale: 'en-us',
        data: appLocaleEnData,
      }
      // 内置属性
      window._severity = {
        "0": "Recovery",
        "1": "Information",
        "2": "Warning",
        "3": "Critical"
      }
      window._status = {
        "0": "New",
        "40": "Acknowledged",
        "150": "Assigned",
        "190": "Resolved",
        "255": "Closed"
      }
      window.fieldMapMsgPlaceholder = '' +
        '//eg.\n' +
        '{\n' +
        '  "state":"${status}",\n' +
        '  "time":"${occurTime}",\n' +
        '  "name": "${name}",\n' +
        '  "resName":"${entityName}",\n' +
        '  "ip":"${entityAddr}",\n' +
        '  "desc":"${entityName} : ${description}"\n' +
        '}'
      break
    default:
      appLocaleData = {
        messages,
        antd: null,
        locale: 'zh-cn',
        data: appLocaleZhData,
      }
      // 内置属性
      window._severity = {
        "0": "恢复",
        "1": "提醒",
        "2": "警告",
        "3": "紧急"
      }
      window._status = {
        "0": "未接手",
        "40": "已确认",
        "150": "处理中",
        "190": "已解决",
        "255": "已关闭"
      }

      window.fieldMapMsgPlaceholder = '' +
        '//示例\n' +
        '{\n' +
        '  "state":"${status}",\n' +
        '  "time":"${occurTime}",\n' +
        '  "name": "${name}",\n' +
        '  "resName":"${entityName}",\n' +
        '  "ip":"${entityAddr}",\n' +
        '  "desc":"${entityName},发生告警，描述:${description}"\n' +
        '}'

      break

  }
  window.__alert_appLocaleData = appLocaleData
  return appLocaleData
}

async function init() {
  const appLocale = await setLang();
  addLocaleData(appLocale.data);
  window.__Alert_WebNotification = null; // setInterval with webnotification
  // 1. Initialize
  const app = dva();
  const root = document.querySelector('#root')
  // 2. Model
  app.model(require('./models/app'))
  app.model(require('./models/alertManage'))
  // 告警列表
  app.model(require('./models/alertTagsSet'))
  app.model(require('./models/alertOperation'))
  app.model(require('./models/tagsListFilter'))
  // app.model(require('./models/alertDetail'))

  app.model(require('./models/alertList'))
  app.model(require('./models/alertListTable'))
  app.model(require('./models/alertListLevels'))
  // 告警查询
  app.model(require('./models/alertQuery'))
  app.model(require('./models/alertDetail'))
  // 告警配置
  app.model(require('./models/alertConfig'))
  app.model(require('./models/snmpTrapRules'))
  // 关联规则
  app.model(require('./models/alertAssociationRules'))
  //动作管理
  app.model(require('./models/actionManagement/alertMotionManagement'))
  app.model(require('./models/actionManagement/addSuccessModal'))
  app.model(require('./models/actionManagement/addActionModal'))
  app.model(require('./models/actionManagement/importActionModal'))
  app.model(require('./models/actionManagement/successModal'))
  app.model(require('./models/actionManagement/alertConfirm'))

  // 值班管理
  app.model(require('./models/watchManage'))
  // 可视化分析
  app.model(require('./models/visualAnalyze'))
  // 告警发生历史
  app.model(require('./models/alertOrigin'))
  // 告警查询条件
  app.model(require("./models/alertQueryFilter"))
  // 变量字段
  app.model(require("./models/vars"))
  // 左侧视图菜单
  app.model(require("./models/alertView"))
  // 3. Router
  // app.model({
  //   namespace: 'app1',

  //   state: {},

  //   effects: {

  //   },

  //   reducers: {

  //   },
  // })
  // class App1 extends Component {
  //   render() {
  //     return <div>111{this.props.children}</div>
  //   }
  // }

  // class App2 extends Component {
  //   render() {
  //     return <div>222</div>
  //   }
  // }

  // app.router(({ history, app }) => {

  //   const routes = [
  //     {
  //       path: '/',
  //       component: App1,
  //       getIndexRoute(nextState, cb) {
  //         require.ensure([], require => {
  //           cb(null, { component: App2 })
  //         }, 'app1')
  //       },
  //     }
  //   ]

  //   return <Router history={history} routes={routes} />
  // })

  // 3. Router
  app.router(require('./router'))
  // 4. Start
  const App = app.start();

  ReactDOM.render(
    <LocaleProvider locale={appLocale.antd}>
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <App />
      </IntlProvider>
    </LocaleProvider>,
    root);
}

init();