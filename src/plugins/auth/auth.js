import Vue from 'vue'
import _ from 'lodash'

const KEY_TOKEN = 'accessToken'
const KEY_VUEX = 'vuex'

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  init ({ router }) {
    this._router = router
    this.setAuthHeader()
    return this
  },

  // Логин
  signin (creds) {
    return new Promise((resolve, reject) => {
      Vue.axios.post('v1/Users/login', creds).then(token => {
        const tokenValue = token.data.id
        this.user.authenticated = true
        this.setAccessToken(tokenValue)
        Vue.axios.get(`v1/Users/${token.data.userId}`).then(user => {
          resolve(user.data, token.data)
        })
      }).catch(error => {
        let message = null
        if (error.response) {
          message = error.response.data.error.message
        }
        reject(new Error(message))
      })
    })
  },

  // Регистрация
  signup (creds) {
    return new Promise((resolve, reject) => {
      Vue.axios.post('v1/Users', creds).then(user => {
        this.signin({ email: creds.email, password: creds.password }).then(token => {
          resolve(user.data, token.data)
        })
      }).catch(error => {
        let message = null
        if (error.response) {
          message = error.response.data.error.message
        }
        reject(new Error(message))
      })
    })
  },

  // To log out, we just need to remove the token
  logout () {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(KEY_TOKEN)) {
        Vue.axios.post('v1/users/logout').then(res => {
          localStorage.removeItem(KEY_TOKEN)
          localStorage.removeItem(KEY_VUEX)
          this.user.authenticated = false
          resolve()
        }).catch(e => {
          localStorage.removeItem(KEY_TOKEN)
          localStorage.removeItem(KEY_VUEX)
          this.user.authenticated = false
          resolve()
        })
      } else {
        this.user.authenticated = false
        resolve()
      }
    })
  },

  // Запрос на сброс пароля
  requestPassword ({ email }) {
    return Vue.axios.post('v1/users/reset', {
      email
    })
  },

  // Сброс пароля
  resetPassword ({ newPassword }) {
    return Vue.axios.post('v1/users/reset-password', {
      newPassword,
      accessToken: localStorage.getItem(KEY_TOKEN)
    })
  },

  // Проверяет, аутентифицирован ли пользователь
  checkAuth () {
    var token = localStorage.getItem(KEY_TOKEN)
    if (token) {
      this.user.authenticated = true
      return true
    } else {
      this.user.authenticated = false
      return false
    }
  },

  // Устанавливает access token
  setAccessToken (accessToken) {
    localStorage.setItem(KEY_TOKEN, accessToken)
    this.setAuthHeader()
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': localStorage.getItem(KEY_TOKEN)
    }
  },

  setAuthHeader () {
    Vue.axios.defaults.headers.common['Authorization'] = this.getAuthHeader()['Authorization']
    // Если 401-я ошибка, тогда происходит редирект на страницу логина
    Vue.axios.interceptors.response.use((response) => {
      // Do something with response data
      return response
    }, (error) => {
      if (error.response) {
        if (error.response.status === 401 && _.get(error, 'response.data.error.code') !== 'LOGIN_FAILED') {
          this.logout()
          this._router.push('/signin')
        }
      }
      // Do something with response error
      return Promise.reject(error)
    })
  }
}



// WEBPACK FOOTER //
// ./src/plugins/auth/auth.js