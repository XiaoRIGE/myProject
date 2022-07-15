/*
 * @Description:
 * @Author: Author
 * @Date: 2022-07-05 14:54:30
 * @LastEditTime: 2022-07-05 15:19:31
 * @LastEditors: Author
 */
import axios from 'axios'

const service = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 1000 * 20,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截
service.interceptors.request.use(config => {
  // 设置 token
  return config
})

// 响应拦截
service.interceptors.response.use(response => {
  // 处理状态码
  return response.data
}, error => {
  return Promise.reject(error)
})

export const get = (url, params) => {
  return service({
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url,
    params
  })
}

export const post = (url, data) => {
  return service({
    method: 'post',
    url,
    data
  })
}