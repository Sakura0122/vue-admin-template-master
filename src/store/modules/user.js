import { loginApi } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'

const state = {
  token: getToken() || ''
}

const getters = {}

const mutations = {
  setToken(state, newToken) {
    state.token = newToken
    setToken(newToken)
  }
}

const actions = {
  login(context, data) {
    return new Promise((resolve, reject) => {
      loginApi(data).then(res => {
        const token = res.data
        context.commit('setToken', token)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
