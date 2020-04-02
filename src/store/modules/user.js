import { getInfo, login, logout } from '@/api/user'
import { getLocalData, getToken, removeLocalData, removeToken, setLocalData, setToken } from '@/utils/auth'
import { isBlank } from '@/utils/util'

const state = {
  name: '',
  avatar: ''
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const doLogin = (context, fillRouter, data) => {
  context.commit('SET_NAME', data.nickName || data.userName)
  context.commit('SET_AVATAR', data.avatar)
  // 将权限写进 store, 只在登录的时候重置路由, 获取数据的时候不重置路由(会有 Duplicate named routes definition 警告)
  context.dispatch('generateRoutes', { fill: fillRouter, data: data }, { root: true }).then(() => {
    // 写 cookie 和 local
    if (isBlank(getToken())) {
      setToken(data.token || data.id || data.userName)
    }
    if (isBlank(getLocalData())) {
      setLocalData(data)
    }
  })
}
const doLogout = (context, resetRouter) => {
  context.commit('SET_NAME', '')
  context.commit('SET_AVATAR', '')
  // 清空权限
  context.dispatch('clearRoutes', { reset: resetRouter }, { root: true }).then(() => {
    // 删除 cookie 及 local
    removeToken()
    removeLocalData()
  })
}

const actions = {
  // store.dispatch('login'
  login(context, userInfo) {
    return new Promise((resolve, reject) => {
      login({
        userName: userInfo.userName.trim(),
        password: userInfo.password
      })
        .then((response) => {
          const data = response.data
          doLogin(context, true, data)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // store.dispatch('getInfo')
  getInfo(context) {
    return new Promise((resolve, reject) => {
      // 先从本地取, 没有再请求后台
      const data = getLocalData()
      if (isBlank(data)) {
        getInfo()
          .then((response) => {
            const data = response.data
            if (isBlank(data)) {
              reject('获取失败, 请登录')
            } else {
              doLogin(context, false, data)
              resolve(data)
            }
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        doLogin(context, false, data)
        resolve(data)
      }
    })
  },

  // store.dispatch('logout')
  logout(context, resetRouter = true) {
    return new Promise((resolve, reject) => {
      doLogout(context, resetRouter)

      if (resetRouter) {
        logout()
          .then(() => {
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        resolve()
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
