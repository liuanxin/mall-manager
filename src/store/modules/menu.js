import { getRouter, getUserPaths, resetRouter } from '@/router'

const state = {
  routes: [],
  paths: [],
}

const mutations = {
  SET_ROUTES: (state, data) => {
    state.routes = getRouter(data)
    state.paths = getUserPaths(data)
  },
  CLEAR_ROUTES: (state) => {
    state.routes = []
    state.paths = []
  },
}

const actions = {
  generateRoutes(context, data) {
    // 只在登录的时候重置路由, 获取数据的时候不重置路由(会有 Duplicate named routes definition 警告)
    if (data.fill) {
      resetRouter(data.data)
    }
    context.commit('SET_ROUTES', data.data)
  },
  clearRoutes(context, data) {
    if (data.reset) {
      resetRouter()
    }
    context.commit('CLEAR_ROUTES')
  },
}

export default {
  state: state,
  mutations: mutations,
  actions: actions,
}
