import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: constantRoutes
}

const getters = {}

const mutations = {
  setRoutes(state, otherRoutes) {
    state.routes = [...constantRoutes, ...otherRoutes, { path: '*', redirect: '/404', hidden: true }]
  }
}

const actions = {
  async filterRoutes(context, menus) {
    const otherRoutes = asyncRoutes.filter(item => menus.includes(item.children[0].name))
    context.commit('setRoutes', otherRoutes)
    return otherRoutes
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
