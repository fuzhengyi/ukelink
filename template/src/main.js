{{#if_eq build "standalone"}}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
{{/if_eq}}
import Vue from 'vue'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import FastClick from 'fastclick'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import VueRouter from 'vue-router'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import App from './App'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import store from './store'
import i18n from './lang/all'
import 'lib-flexible'
import router from './router'
import config from './config/config'
import getConfig from './data/getConfig'
import getData from './data'
import {LoadingPlugin,ToastPlugin} from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.prototype.$ajax = getData


getConfig.getConfig()
         .then(res=>{
           Object.assign(config,res);
           Vue.prototype.apiList = config;//将config配置参数挂载到Vue原型上
         })
FastClick.attach(document.body){{#if_eq lintConfig "airbnb"}};{{/if_eq}}

Vue.config.productionTip = false{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

/* eslint-disable no-new */
new Vue({
  router,
  store:store,
  i18n:i18n,
  render: h => h(App){{#if_eq lintConfig "airbnb"}},{{/if_eq}}
}).$mount('#app-box'){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
