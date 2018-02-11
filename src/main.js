// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto';
import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/lib/buefy.css';
import store from './store';

// Plugins
import AxiosPlugin from './plugins/axios';
import HorizontalScroll from './plugins/horizontalScroll';
// import Analytic from './plugins/analytic';
import I18Next from './plugins/i18next';
import translations from './locales';

// Components
import VueAwesomeSwiper from 'vue-awesome-swiper';

// Npm
import Dragscroll from 'vue-dragscroll';
import App from './App';
import router from './router';

/*
const domain = location.hash.substring(1);
if (domain) {
  document.domain = domain;
}
*/

Vue.use(Buefy);
Vue.use(AxiosPlugin);
Vue.use(Dragscroll);
Vue.use(HorizontalScroll);
// Vue.use(Analytic, {});
Vue.use(I18Next, { translations, lang: store.state.lang });
Vue.use(VueAwesomeSwiper);

Vue.config.productionTip = false;

// Styles
require('swiper/dist/css/swiper.css');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});