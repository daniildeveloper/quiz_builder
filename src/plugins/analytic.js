import VueAnalytics from 'vue-analytics'

/**
 * Аналитика
 *
 *
 * Цели:
 *
 * login
 * register
 * go-payment
 * payment-success
 * quiz-created
 * quiz-copy-script
 * share-bonus
 *
 * @param Vue
 * @returns {Promise}
 */
const init = function (Vue) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      resolve()
      return
    }

    // Яндекс.Метрика
    (function (d, w, c) {
      (w[c] = w[c] || []).push(function () {
        try {
          w.yaCounter = new window.Ya.Metrika({
            id: 45427596,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            trackHash: true
          })

          resolve()
        } catch (e) {
        }
      })

      const n = d.getElementsByTagName('script')[0]
      const s = d.createElement('script')
      const f = function () {
        n.parentNode.insertBefore(s, n)
      }
      s.type = 'text/javascript'
      s.async = true
      s.src = 'https://mc.yandex.ru/metrika/watch.js'

      if (w.opera === '[object Opera]') {
        d.addEventListener('DOMContentLoaded', f, false)
      } else {
        f()
      }
    })(document, window, 'yandex_metrika_callbacks')

    // Google Analytic
    Vue.use(VueAnalytics, {
      id: 'UA-81424562-2'
    })
  })
}

export default {
  install (Vue, { router }) {
    init(Vue).then(() => {
      if (router) {
        Vue.analytic.hit(router.currentRoute.path)
        router.afterEach((to, from) => {
          Vue.analytic.hit(to.path)
        })
      }
    })

    if (process.env.NODE_ENV === 'production') {
      Vue.prototype.$analytic = Vue.analytic = {
        event (goal) {
          if (window.yaCounter) {
            window.yaCounter.reachGoal(goal)
          }
          Vue.$ga.event('user', goal)
        },
        hit (path) {
          // TODO implement
          if (window.yaCounter) {
            window.yaCounter.hit(path)
          }
          Vue.$ga.page(path)
        }
      }
    } else {
      Vue.prototype.$analytic = Vue.analytic = {
        event (goal) {
          console.info(`Analytic event: ${goal}`)
        },
        hit (path) {
          console.info(`Analytic page hit: ${path}`)
        }
      }
    }
  }
}



// WEBPACK FOOTER //
// ./src/plugins/analytic.js