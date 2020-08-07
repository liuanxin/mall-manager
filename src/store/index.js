import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import app from './modules/app'
import menu from './modules/menu'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app: app,
    menu: menu,
    settings: settings,
    user: user
  },
  getters
})

export default store
