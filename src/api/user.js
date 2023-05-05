import request from '@/utils/request'

/**
 * 登录
 * @param data 登录所需参数
 * @return {Promise}
 */
export const loginApi = (data) => {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @return {Promise}
 */
export const getUserInfoApi = () => {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/**
 * 获取用户基本信息
 * @param id 用户id
 * @return {*}
 */
export const getBaseUserInfoApi = (id) => {
  return request({
    url: `/sys/user/${id}`
  })
}
