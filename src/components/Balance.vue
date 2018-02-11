<template lang="pug">
  div
    .row
      .col-sm-4
        .card.card-inverse.card-info
          .card-header
            h4 {{ $t('Баланс') }}
          .card-block.pb-0
            .float-right.btn-group
              button.btn.btn-transparent.btn-lg.p-0(type="button" :title="$t('Обновить')" @click="update")
                i.icon-reload
            h4.mb-0 {{ balance }}
            p {{ $t('контактов') }}
            p {{ $t('Нажмите "обновить", чтобы получить точную информацию о балансе') }}
    .row
      .col-sm-6
        form.balance__form(:action="kassaUrl" method="post" @submit.prevent="createBill")
          .card
            .card-header {{ $t('Пополнить баланс') }}
            .card-block
              input(name="shopId" :value="shopId" type="hidden")
              input(name="scid" :value="scid" type="hidden")
              input(name="sum" :value="sum" type="hidden")
              input(name="customerNumber" :value="id" type="hidden")
              input(name="orderNumber" :value="billId" type="hidden")
              input(name="cps_phone" :value="info.phone" type="hidden")
              input(name="cps_email" :value="info.email" type="hidden")
              input(name="paymentType" :value="paymentType" type="hidden")
              
              .form-group.input-lg.balance__chooseCount
                | {{ $t('Мне нужно') }} 
                input.form-control.input-lg.balance__input(:value="leeds" v-model="leeds" min="0" type="number")
                |  {{ $t('контактов') }}
              p.balance__bill {{ $t('к оплате') }}: <b>{{ sum }}</b> {{ $t('рублей') }} ({{ price }} рублей за контакт)
            .card-footer
              select(v-model="paymentType")
                option(value="AC") {{ $t('Банковская карта') }}
                option(value="SB") {{ $t('Сбербанк: оплата по SMS или Сбербанк Онлайн') }}
                option(value="AB") {{ $t('Альфа-Клик') }}
                option(value="PC") {{ $t('Яндекс.Деньги') }}
                option(value="MA") {{ $t('MasterPass') }}
                option(value="PB") {{ $t('Интернет-банк Промсвязьбанка PSB-Retail') }}
                option(value="GP") {{ $t('Наличными в терминале') }}
              .yamoney-pay-button
                input.yamoney-pay-button__pay(type="submit" value="" :disabled="!leeds || loaded")
                span.yamoney-pay-button__text {{ $t('Заплатить') }}
                br
                span.yamoney-pay-button__subtext {{ $t('через Яндекс') }}

      .col-sm-6
        .card
          .card-block
            template(v-if="!shareBonus")
              h4
                | {{ $t('Получите еще 10 контактов бесплатно!') }} 
                i.fa.fa-gift
            h5.mb-3 {{ $t('Расскажите о маркизе друзьям!')}}
            #share
            .mt-3(:class="{ 'alert alert-info': !shareBonus }")
              b(v-if="!shareBonus") Дополнительно: 
              | Расскажите в Вашем комментарии в соцсети Вашу историю о том, как Вам помог marquiz! 
              | Во сколько раз увеличилась конверсия? Насколько удобнее стало работать с заявками?
              br
              | Пришлите нам ссылку на запись на 
              a.alert-link(href="mailto:inbox@marquiz.ru" target="_blank") inbox@marquiz.ru 
              | с пометкой в теме "100 контактов"
              br
              | Каждую неделю автора лучшей истории мы будем награждать дополнительными <b>100 контактами</b>! 
              i.fa.fa-gift
            
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    mounted () {
      // YaShare
      const self = this
      window.Ya.share2('share', {
        content: {
          url: 'http://marquiz.ru?utm_source=share-from-panel',
          // title: 'Я только поставил этот виджет и уже получил более 10 заявок со своего сайта!',
          title: 'Получайте больше заявок с Вашего сайта с помощью виджета квизов!',
          description: 'Я поставил себе виджет квизов и он реально работает!',
          image: 'http://marquiz.ru/img/slide/1.png'
        },
        hooks: {
          onshare () {
            if (!self.shareBonus) {
              self.$axios.post(`v1/users/shareBonus`).then(res => {
                self.$store.dispatch('user/requestInfo')
                self.$analytic.event('share-bonus')
              })
            }
          }
        },
        theme: {
          size: 'm',
          services: 'vkontakte,facebook,odnoklassniki,lj,moimir,linkedin,twitter,surfingbird,tumblr'
        }
      })
    },
    computed: {
      ...mapState('user', ['balance', 'email', 'info', 'id', 'shareBonus']),
      sum () {
        return this.price * Number(this.leeds)
      }
    },
    data () {
      return {
        // Стоимость лида
        price: 10,
        leeds: 100,
        shopId: process.env.KASSA_SHOP_ID,
        scid: process.env.KASSA_SCID,
        billId: null,
        loaded: false,
        paymentType: 'AC',
        kassaUrl: process.env.KASSA_ENV === 'production'
            ? 'https://money.yandex.ru/eshop.xml' : 'https://demomoney.yandex.ru/eshop.xml'
      }
    },
    methods: {
      // Обновление баланса
      update () {
        this.$store.dispatch('user/requestBalance')
      },
      // Создание счета
      createBill (e) {
        this.loaded = true
        e.preventDefault()
        this.$axios.post(`v1/users/${this.id}/payments`, {
          sum: this.sum
        }).then(res => {
          this.billId = res.data.id
          this.$nextTick(() => {
            this.$analytic.event('go-payment')
            e.target.submit()
          })
          this.loaded = false
        }).catch(e => {
          // TODO убрать алерт
          alert('Ошибка при создании счёта')
          this.loaded = false
        })
      }
    }
  }
