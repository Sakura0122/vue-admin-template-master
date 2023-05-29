import request from '@/utils/request'

/**
 * 获取权限
 * @return {*}
 */
export function getPermissionListApi() {
  return request({
    method: 'get',
    url: '/sys/permission'
  })
}

/**
 * 新增权限
 * @param data
 * @return {*}
 */
export function addPermissionApi(data) {
  return request({
    method: 'post',
    url: '/sys/permission',
    data
  })
}

/**
 * 更新权限
 * @param data
 * @return {*}
 */
export function updatePermissionApi(data) {
  return request({
    method: 'put',
    url: `/sys/permission/${data.id}`,
    data
  })
}

/**
 * 删除权限
 * @param id
 * @return {*}
 */
export function delPermissionApi(id) {
  return request({
    method: 'delete',
    url: `/sys/permission/${id}`
  })
}

/**
 * 获取权限详情
 * @param id
 * @return {*}
 */
export function getPermissionDetailApi(id) {
  return request({
    method: 'get',
    url: `/sys/permission/${id}`
  })
}
