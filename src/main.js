import 'babel-polyfill'// 兼容ie 9 10 11的必须的依赖

import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import './assets/styles/admin/element-theme/index.css'
import './assets/styles/admin/element-theme/ali-fonts/iconfont.css'
import './assets/styles/vendor/animate.css'// css3动画类库
import App from './App'
import router from './router'
import store from './store'

import '@/permission' // permission control

Vue.use(ElementUI, {})

Vue.config.productionTip = false

// 全局过滤器
Vue.filter('keepTwoNum', function(value) {
  value = Number(value)
  return value.toFixed(2)
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
