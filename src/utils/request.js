import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { showFullScreenLoading, tryHideFullScreenLoading } from './loading'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})
// 继承axios并发方法
service.all = axios.all
service.spread = axios.spread
// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['token'] = store.getters.token // 让每个请求携带自定义token
  }
  showFullScreenLoading()
  return config
}, error => {
  // Do something with request error

  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
    * state为非100是抛错
    */
    tryHideFullScreenLoading()
    const res = response.data
    if (res.state !== '100') {
      // 111:无效的token;
      if (res.state === '111') {
        store.dispatch('LogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      } else {
        Message({
          message: res.message,
          type: 'error',
          duration: 2 * 1000
        })
        return Promise.reject('error')
      }
    } else {
      return response.data
    }
  },
  error => {
    tryHideFullScreenLoading()
    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
