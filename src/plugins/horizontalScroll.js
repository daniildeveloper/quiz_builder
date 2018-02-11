export default {
  install(Vue) {
    Vue.directive('horizontal-scroll', {
      inserted(el) {
        el.onwheel = (e) => {
          el.scrollLeft += (e.deltaY * 3);
          e.preventDefault();
        };
      },
    });
  },
};