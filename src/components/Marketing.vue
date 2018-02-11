<template lang="pug">
  .card
    .card-header
      h4 {{ $t('Скидка') }}
    .card-block
      .alert.alert-info {{ $t('Предложите клиенту скидку за прохождение теста. Скидка поможет увеличить конверсию') }}
      div {{$t('Скидка') }}
      
      CSwitch(type="3d" variant="primary" v-model="discount")

      template(v-if="discount")
        b-form-radio-group(v-model="discountType")
          b-form-radio(value="melting") {{ $t('Тающая') }}
          b-form-radio(value="increasing") {{ $t('Нарастающая') }}
          b-form-radio(value="increasingPercent") {{ $t('Нарастающий процент') }}

        p(v-if="discountIsValue")
          label {{ $t('Сумма скидки') }}
            input.form-control(
              v-model.number="discountValue"
              type="number"
              step="1000"
              min="0"
              ref="discountInput"
            )
        p(v-if="discountIsPercent")
          label {{ $t('Процент скидки') }}
            input.form-control(
              v-model.number="discountPercent"
              type="number"
              step="1"
              min="0"
              max="100"
              ref="discountPercentInput"
            )

        p(v-if="discountIsValue")
          label {{ $t('Валюта скидки') }}
            select.form-control(v-model="selectedCurrency")
              option(
                v-for="currency in currencies"
                :value="currency.code"
              ) {{ currency.name }}
              //- :selected="currency.lang === $store.state.lang"
        
</template>

<script>
  import CSwitch from '@/components/Switch'
  import _ from 'lodash'

  export default {
    components: {
      CSwitch
    },
    props: {
      value: Object
    },
    data () {
      return {
        discount: Boolean(this.value && this.value.discount),
        discountType: _.get(this.value, 'discount.type', 'melting'),
        discountValue: _.get(this.value, 'discount.value'),
        discountPercent: _.get(this.value, 'discount.percent'),
        currency: this.selectedCurrency,
        currencies: [
          {
            name: this.$t('Рубли'),
            lang: 'ru',
            code: 'RUR'
          },
          {
            name: this.$t('Доллары'),
            lang: 'en',
            code: 'USD'
          },
          {
            name: this.$t('Евро'),
            lang: 'fr',
            code: 'EUR'
          },
          {
            name: this.$t('Гривны'),
            lang: 'ua',
            code: 'UAH'
          },
          {
            name: this.$t('Бел. рубли'),
            lang: 'by',
            code: 'BYB'
          },
          {
            name: this.$t('Тенге'),
            lang: 'kz',
            code: 'KZT'
          }
        ]
      }
    },
    computed: {
      discountIsValue () {
        return this.discountType === 'increasing' || this.discountType === 'melting'
      },
      discountIsPercent () {
        return !this.discountIsValue
      },
      selectedCurrency: {
        get () {
          if (this.currency) {
            return this.currency
          }
          let currency = this.currencies.find(currency => currency.lang === this.$store.state.lang)
          return currency.code
        },
        set (v) {
          let curr = this.currencies.find(currency => currency.code === v)
          this.currency = curr.code
          return curr.code
        }
      }
    },
    methods: {
      emit () {
        const marketing = {}
        if (this.discountIsValue && this.discountValue) {
          marketing.discount = {
            type: this.discountType,
            value: this.discountValue,
            currency: this.currency
          }
        } else if (this.discountIsPercent && this.discountPercent) {
          marketing.discount = {
            type: this.discountType,
            percent: this.discountPercent
          }
        }
        this.$emit('input', marketing)
      }
    },
    watch: {
      selectedCurrency () {
        this.emit()
      },
      discount (v) {
        if (!v) {
          this.discountValue = null
          this.discountPercent = null
        } else {
          this.$nextTick(() => {
            if (this.$refs.discountInput) {
              this.$refs.discountInput.focus()
            } else if (this.$refs.discountPercentInput) {
              this.$refs.discountPercentInput.focus()
            }
          })
        }
      },
      discountType () {
        this.emit()
      },
      discountValue () {
        this.emit()
      },
      discountPercent () {
        this.emit()
      }
    },
    mounted () {
      this.currency = this.selectedCurrency
    }
  }
</script>



// WEBPACK FOOTER //
// Marketing.vue?8427c860