</script>

<style lang="stylus">
  .balance__form
    width: 100%

  .balance__bill
    margin-top: 5px
    margin-bottom: 5px
    font-size: 16px
    text-align center

  .yamoney-pay-button
    margin: 0
    text-align: center
    background: #FFDB4D

  .yamoney-pay-button__pay,
  .yamoney-pay-button
    background: #FFDB4D
    border-radius: 4px
    height: 64px
    width: 155px
    outline: 0px
    border: 0px
    transition: 0.1s ease-out 0s all
    cursor: pointer

  .yamoney-pay-button__pay
    position: relative
    opacity: 0
    z-index: 2

  .yamoney-pay-button:hover
    background: #ffd633
    transition: 0.1s ease-out 0s all
    cursor: pointer

  .yamoney-pay-button:active
    background: #FFcc00
    cursor: pointer

  .yamoney-pay-button__text
    position: relative
    left: 0
    top: -57px
    color: #000
    font-size: 20px
    line-height: 26px
    font-family: YandexSansTextApp-Regular, Arial, Helvetica, sans-serif
    text-align: center
    cursor: pointer
    z-index: 1

  .yamoney-pay-button__subtext
    position: relative
    left: 0
    top: -61px
    color: #000
    font-size: 12px
    font-family: YandexSansTextApp-Light, Arial, Helvetica, sans-serif
    padding: 0 20px
    text-align: center
    cursor: pointer
    z-index: 1

  .yamoney-pay-button_type_fly
    box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.12), 0 5px 10px -3px rgba(0, 0, 0, 0.3)

  .balance__chooseCount
    display flex
    justify-content center
    font-size 18px
    align-items: center

  .balance__input
    flex: 0 1 100px
    margin 0 1rem
    font-size 18px

  .balance__form
    .card-footer
      display flex
      flex-wrap wrap
      align-items: center
      justify-content center
      select
        max-width: 160px
        margin: 0 0.5rem

</style>



// WEBPACK FOOTER //
// Balance.vue?348807e2