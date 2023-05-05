import { getBaseUserInfoApi, getUserInfoApi, loginApi } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'

const state = {
  token: getToken() || '',
  userinfo: {}
}

const getters = {}

const mutations = {
  setToken(state, newToken) {
    state.token = newToken
    setToken(newToken)
  },
  clearToken(state) {
    state.token = ''
    removeToken()
  },
  setUserInfo(state, newUserInfo) {
    state.userinfo = newUserInfo
  },
  clearUserInfo(state) {
    state.userinfo = {}
  }
}

const actions = {
  async login(context, data) {
    const res = await loginApi(data)
    const token = res.data
    context.commit('setToken', token)
    return res
  },
  async getUserInfo(context) {
    const { data } = await getUserInfoApi()
    const { data: data2 } = await getBaseUserInfoApi(data.userId)
    const baseData = { ...data, ...data2 }
    context.commit('setUserInfo', baseData)
    return baseData
  },
  // 在真实开发场景 退出需要调用后端接口 同步前后端token信息
  logout(context) {
    context.commit('clearToken')
    context.commit('clearUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
