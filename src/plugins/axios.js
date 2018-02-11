import axios from 'axios';

export default {
  install(Vue) {
    Vue.axios = axios.create({
      baseURL: process.env.API_URL,
    });
  },
};



// WEBPACK FOOTER //
// ./src/plugins/axios.js