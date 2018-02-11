<template lang="pug">
  .notifications.card
    .card-header {{ $t('Настройка уведомлений') }}
    .card-block
      h4 {{ $t('Email') }}
      div
        .checkbox
          label
            CSwitch(type="3d" variant="primary" v-model="leedsDirectly")
            |  {{ $t('Отправлять заявки сразу в уведомлении') }}
        .alert.alert-warning(v-if="leedsDirectly") {{ $t('Баланс будет списываться сразу') }}
      .row
        .col-sm-6
          .mb-2 {{ $t('Отправлять уведомления о новых заявках на')}}
          .form-group

            ul.list-group
              li.list-group-item
                .checkbox
                  label
                    input(type="checkbox" v-model="selfEmail")
                    |  {{ email }}
              li.list-group-item(v-for="(email, i) in emails") 
                | {{ email }}
                .btn.btn-link.pull-right(@click="$delete(emails, i)")
                  i.fa.fa-trash
              li.list-group-item(v-if="emails.length < 3")
                form(@submit.prevent="addEmail")
                  .input-group
                    input.form-control(type="email" required v-model="newEmail")
                    .input-group-btn
                      button.btn.btn-primary(type="submit" :disabled="!newEmail") {{ $t('Добавить') }}
      
      hr
      
      h4.notifications__title.mt-3
        | {{ $t('Webhooks') }} 
        img(src="./assets/icons8-webhook.svg")
        
      p 
        | {{ $t('Вы можете оповещать сторонние приложения о поступивших заявках. Для этого укажите URL, на который будет отправлен Web Hook.') }} 
        br
        a(v-b-toggle="'webhookHelp'" href="#" @click.prevent="") {{ $t('Больше информации') }}
      
      b-collapse#webhookHelp
        b-card.bg-info
          .card-block
            WebhookHelp
      
      template(v-for="(webhook, i) in webhooks")
        b-row.mb-2
          b-col(:xs="9")
            b-form-input(v-model="webhook.url" :placeholder="$t('http://webhook.site')")
          b-col(:xs="3")
            b-btn(@click="deleteWebhook(i)" variant="link")
              i.fa.fa-trash

      b-btn(@click="addWebhook") 
        i.fa.fa-plus
        |  {{ $t('Добавить хук')}}

      hr

      h4 {{ $t('AmoCRM') }}
      AmoCRM(v-model="amocrm")

      hr
      
      h4 {{ $t('Bitrix 24')}}
      Bitrix24(v-model="bitrix24")

      hr

      h4 {{ $t('U-ON Travel') }}
      UonTravel(v-model="uonTravel")

</template>

<script>
  import { mapState } from 'vuex'
  import _ from 'lodash'
  import WebhookHelp from './WebhookHelp'
  import AmoCRM from './AmoCRM'
  import Bitrix24 from './Bitrix24'
  import UonTravel from './UonTravel'

  export default {
    components: {
      WebhookHelp, AmoCRM, Bitrix24, UonTravel
    },
    props: {
      value: {
        type: Object
      }
    },
    data () {
      return {
        emails: _.get(this.value, 'email.addresses', []),
        newEmail: '',
        selfEmail: _.get(this.value, 'selfEmail.active', true),
        leedsDirectly: _.get(this.value, 'leedsDirectly', true),
        webhooks: _.get(this.value, 'webhooks', []),
        amocrm: _.get(this.value, 'amocrm'),
        bitrix24: _.get(this.value, 'bitrix24'),
        uonTravel: _.get(this.value, 'uonTravel')
      }
    },
    computed: {
      ...mapState('user', ['email']),
      notifications () {
        const notifications = {
          selfEmail: { active: this.selfEmail },
          leedsDirectly: !!this.leedsDirectly
        }
        if (this.emails.length) {
          notifications.email = {
            addresses: this.emails
          }
        }
        notifications.amocrm = this.amocrm
        notifications.bitrix24 = this.bitrix24
        notifications.uonTravel = this.uonTravel
        notifications.webhooks = _.filter(this.webhooks, 'url')
        return notifications
      }
    },
    methods: {
      addEmail () {
        this.emails.push(this.newEmail)
        this.newEmail = ''
      },
      addWebhook () {
        this.webhooks.push({ url: null })
      },
      deleteWebhook (i) {
        this.$delete(this.webhooks, i)
      }
    },
    watch: {
      notifications () {
        this.$emit('input', this.notifications)
      }
    }
  }
</script>

<style lang="stylus">
  .notifications
    hr
      margin 1.5rem 0
    &__title
      img
        height: 1.7rem

</style>



// WEBPACK FOOTER //
// Notifications.vue?4392e545