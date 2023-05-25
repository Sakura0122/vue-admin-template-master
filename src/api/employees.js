import request from '@/utils/request'

/**
 * 获取员工简单列表
 * @return {*}
 */
export const getSimpleUserListApi = () => {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工列表
 * @param page 当前页
 * @param size 页容量
 * @return {*}
 */
export const getUserListApi = (page, size) => {
  return request({
    url: '/sys/user',
    params: {
      page,
      size
    }
  })
}

/**
 * 删除员工
 * @param id 员工id
 * @return {*}
 */
export const delEmployeeApi = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/**
 * 添加员工
 * @param from 添加员工的数据
 * @return {*}
 */
export const addEmployeeApi = (from) => {
  return request({
    url: '/sys/user',
    method: 'post',
    data: from
  })
}

/**
 * 导入员工
 * @param data
 * @return {*}
 */
export function batchAddEmployeeApi(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * 保存员工的基本信息
 * @param data
 * @return {*}
 */
export function saveUserDetailByIdApi(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 读取用户详情的基础信息
 * @param id
 * @return {*}
 */
export function getPersonalDetailApi(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/**
 * 更新用户详情的基础信息
 * @param data
 * @return {*}
 */
export function updatePersonalApi(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/**
 * 获取用户的岗位信息
 * @param id
 * @return {*}
 */
export function getJobDetailApi(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * @param data
 * @return {*}
 */
export function updateJobApi(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
