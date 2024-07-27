import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import router from '@/router'
import store from '@/store'
import { isBlank, isNotBlank, isNotTrue, isNotEmptyArray, isEmptyArray } from '@/utils/util'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import globalConfig from '@/config'

NProgress.configure({ showSpinner: false })

const login = '/login'
const index = '/'
const ignoreRedirectPath = [login, index, '/index'] // 不需要重置的页面地址

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const toPath = to.path
  const params = (isBlank(toPath) || ignoreRedirectPath.includes(toPath)) ? '' : ('?redirect=' + toPath)
  const title = (isNotBlank(to.meta.title) ? (to.meta.title + ' - ') : '') + globalConfig.title

  // 从本地获取 localData, 如果没有值表示未登录, 则先调用退出(删除 localData 和 vuex 中的数据)再导去登录(尾)
  // 有 localData 值就从 vuex 中获取权限
  //
  //   如果 vuex 中没有权限则从本地(没有就去请求后台)获取用户信息并写入 vuex
  //   在此期间, 操作如果异常则先调用退出(删除 localData 和 vuex 中的数据及请求后端接口退出)再导去登录(尾)
  //
  //   如果 vuex 中有权限则依次进行下面的处理
  //     如果下一页是登录页则导去主页
  //     如果下一页没有权限, 提示一下再导去主页
  //     都没有问题, 就导向下一页

  const token = getToken()
  if (isBlank(token)) {
    // 没登陆就调用退出动作(只删除本地数据, 不需要重置路由, 也不向后台发起退出请求), 避免之前还有值没清掉的
    await store.dispatch('logout', false)
    if (toPath === login) {
      document.title = title
      next()
    } else {
      next(login + params)
      NProgress.done()
    }
    return
  }

  const routers = store.getters.menu_routes
  if (isEmptyArray(routers)) {
    try {
      await store.dispatch('getInfo')
    } catch (error) {
      if (isNotTrue(process.env.VUE_APP_ONLINE)) {
        console.error('handle user.js#getInfo() error: ' + (error || 'Has Error'))
      }
      await store.dispatch('logout')
      if (toPath === login) {
        document.title = title
        next()
      } else {
        next(login + params)
        NProgress.done()
      }
      return
    }
  }

  if (toPath === login) {
    next(index)
    NProgress.done()
  } else if (ignoreRedirectPath.includes(toPath)) {
    document.title = title
    next()
  } else {
    const menuPaths = store.getters.menu_paths
    if (isNotEmptyArray(menuPaths) && !menuPaths.includes(toPath)) {
      Message({
        message: '不能访问(' + toPath + '), 无此地址或无权限',
        type: 'error',
        duration: 2000,
      })
      next(index)
      NProgress.done()
    } else {
      document.title = title
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
