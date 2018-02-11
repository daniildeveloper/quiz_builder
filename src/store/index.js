import Vue from 'vue'
import Vuex from 'vuex'
import quiz from './quiz'
import user from './user'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: 'ru'
  },
  mutations: {},
  modules: {
    quiz, user
  },
  plugins: [
    createPersistedState({
      paths: ['user']
    })
  ]
})



// WEBPACK FOOTER //
// ./src/store/index.js