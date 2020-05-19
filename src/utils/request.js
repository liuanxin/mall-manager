
import { isTrue, isNotTrue, toInt, getData } from '@/utils/util'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const serviceRequest = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

serviceRequest.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['x-token'] = getToken()
    // }
    if (isTrue(process.env.VUE_APP_MOCK)) {
      const realMethod = config.method.toLowerCase()
      const realUrl = config.url
      // mock 时, 将 POST /user/info 请求改成 GET /api/example/post-user-info.json
      config.method = 'GET'
      config.url = '/api/example/' + realMethod + (realUrl.startsWith('/') ? '' : '-') + realUrl.replace(/\//g, '-') + '.json'
    }
    if (isNotTrue(process.env.VUE_APP_ONLINE)) {
      console.debug('request config: ' + JSON.stringify(config))
    }
    return config
  },
  (error) => {
    if (isNotTrue(process.env.VUE_APP_ONLINE)) {
      console.error('request error: ' + JSON.stringify(error))
    }
    return Promise.reject(new Error(error))
  }
)

serviceRequest.interceptors.response.use(
  // 后端响应通常是两种, 后端一般会使用第 2 种方式(微信小程序只支持使用这样的方式)来返回
  // 1. HttpStatus 返回 400 500 这样的非 200 的错误码则: 不解析到 json result, 处理 response.message
  // 2. HttpStatus 返回 200 但返回的 json 数据是 { "code": 500, "msg": "xxx 错误" } 这样的格式
  (response) => {
    // 上面的第 2 种方式
    // const res = response.data
    // if (toInt(res.code) === 200) {
    //   return res
    // } else {
    //   handleError(res)
    //   return Promise.reject(new Error(res.msg))
    // }
    return response.data
  },
  (error) => {
    // 上面的第 1 种方式
    handleError(error)
    return Promise.reject(new Error(error.message))
  }
)

const handleError = (data) => {
  if (isNotTrue(process.env.VUE_APP_ONLINE)) {
    console.error('response error: ' + JSON.stringify(data))
  }

  // toInt(date.code || data.response.status)
  const code = toInt(getData(data, 'code') || getData(data, 'response.status'))
  // data.msg || data.response.data || data.message
  const msg = getData(data, 'msg') || getData(data, 'response.data') || getData(data, 'message')
  if (code === 401) {
    MessageBox.alert('您已被登出, 请重新登录').then(() => {
      store.dispatch('logout').then(() => {
        location.reload()
      })
    })
  } else {
    Message({
      message: (code === 0 ? ('接口无法请求, 网络有误 或 有跨域问题: ' + msg) : (msg || ('错误码: ' + code))),
      type: 'error',
      duration: 5000
    })
  }
}

export default serviceRequest
