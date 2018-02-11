<template lang="pug">
  .help-tooltip
    i.fa.fa-question-circle(v-tooltip="text")
</template>

<script>
  export default {
    props: {
      text: String
    }
  }
</script>

<style lang="stylus">
  .help-tooltip
    display inline-flex
    padding: 0 0.8rem
    align-items: center
    .tooltip-inner
      background: #ffde24
      color: #000
      text-align: left
      opacity: 1
      max-width: 300px
      min-width: 300px
</style>



// WEBPACK FOOTER //
// HelpTooltip.vue?8c35aa7a