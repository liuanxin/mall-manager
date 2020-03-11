import globalConfig from '@/config'

const { fixedHeader, sidebarLogo } = globalConfig

const state = {
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, data) => {
    if (state.hasOwnProperty(data.key)) {
      state[data.key] = data.value
    }
  }
}

const actions = {
  changeSetting(context, data) {
    context.commit('CHANGE_SETTING', data)
  }
}

export default {
  state,
  mutations,
  actions
}
