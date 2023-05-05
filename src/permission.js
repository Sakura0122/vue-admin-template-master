import router from '@/router'
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
        store.dispatch('user/getUserInfo').then(res => {
          next()
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
