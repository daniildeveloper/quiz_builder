<template lang="pug">
  .color-picker
    .color-picker__color(
      v-for='(color, i) in colors', 
      :class="{ 'color-picker__color-selected': value === i }", 
      :style='{ backgroundColor: color }',
      @click='v = i'
    )

</template>

<script>
  export default {
    computed: {
      v: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    },
    props: {
      colors: Array,
      value: Number
    }
  }
</script>

<style lang="stylus">
  .color-picker
    margin-bottom: 1rem

  .color-picker__color
    border: 1px solid #ccc
    width: 40px
    height: 38px
    float: left
    margin-right: 5px
    cursor: pointer

  .color-picker__color-selected
    border: 3px solid #454960

</style>



// WEBPACK FOOTER //
// ColorPicker.vue?5b65b239