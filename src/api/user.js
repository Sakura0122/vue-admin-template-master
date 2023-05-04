import request from '@/utils/request'

/**
 * 登录
 * @param data 登录所需参数
 * @return {*}
 */
export const loginApi = (data) => {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
