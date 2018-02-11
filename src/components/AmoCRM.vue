<template lang="pug">
  div
    .form-group
      CSwitch(type="3d" variant="primary" v-model="enabled") &nbsp;
      label(v-if="!enabled") &nbsp;{{ $t('Выключено') }}
      label(v-if="enabled") &nbsp;{{ $t('Включено') }}

    template(v-if="enabled")
      .alert.alert-info {{ $t('Будет создаваться контакт и сделка. Ответы на вопросы будут добавлены в примечания к сделке')}}
      .form-group
        .alert.alert-warning(v-if="enabled") {{ $t('Баланс будет списываться сразу') }}
      .form-group
        label {{ $t('Аккаунт') }}
        input.form-control(type="text" placeholder="new59ec805be9332" v-model="account")
        span.form-text.text-muted {{ $t('Название вашего аккаунта в AmoCRM. Показывается в домене или на главном дашборде')}}
      .form-group
        label {{ $t('Url') }}
        input.form-control(type="text" placeholder="https://new59ec805be9332.amocrm.ru" v-model="domain")
        span.form-text.text-muted 
          | {{ $t('Адрес вашего аккаунта в AmoCRM, с протоколом и без слеша в конце')}}. 
          | {{ $t('Редактируйте, только если у вас менялся адрес AmoCRM')}}
      .form-group
        label {{ $t('Логин') }}
        input.form-control(type="email" placeholder="user@email.ru" v-model="login")
        span.form-text.text-muted {{ $t('Ваш email в AmoCRM')}}
      .form-group
        label {{ $t('API ключ') }}
        input.form-control(type="text" placeholder="244faab11bbe35db1c273e5a16c596f9" v-model="hash")
        span.form-text.text-muted {{ $t('Настройки -> API -> Ваш API ключ')}}

</template>

<script>
  import _ from 'lodash'

  export default {
    props: {
      value: Object
    },
    data () {
      return {
        enabled: _.get(this.value, 'enabled', false),
        account: _.get(this.value, 'account'),
        domain: _.get(this.value, 'domain'),
        login: _.get(this.value, 'login'),
        hash: _.get(this.value, 'hash')
      }
    },
    computed: {
      amocrm () {
        return {
          enabled: this.enabled,
          domain: this.domain,
          account: this.account,
          login: this.login,
          hash: this.hash
        }
      }
    },
    watch: {
      amocrm (value) {
        this.$emit('input', value)
      },
      account (value) {
        this.domain = `https://${value}.amocrm.ru`
      }
    }
  }
</script>



// WEBPACK FOOTER //
// AmoCRM.vue?142059e8