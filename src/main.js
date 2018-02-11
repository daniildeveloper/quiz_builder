// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import I18Next from '@/plugins/i18next'
import Axios from '@/plugins/axios'
import Analytic from '@/plugins/analytic'
import Focus from '@/plugins/focus'
import translations from '@/locales/index.js'
import store from '@/store'
import Auth from '@/plugins/auth'
import router from './router'
import HelpTooltip from '@/components/HelpTooltip'
import CSwitch from '@/components/Switch'

import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'
import { Vue2Dragula } from 'vue2-dragula'

// Components
import BootstrapVue from 'bootstrap-vue'

// Styles
import 'dragula/dist/dragula.css'

Vue.use(I18Next, { translations, lang: store.state.lang })
Vue.use(Axios)
Vue.use(Auth, { router })
Vue.use(Focus)
Vue.use(Analytic, { router })
Vue.use(Vue2Dragula)
Vue.use(Tooltip)
Vue.use(BootstrapVue)

Vue.component('alert', require('vue-strap').alert)
Vue.component('dropdown', require('vue-strap').dropdown)
Vue.component('modal', require('vue-strap').modal)
Vue.component('HelpTooltip', HelpTooltip)
Vue.component('CSwitch', CSwitch)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})



// WEBPACK FOOTER //
// ./src/main.js