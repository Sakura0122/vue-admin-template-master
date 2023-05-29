import request from '@/utils/request'

/**
 * 获取所有角色列表
 * @param page 当前页
 * @param pagesize 页容量
 * @return {*}
 */
export const getRoleListApi = (page, pagesize) => {
  return request({
    url: '/sys/role',
    params: {
      page,
      pagesize
    }
  })
}

/**
 * 删除角色
 * @param id 角色id
 * @return {*}
 */
export const delRoleApi = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 新增角色
 * @param data 新增角色所需数据
 * @return {*} data
 */
export const addRoleApi = (data) => {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

/**
 * 根据id获取角色详情
 * @param id 角色id
 * @return {*}
 */
export const getRoleDetailApi = (id) => {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * 修改角色
 * @param data 角色信息
 * @return {*}
 */
export const updateRole = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 给角色分配权限
 * @param {*} data 接口所需数据
 * @return {*}
 */
export const editRolePermissionApi = (data) => {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
