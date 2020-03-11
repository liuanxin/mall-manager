import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { isNotBlank, isNotTrue, toInt } from '@/utils/index'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

/*
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
*/

service.interceptors.response.use(
  (response) => {
    return response.data
    /*
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
    const msg = error.message
    handleError(error)
    return Promise.reject(msg)
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
