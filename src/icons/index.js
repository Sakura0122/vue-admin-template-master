import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 全局注册组件(一次注册，任意.vue文件使用)
Vue.component('svg-icon', SvgIcon)

// 自动化导入模块
/**
 * 参数一：要读取的文件路径
 * 参数二：是否遍历子目录(false不要)
 * 参数三：符合正则的才会导入进来
 * 返回值：
 *  ƒ webpackContext(req) {
 * 	  var id = webpackContextResolve(req);
 * 	  return __webpack_require__(id);
 * }
 */
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  // requireContext变量值 就是req
  // requireContext.keys() -> ['./dashboard.svg',...] 自动化导入文件的名字
  // 每个要引入的文件名传入req 进行webpack引入
  return requireContext.keys().map(requireContext)
}
requireAll(req)
