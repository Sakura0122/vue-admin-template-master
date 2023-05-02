// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
//
// NProgress.configure({ showSpinner: false }) // NProgress Configuration
//
// // 白名单:不需要登录校验的路由 可以配置在白名单
// // to 跳转到哪个路由
// // from 从哪个路由跳转过来
// // next 放行
// const whiteList = ['/login'] // no redirect whitelist
//
// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()
//
//   // 设置文档标题
//   document.title = getPageTitle(to.meta.title)
//
//   // 获取token 判断当前登录者有没有token
//   const hasToken = getToken()
//
//   // 有token
//   if (hasToken) {
//     if (to.path === '/login') {
//       // 如果访问登录页 跳转到首页
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         // 有token 有用户信息 正常跳转
//         next()
//       } else {
//         // 有token 无用户信息 (token过期)
//         try {
//           // 调用接口获取用户信息
//           await store.dispatch('user/getInfo')
//           // 获取到用户信息 正常跳转
//           next()
//         } catch (error) {
//           // 获取用户信息失败 清除token
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     // 没有token的情况
//
//     if (whiteList.indexOf(to.path) !== -1) {
//       // 访问的地址在白名单里 正常访问
//       next()
//     } else {
//       // 重定向到登录页
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })
//
// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
