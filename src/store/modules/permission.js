import { getRouter, resetRouter } from '@/router'

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (state, data) => {
    state.routes = getRouter(data)
  },
  CLEAR_ROUTES: (state) => {
    state.routes = []
  }
}

const actions = {
  generateRoutes(context, data) {
    // 只在登录的时候重置路由, 获取数据的时候不重置路由(会有 Duplicate named routes definition 警告)
    if (data.fill) {
      resetRouter(data.data)
    }
    context.commit('SET_ROUTES', data.data)
  },
  clearRoutes(context) {
    resetRouter()
    context.commit('CLEAR_ROUTES')
  }
}

export default {
  state,
  mutations,
  actions
}
