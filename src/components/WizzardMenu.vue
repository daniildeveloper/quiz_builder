<template lang="pug">
  .wizard-menu
    .wizard-menu__item(v-for="(item, i) in items" :key="i" @click="changeItem(i)" :class="itemClasses(i)")
      .wizard-menu__item-step {{ $t('Шаг') }} {{ i + 1 }}
      span.wizard-menu__item-description {{ item.text }}
</template>

<script>
  export default {
    props: {
      items: Array,
      value: 0
    },
    methods: {
      changeItem (i) {
        if (!this.items[i].disabled) this.$emit('input', i)
      },
      itemClasses (i) {
        return {
          'wizard-menu__item_active': this.value === i,
          'wizard-menu__item_disabled': this.items[i].disabled === true
        }
      }
    }
  }
</script>

<style lang="stylus">
  .wizard-menu
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    overflow-x: auto
    justify-content: space-around
    color: #fff
    @media (max-width: 767px)
      justify-content: flex-start

    &__item
      cursor: pointer
      opacity: 0.6
      flex: 0 0 150px
      &_active
        opacity: 1
        border-bottom: 4px solid #fff
      &_disabled
        color: #ccc
        cursor: not-allowed

    &__item-step
      font-size: 1.5rem
      font-weight: 700
</style>



// WEBPACK FOOTER //
// WizardMenu.vue?216b151e