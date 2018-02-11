import auth from './auth'

export default {
  install (Vue, { router }) {
    Vue.prototype.$auth = Vue.auth = auth.init({ router })
  }
}



// WEBPACK FOOTER //
// ./src/plugins/auth/index.js