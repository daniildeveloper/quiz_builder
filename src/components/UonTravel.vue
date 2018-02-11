<template lang="pug">
  div
    .form-group
      CSwitch(type="3d" variant="primary" v-model="enabled") &nbsp;
      label(v-if="!enabled") &nbsp;{{ $t('Выключено') }}
      label(v-if="enabled") &nbsp;{{ $t('Включено') }}

    template(v-if="enabled")
      .form-group
        label {{ $t('API-ключ') }}
        input.form-control(type="text" placeholder="D383LRl6jdl3k4ct0J2N" v-model="key")
        span.form-text.text-muted {{ $t('Настройки -> Интеграции -> API / WebHooks -> Ваш API-ключ')}}

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
        key: _.get(this.value, 'key')
      }
    },
    computed: {
      settings () {
        return {
          enabled: this.enabled,
          key: this.key
        }
      }
    },
    watch: {
      settings (value) {
        this.$emit('input', value)
      }
    }
  }
</script>



// WEBPACK FOOTER //
// UonTravel.vue?326cd3f4