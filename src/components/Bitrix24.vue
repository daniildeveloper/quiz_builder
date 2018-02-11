<template lang="pug">
  div
          
    .form-group
      CSwitch(type="3d" variant="primary" v-model="enabled") &nbsp;
      label(v-if="!enabled") &nbsp;{{ $t('Выключено') }}
      label(v-if="enabled") &nbsp;{{ $t('Включено') }}
    
    template(v-if="enabled")
      p 
        | {{ $t('Интеграция осуществляется с помощью Вебхуков Bitrix24.') }} 
        | {{ $t('Создайте в Bitrix24 входящий вебхук с правами доступа "CRM" и введите данные ниже') }}
        br
        a(v-b-toggle="'bitrix24help'" href="#" @click.prevent="") {{ $t('Подробнее') }}
      
      b-collapse#bitrix24help
        b-card.bg-info
          .card-block
            ol
              li Зайдите в Bitrix24 и перейдите в раздел "Приложения"
              li Перейдите сверху на вкладку "Вебхуки" и нажмите "Добавить вебхук" -> Входящий вебхук
              li Назовите его как угодно, например "Создание лида в CRM". В правах доступа нажмите галочку "CRM" и сохраните
              li После сохранения сверху появится код авторизации и пример URL для вызова REST. Введите эти значения в нашей форме в одноименные поля. 
                | Смотрите на скриншоте, где взять домен и id пользователя.
                br
                | Важный момент: ID пользователя должен совпадать с ID текущего пользователя, от лица которого создается вебхук.
              
            b-carousel(img-width="1024" img-height="480" controls :value="0")
              b-carousel-slide(img-src="/static/img/help/bitrix-screen1.png")
              b-carousel-slide(img-src="/static/img/help/bitrix-screen2.png")

      b-row
        b-col(sm="6")
          .form-group
            label {{ $t('Домен') }}
            b-input-group(right=".bitrix24.ru")
              b-form-input(v-model="domain" placeholder="b24-slsgct")
          .form-group
            label {{ $t('Код авторизации') }}
            b-form-input(v-model="token" placeholder="hebxdkpelit83vcg")
          .form-group
            label {{ $t('ID пользователя') }}
            b-form-input(v-model="user" placeholder="1")
          .form-group
            label {{ $t('Заголовок лида (необязательно)') }}
            b-form-input(v-model="title" placeholder="Заявка из marquiz.ru")
          .form-group
            label {{ $t('Итоговый URL вебхука, для проверки') }}
            b-form-input(:readonly="!manualEdit" :value="webhookUrl" :state="domain && token && user")

          a(v-b-toggle="'bitrix24extra'" href="#" @click.prevent="") {{ $t('Дополнительные настройки') }}
          b-collapse#bitrix24extra
            .form-group
              label {{ $t('ID поля roistat') }} 
                HelpTooltip(:text="$t('Посмотреть можно при редактировании пользовательского поля в Bitrix24 в браузерной строке')")
              b-form-input(v-model="roistatField" placeholder="UF_CRM_1517067347")

</template>

<script>
  import _ from 'lodash'

  export default {
    props: {
      value: null
    },
    data () {
      return {
        enabled: _.get(this.value, 'enabled', false),
        user: _.get(this.value, 'user', 1),
        token: _.get(this.value, 'token'),
        domain: _.get(this.value, 'domain'),
        url: _.get(this.value, 'url'),
        title: _.get(this.value, 'title', 'Заявка из marquiz.ru'),
        roistatField: _.get(this.value, 'roistatField'),
        manualEdit: !!_.get(this.value, 'url')
      }
    },
    computed: {
      bitrix24 () {
        return {
          enabled: this.enabled,
          user: this.user,
          token: this.token,
          domain: this.domain,
          url: this.url,
          title: this.title,
          roistatField: this.roistatField
        }
      },
      webhookUrl () {
        return `https://${this.domain || '[домен]'}.bitrix24.ru/rest/${this.user || '[пользователь]'}/${this.token || '[код авторизации]'}/`
      }
    },
    watch: {
      bitrix24 (value) {
        this.$emit('input', value)
      }
    }
  }
</script>



// WEBPACK FOOTER //
// Bitrix24.vue?44c687e0