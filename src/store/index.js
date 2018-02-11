import Vue from 'vue';
import Vuex from 'vuex';
import i18next from 'i18next';
import quiz from './quiz';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    lang: 'ru',
  },
  mutations: {
    setLang(state, lang) {
      i18next.changeLanguage(lang);
      state.lang = lang;
    },
  },
  modules: {
    quiz,
  },
});

export default store;



// WEBPACK FOOTER //
// ./src/store/index.js