import React from 'react'
import {Router} from 'dva/router'
import App from './routes/app'

export default function({history, app}) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], require => {
          cb(null, {component: require('./routes/alertManage')})
        }, 'alertManage')
      },
      childRoutes: [
        {
          path: 'alertManage',
          name: 'alertManage',
          getComponent (nextState, cb) {
            cb(null, require('./routes/alertManage'))
            require.ensure([], require => {
              let isLoadModal = false
              app._models.forEach(function(ele) {
                if(ele.namespace == 'alertManage'){
                  isLoadModal = true
                }

              });
              if(!isLoadModal){
               app.model(require('./models/alertManage'))
              }
            },'alertManage')
          }
        }, {
          path: 'alertManage/alertList',
          name: 'alertList',
          getComponent(nextState, cb) {
            nextState.params.isNeedContent = false;
            require.ensure([], require => {
              cb(null, require('./routes/alertList'))
            }, 'alertList')
          },
          onLeave(){
            try{
              // 根据key记录columns
              let key = localStorage.getItem('__visual_group') || '';
              // 每次离开记录从热图那边的轨迹
              let gr1 = JSON.parse(localStorage.getItem('__alert_visualAnalyze_gr1')) || [];
              // 用户路径记录
              let userRecordKey
              let gr1keys = gr1.map((item) => {
                return item.key
              })
              if (gr1keys.length === 1) { // 注意，现阶段只有在标签过滤只有一个标签时才记录用户行为
                userRecordKey = gr1keys.join()
                const userRecordVal = {
                  gr2key: localStorage.getItem('__alert_visualAnalyze_gr2'),
                  gr3key: localStorage.getItem('__alert_visualAnalyze_gr3'),
                  gr4key: localStorage.getItem('__alert_visualAnalyze_gr4')
                }
                localStorage.setItem(userRecordKey, JSON.stringify(userRecordVal))
              }

              localStorage.setItem(`__alert_${key}_colums`, localStorage.getItem('__alert_list_userColumns'))

            }catch(e){
              throw new Error(e)
            }
          }

        },{
          path: 'alertManage/:id',
          name: 'alertView',
          getComponent (nextState, cb) {
            cb(null, require('./routes/alertManage'))
            require.ensure([], require => {
              let isLoadModal = false
              app._models.forEach(function(ele) {
                if(ele.namespace == 'alertManage'){
                  isLoadModal = true
                }

              });
              if(!isLoadModal){
               app.model(require('./models/alertManage'))
              }
            },'alertManage')
          }
        }, {
          path: 'alertQuery',
          name: 'alertQuery',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertQuery'))
            }, 'alertQuery')
          }
        }, {
          path: 'alertConfig',
          name: 'alertConfig',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertConfig'))
            }, 'alertConfig')
          }
        },
        {
          path: 'alertConfig/alertAssociationRules',
          name: 'alertAssociationRules',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertAssociationRules'))
            }, 'alertAssociationRules')
          }
        },
        { // 临时添加路由，规则编辑页面
          path: 'alertConfig/alertAssociationRules/ruleEditor',
          name: 'ruleEditor',
          childRoutes: [
            {
              path: 'add',
              name: 'addRuleEditor',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  cb(null, require('./routes/ruleEditor'))
                }, 'ruleEditor')
              }
            },
            {
              path: 'edit/:ruleId',
              name: 'editRuleEditor',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  cb(null, require('./routes/ruleEditor'))
                }, 'ruleEditor')
              }
            },
          ]
        },
        {
          path: 'alertConfig/alertApplication',
          name: 'alertApplication',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertApplication'))
            }, 'alertApplication')
          }
        },
        {
          path: 'alertConfig/alertMotionManagement',
          name: 'alertMotionManagement',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertMotionManagement'))
            }, 'alertMotionManagement')
          }
        },
        {
          path: 'alertConfig/alertApplication/:type',
          name: 'alertApplication',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertApplication'))
            }, 'alertApplication')
          }
        },
        {
          path: 'alertConfig/alertApplication/applicationView',
          name: 'applicationView',
          childRoutes: [
            {
              path: 'add/:typeId',
              name: 'addApplicationView',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  cb(null, require('./components/applicationView/add'))
                }, 'addApplicationView')
              }
            }, {
              path: 'edit/:appId',
              name: 'editApplicationView',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  cb(null, require('./components/applicationView/edit'))
                }, 'editApplicationView')
              }
            }
          ]
        }, {
          path: 'watchManage',
          name: 'watchManage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/watchManage'))
            }, 'alertConfig')
          }
        }
      ]
    },
    // -----------外调页面---------------------------
    {
      path: '/export',
      name: 'exportPage',
      childRoutes: [
        {
          path: 'close/:id',
          name: 'export_close',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              let isLoadModal = false
              app._models.forEach(function(ele) {
                if(ele.namespace == 'alertExport'){
                  isLoadModal = true
                }
              });
              if(!isLoadModal){
               app.model(require('./models/alertExport'))
              }
              cb(null, require('./routes/export/close'))
            }, 'export_close')
          }
        },
        {
          path: 'resolve/:id',
          name: 'export_resolve',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              let isLoadModal = false
              app._models.forEach(function(ele) {
                if(ele.namespace == 'alertExport'){
                  isLoadModal = true
                }
              });
              if(!isLoadModal){
               app.model(require('./models/alertExport'))
              }
              cb(null, require('./routes/export/resolve'))
            }, 'export_resolve')
          }
        },
        {
          path: 'dispatch/:id',
          name: 'export_dispatch',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              let isLoadModal = false
              app._models.forEach(function(ele) {
                if(ele.namespace == 'alertExport'){

                  isLoadModal = true
                }
              });
              if(!isLoadModal){
               app.model(require('./models/alertExport'))
              }
              cb(null, require('./routes/export/dispatch'))
            }, 'export_dispatch')
          }
        },
        {
          path: 'viewDetail/:id',
          name: 'export_viewDetail',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/export/viewDetail'))
            }, 'export_viewDetail')
          }
        }
      ]
    }
  ]

  return <Router history={history} routes={routes}/>
}
