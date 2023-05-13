import request from '@/utils/request'

/**
 * 获取部门列表
 * @return {*}
 */
export const getDepartmentListApi = () => {
  return request({
    url: '/company/department'
  })
}

/**
 * 删除部门
 * @param id 删除部门的id
 * @return {*}
 */
export const delDepartmentApi = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

/**
 * 新增部门
 * @param data 新增部门的数据
 * @return {*}
 */
export const addDepartmentApi = (data) => {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

/**
 * 获取部门详情
 * @param id 部门id
 * @return {*}
 */
export const getDepartmentDetailApi = (id) => {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 * @param form 编辑部门参数
 * @return {*}
 */
export const editDepartmentApi = (form) => {
  return request({
    url: `/company/department/${form.id}`,
    method: 'put',
    data: form
  })
}
