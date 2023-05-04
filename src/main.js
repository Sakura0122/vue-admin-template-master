import Vue from 'vue'

// 重置默认样式
import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
// 设置 element-ui 组件样式
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission'
import request from '@/utils/request' // permission control

// set ElementUI lang to EN
// Vue.use 执行后 使用Vue.component方法
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
// 构造函数的原型对象上挂载的方法和属性 都可以被构造函数对应的实例所访问
Vue.prototype.$request = request

// 固定语法 process.env
// console.log(process.env)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
