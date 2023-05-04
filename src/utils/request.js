import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  // 当基地址不是以http或https开头 就会把网址对应域名拼接上
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 超时时间
})

// 请求拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  const res = response.data
  if (!res.success) {
    Message.error(res.message)
    return Promise.reject(new Error(res.message))
  }
  return res
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})

export default service
