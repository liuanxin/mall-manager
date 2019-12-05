import defaultSettings from '@/settings'

const { fixedHeader, sidebarLogo } = defaultSettings

const state = {
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
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

