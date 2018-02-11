import axios from 'axios'

const config = {
  baseURL: process.env.API_URL,
  timeout: 10000,
  withCredentials: true
}

export default {
  install (Vue) {
    Vue.prototype.$axios = Vue.axios = axios.create(config)
    // Загрузка файлов, взято из axios-fileupload
    Vue.prototype.$axiosFileUpload = Vue.axiosFileUpload = (url, file, name = 'file') => {
      if (typeof url !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof url}`)
      }
      const formData = new FormData()
      formData.append(name, file)
      return Vue.axios.post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
    }
  }
}



// WEBPACK FOOTER //
// ./src/plugins/axios.js