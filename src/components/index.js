// import Vue from 'vue'
import PageTools from '@/components/PageTools/index.vue'
import uploadExcel from '@/components/UploadExcel/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
import ScreenFull from '@/components/ScreenFull/index.vue'
import Lang from '@/components/Lang/index.vue'
// Vue.component('PageTools', PageTools)

// 使用Vue.use注册插件的方式来全局注册组件
// 插件可以是一个对象 也可以是一个方法
// 当插件是对象的时候 必须提供一个install方法
// 当插件是一个函数的时候 这个函数会被当做install方法调用

// export default {
//   install(Vue) {
//     Vue.component('PageTools', PageTools)
//   }
// }

export default function(Vue) {
  Vue.component('PageTools', PageTools)
  Vue.component('uploadExcel', uploadExcel)
  Vue.component('ImageUpload', ImageUpload)
  Vue.component('ScreenFull', ScreenFull)
  Vue.component('Lang', Lang)
}
