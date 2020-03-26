
import { isTrue, isNotTrue, isNotBlank, toInt } from '@/utils'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (isNotTrue(process.env.VUE_APP_ONLINE)) {
      console.debug('request config: ' + JSON.stringify(config))
    }
    /* if (store.getters.token) {
      config.headers['x-token'] = getToken()
    } */
    if (isTrue(process.env.VUE_APP_MOCK)) {
      const method = config.method.toLowerCase()
      // mock 时, 将 POST /user/info 请求转换成 GET /post-user-info
      config.method = 'GET'
      config.url = method + (config.url.startsWith('/') ? '' : '-') + config.url.replace(/\//g, '-')
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

service.interceptors.response.use(
  (response) => {
    return response.data
    /*
    // 响应状态是 200, 返回的数据里面用 code 返回了 400 500 这种, 就解开下面的
    const res = response.data
    if (res.code === 200) {
      return res
    } else {
      handleError(res)
      return Promise.reject(new Error(res.msg))
    }
    */
  },
  (error) => {
    handleError(error)
    return Promise.reject(new Error(error.message))
  }
)

const handleError = (data) => {
  if (isNotTrue(process.env.VUE_APP_ONLINE)) {
    console.error('response error: ' + JSON.stringify(data))
  }

  const code = toInt(data.code || (isNotBlank(data.response) ? data.response.status : 0))
  const msg = data.msg || (isNotBlank(data.response) ? data.response.data : null) || data.message
  if (code === 401) {
    MessageBox.alert('您已被登出, 请重新登录').then(() => {
      store.dispatch('logout').then(() => {
        location.reload()
      })
    })
  } else {
    Message({
      message: msg || (code > 0 ? ('返回了 ' + code + ' 错误码') : '请求无响应'),
      type: 'error',
      duration: 5000
    })
  }
}

export default service
