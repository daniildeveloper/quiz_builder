export default {
  install (Vue) {
    Vue.directive('focus', {
      inserted (el) {
        // Focus the element
        el.focus()
      }
    })
  }
}



// WEBPACK FOOTER //
// ./src/plugins/focus.js