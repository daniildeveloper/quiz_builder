<template lang="pug">
  .quiz-steps
    .quiz-steps__wizard
      WizardMenu(:items="steps" v-model="a")
    .quiz-steps__buttons
      button.btn.btn-default(v-for="button in buttons" @click="a = button.step")
        i(v-if="button.icon" :class="button.icon") &nbsp;
        span {{ button.text }}
</template>


<script>
  import WizardMenu from '@/components/WizardMenu'

  export default {
    components: {
      WizardMenu
    },
    props: {
      value: {
        type: Number,
        default: 0
      },
      id: String
    },
    computed: {
      a: {
        get () {
          return this.value
        },
        set (v) {
          this.$emit('input', v)
        }
      },
      steps () {
        return [
          {
            text: this.$t('Вопросы и ответы'),
            disabled: false,
            active: this.a === 0
          },
          {
            text: this.$t('Cбор контактов'),
            disabled: !this.id,
            active: this.a === 1
          },
          {
            text: this.$t('Усиление'),
            disabled: !this.id,
            active: this.a === 2
          }
        ]
      },
      buttons () {
        return [
          {
            text: this.$t('Внешний вид'),
            disabled: !this.id,
            active: this.a === 3,
            icon: 'fa fa-paint-brush',
            step: 3
          },
          {
            text: this.$t('Уведомления'),
            disabled: !this.id,
            active: this.a === 4,
            icon: 'fa fa-bell',
            step: 4
          },
          {
            text: this.$t('Код для вставки'),
            disabled: !this.id,
            active: this.a === 5,
            icon: 'fa fa-code',
            step: 5
          },
          {
            text: this.$t('Аналитика'),
            disabled: !this.id,
            active: this.a === 6,
            icon: 'fa fa-bar-chart',
            step: 6
          }
        ]
      }
    }
  }
</script>

<style lang="stylus">
  .quiz-steps
    margin-bottom: 1.5rem
    display flex

  .quiz-steps__wizard
    flex 1 1 70%

  .quiz-steps__buttons
    flex 0 1 200px
    display flex
    flex-direction column
    @media (max-width: 767px)
      flex-basis: 30px
      margin-left: 1rem
    .btn
      margin-bottom: 5px
      display flex
      justify-content flex-start
      i
        flex-basis: 30px
    span
      @media (max-width: 767px)
        display none
</style>



// WEBPACK FOOTER //
// Steps.vue?11711ba9