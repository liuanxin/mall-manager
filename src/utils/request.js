
import { isTrue, isNotTrue, toInt, getData, defaultValue, formatDateTimeMs } from '@/utils/util'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'
// import { getToken } from '@/utils/auth'

// create an axios instance
const serviceRequest = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

serviceRequest.interceptors.request.use(
  (config) => {
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

    const start = formatDateTimeMs()
    config.startRequest = start
    if (isNotTrue(process.env.VUE_APP_ONLINE)) {
      console.debug(start + ' request config: ' + JSON.stringify(config))
    }
    return config
  },
  (error) => {
    if (isNotTrue(process.env.VUE_APP_ONLINE)) {
      console.error('request timeout: ' + JSON.stringify(error))
    }
    return Promise.reject(error)
  }
)

serviceRequest.interceptors.response.use(
  // 后端响应通常是两种, 比较好的是第一种, 只是通常会使用第 2 种方式(微信小程序只支持使用这样的方式)来返回
  // 1. HttpStatus 返回 400 500 这样的非 200 的错误码, 此种直接处理 response.message
  // 2. HttpStatus 返回 200 但返回的 json 数据是 { "code": 500, "msg": "xxx 错误" } 这样的格式
  (response) => {
    const res = response.data
    if (toInt(res.code) === 200) {
      return res
    } else {
      // 上面的第 2 种方式
      return handleError(res, getData(response, 'config.startRequest'), isTrue(getData(response, 'config.errorReturn')))
    }
  },
  (error) => {
    // 上面的第 1 种方式
    return handleError(error, getData(error, 'config.startRequest'), isTrue(getData(error, 'config.errorReturn')))
  }
)

const handleError = (error, startRequest, errorReturn = false) => {
  if (isNotTrue(process.env.VUE_APP_ONLINE)) {
    console.error('[' + startRequest + ' --> ' + formatDateTimeMs() + '] response error: ' + JSON.stringify(error) + ', return error: ' + errorReturn)
  }

  // toInt(date.code || data.response.status)
  const code = toInt(getData(error, 'code') || getData(error, 'response.status'))
  // data.msg || data.response.data.message || data.message
  const msg = getData(error, 'msg') || getData(error, 'response.data.message') || getData(error, 'message')
  const showMessage = defaultValue((code === 0 ? '接口无法请求, 网络有误或有跨域问题: ' : '') + msg, '错误码: ' + code)
  if (code === 401) {
    // 未登录(401): 显示信息后退出并重新加载当前页
    MessageBox.alert(showMessage).finally(() => {
      store.dispatch('logout').then(() => {
        location.reload()
      })
    })
  } else if (code === 403) {
    // 无权限(403): 显示信息后跳到主页
    MessageBox.alert(showMessage).finally(() => {
      router.replace({path: '/'}).catch((e) => {
        if (isNotTrue(process.env.VUE_APP_ONLINE)) {
          console.debug(formatDateTimeMs() + 'no permission replace error: ' + e)
        }
      })
    })
  } else {
    // 其他: 返回则由调用方的 catch 处理, 不返回则显示错误信息
    if (isTrue(errorReturn)) {
      return Promise.reject(error)
    } else {
      Message({
        message: showMessage,
        type: 'error',
        duration: 5000
      })
    }
  }
}

export default serviceRequest
