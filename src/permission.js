import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import router from '@/router'
import store from '@/store'
import { isBlank, isNotBlank, isNotTrue, isNotEmptyArray } from '@/utils/util'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import globalConfig from '@/config'

NProgress.configure({ showSpinner: false })

const login = '/login'
const index = '/'
const ignoreRedirectPath = [login, index, '/index'] // 去这些页时, 如果未登录要导去登录页, 不需要把这些地址拼在参数上(表示跳回来的地址)

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const toPath = to.path
  const params = (isBlank(toPath) || ignoreRedirectPath.includes(toPath)) ? '' : ('?redirect=' + toPath)
  const title = (isNotBlank(to.meta.title) ? (to.meta.title + ' - ') : '') + globalConfig.title

  // 从本地获取 token, 如果没有值表示未登录, 则先调用退出(删除 token 和 vuex 中的数据)再导去登录(下一页不是登录则拼在参数上, 这样登录成功后可以导回来)
  // 有 token 值就从 vuex 中获取权限
  //   如果 vuex 中没有权限规则(按 F5 刷新一下就没了)则从本地(没有就去请求后台)获取用户信息并写入 vuex
  //     写入成功后导向下一个页面(如果下一页是登录页则导去主页)
  //     如果获取后台接口时异常则先调用退出(删除 token 和 vuex 中的数据及请求后端接口退出)再导去登录(下一页不是登录则拼在参数上, 这样登录成功后可以导回来)
  //   如果 vuex 中有权限规则依次进行下面的处理
  //     如果下一页是登录页则导去主页
  //     如果下一页没有权限, 则弹一个提示给用户表示其无权访问后再导去主页
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
  } else {
    const routers = store.getters.menu_routes
    if (isBlank(routers)) {
      try {
        await store.dispatch('getInfo')
        if (toPath === login) {
          next(index)
          NProgress.done()
        } else {
          document.title = title
          next()
        }
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
      }
    } else {
      if (toPath === login) {
        // 如果已经登陆却访问登陆页则跳去主页
        next(index)
        NProgress.done()
      } else if (!(isNotEmptyArray(store.getters.menu_paths) && store.getters.menu_paths.includes(toPath))) {
        // 如果用户访问的是没有权限的地址则往主页导, 主页也有可能没权限, 这是一个问题!!!
        Message({
          message: '不能访问(' + toPath + ')地址',
          type: 'error',
          duration: 1500
        })
        next(index)
        NProgress.done()
      } else {
        document.title = title
        next()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
