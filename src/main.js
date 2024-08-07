import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss'

import App from '@/App'
import store from '@/store'
import router from '@/router'

import '@/icons'
import '@/permission'
import '@/global'

Vue.use(ElementUI, { locale })

/* https://cn.vuejs.org/v2/api/index.html#productionTip */
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: (h) => h(App),
})
