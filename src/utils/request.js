
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

// 状态映射
const STATUS_MAPPING = {
  success: 200, // 正常返回
  notLogin: 401, // 显示错误信息并跳到登录页
  notPermission: 403 // 显示错误信息并跳到主页
}

serviceRequest.interceptors.request.use(
  (req) => {
    // 文件下载
    if (isTrue(req.isDownLoadFile)) {
      req.responseType = 'blob'
    }
    // 上传文件
    if (isTrue(req.isUploadFile)) {
      req.headers['Content-Type'] = 'multipart/form-data'
    }
    // mock 时, 将 POST /user/info 请求改成 GET /api/example/post-user-info.json
    if (isTrue(process.env.VUE_APP_MOCK)) {
      const realMethod = req.method.toLowerCase()
      const realUrl = req.url
      req.method = 'GET'
      req.url = '/api/example/' + realMethod + (realUrl.startsWith('/') ? '' : '-') + realUrl.replace(/\//g, '-') + '.json'
    }

    req.startRequest = formatDateTimeMs()
    if (isNotTrue(process.env.VUE_APP_ONLINE)) {
      console.debug(req.startRequest + ' request req: ' + JSON.stringify(req))
    }
    return req
  },
  (error) => {
    if (isNotTrue(process.env.VUE_APP_ONLINE)) {
      console.error('request timeout: ' + JSON.stringify(error))
    }
    return Promise.reject(error)
  }
)

// 后端响应通常是两种, 建议用第一种, 只是绝大部分应用使用第二种(比如微信小程序)
// 1. HttpStatus 返回 400 500 这样的非 200 的错误码, 此种直接处理 response.message
// 2. HttpStatus 返回 200 但返回的 json 数据是 { "code": 500, "msg": "xxx 错误" } 这样的格式
serviceRequest.interceptors.response.use(
  (res) => {
    if (isNotTrue(process.env.VUE_APP_ONLINE)) {
      console.debug('[' + getData(res, 'config.startRequest') + ' --> ' + formatDateTimeMs() + '] res:(' + JSON.stringify(res) + ')')
    }
    const data = res.data
    if (toInt(data.code) === STATUS_MAPPING.success) {
      return data
    } else {
      // 上面的第 2 种方式
      return handleError(data, isTrue(getData(res, 'config.errorReturn')))
    }
  },
  (error) => {
    if (isNotTrue(process.env.VUE_APP_ONLINE)) {
      console.error('[' + getData(error, 'config.startRequest') + ' --> ' + formatDateTimeMs() + '] response error:(' + JSON.stringify(error) + ')')
    }
    // 上面的第 1 种方式
    return handleError(error, isTrue(getData(error, 'config.errorReturn')))
  }
)

const handleError = (error, errorReturn = false) => {
  // toInt(date.code || data.response.status)
  const code = toInt(getData(error, 'code') || getData(error, 'response.status'))
  // data.msg || data.response.data.message || data.message
  const msg = getData(error, 'msg') || getData(error, 'response.data.message') || getData(error, 'message')
  const showMessage = defaultValue((code === 0 ? '接口无法请求, 网络有误或有跨域问题: ' : '') + msg, '错误码: ' + code)
  if (code === STATUS_MAPPING.notLogin) {
    // 未登录(401): 显示信息后退出并重新加载当前页
    MessageBox.alert(showMessage).finally(() => {
      store.dispatch('logout').then(() => {
        location.reload()
      })
    })
  } else if (code === STATUS_MAPPING.notPermission) {
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
