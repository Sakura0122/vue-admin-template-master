import request from '@/utils/request'

/**
 * 获取员工简单列表
 * @return {*}
 */
export const getSimpleUserList = () => {
  return request({
    url: '/sys/user/simple'
  })
}
