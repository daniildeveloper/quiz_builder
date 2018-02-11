import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    id: '',
    email: '',
    info: {},
    balance: null,
    shareBonus: false
  },
  mutations: {
    setInfo (state, data) {
      state.id = data.id
      state.email = data.email
      state.info = data.info
      state.balance = data.readOnly ? data.readOnly.balance : null
      state.shareBonus = data.readOnly ? data.readOnly.shareBonus : false
    },
    setBalance (state, balance) {
      state.balance = balance
    },
    decrementBalance (state) {
      if (state.balance > 0) {
        state.balance--
      }
    }
  },
  actions: {
    requestInfo ({ commit }) {
      Vue.axios.get('v1/users/whoame').then(res => {
        commit('setInfo', res.data)
      })
    },
    requestBalance ({ state, commit }) {
      Vue.axios.get(`v1/users/${state.id}/readOnly`).then(res => {
        commit('setBalance', res.data.balance)
      })
    }
  }
}



// WEBPACK FOOTER //
// ./src/store/user.js