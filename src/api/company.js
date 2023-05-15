import request from '@/utils/request'

export const getCompanyInfoApi = (id) => {
  return request({
    url: `/company/${id}`
  })
}
