import router, { asyncRoutes } from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 进度条插件
import 'nprogress/nprogress.css' // 进度条样式

const whiteList = ['/login', '/404']
/**
 * 页面发生跳转 都会走beforeEach
 * to:去哪个页面
 * from:从哪个页面过来
 * next:正常跳转 使用next不会走afterEach
 */
router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      if (!Object.keys(store.state.user.userinfo).length) {
        store.dispatch('user/getUserInfo').then(async res => {
          // 拿到用户权限 动态新增路由
          // this.$router.options.routes 只能取 创建VueRouter实例的时候传过去的路由
          // addRoutes是异步的 不会阻碍后面代码的执行
          // menus存的是用户对应的页面权限
          const { roles: { menus }} = res
          const otherRoutes = await store.dispatch('permission/filterRoutes', menus)
          router.addRoutes([
            ...otherRoutes,
            { path: '*', redirect: '/404', hidden: true }
          ])
          // 为了让用户看到对应的导航 就让用户重新再进一次页面
          // next里面加参数会直到路由添加成功后再执行
          next({
            ...to,
            replace: true
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach((to, from) => {
  NProgress.done()
})
