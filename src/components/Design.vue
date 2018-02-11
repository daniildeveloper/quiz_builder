<template lang="pug">
  .quiz-design
    .card
      .card-header {{ $t('Дизайн') }}
      .card-block
        b-form-group(:label="$t('Основной цвет')")
          b-row.mb-3
            b-col(sm="12")
              ColorPicker(:colors="colors" v-model="color")
          b-row.mb-3
            b-col(sm="5")
              .quiz-design__color-input
                b-row
                  b-col(xs="6")
                    b-form-input(type="text" v-model="mainColor")
                  b-col(xs="6")
                    b-form-input(type="color" v-model="mainColor")

          b-row
            b-form-group(:label="$t('Язык интерфейса')")
              b-form-select(:options="languages" v-model="language")
</template>

<script>
  import _ from 'lodash'
  import ColorPicker from '@/components/ColorPicker'

  export default {
    components: {
      ColorPicker
    },
    props: {
      value: Object
    },
    data () {
      return {
        mainColor: _.get(this.value, 'colors.main', null),
        color: null,
        colors: ['#3d3bee', '#51b905', '#d34085', '#f83a4b', '#ff7544', '#cfa16a', '#3dc8f5', '#efce36', '#6161af'],
        languages: [
          // @see http://htmlbook.ru/html/value/lang
          { value: null, text: this.$t('По-умолчанию') },
          { value: 'ru', text: this.$t('Русский') },
          { value: 'uk', text: this.$t('Український') },
          { value: 'en', text: this.$t('English') },
          { value: 'be', text: this.$t('Беларускі') },
          { value: 'kk', text: this.$t('Қазақ') }
        ],
        language: _.get(this.value, 'lng', null)
      }
    },
    methods: {
      emit () {
        this.$emit('input', {
          colors: {
            main: this.mainColor
          },
          lng: this.language
        })
      }
    },
    watch: {
      mainColor () {
        this.emit()
      },
      color () {
        this.mainColor = this.colors[this.color]
      },
      language () {
        this.emit()
      }
    }
  }
</script>

<style lang="stylus">
</style>



// WEBPACK FOOTER //
// Design.vue?2c4c8b50