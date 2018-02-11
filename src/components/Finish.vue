<template lang="pug">
  .card
    .card-header {{ $t('Сбор контактных данных посетителя') }}
    .card-block
      .form-horizontal
        .form-group
          label {{ $t('Заголовок') }}
            HelpTooltip(:text="$t('Убедите здесь пользователя заполнить форму. Это сообщение покажется на последнем шаге')")
          .input-group
            textarea(class="form-control" v-model="text" :placeholder="$t('Убедите пользователя заполнить форму')")

        label {{ $t('Бонус') }}
          HelpTooltip(
            :text="$t('Подогрейте посетителя, предложите ему бонус за заполнение формы. Например: \"Получите подборку 17 частых ошибок при выборе велосипеда\"')")
        .form-group
          input(type="text" v-model="extra" class="form-control" 
                :placeholder="$t('Предложите клиенту бонус за ожидание результатов')")
        
        label {{ $t('Текст на кнопке') }}
        .form-group
          input(type="text" v-model="button" class="form-control" :placeholder="$t('Текст на кнопке')")
        
        label {{ $t('Сообщение после отправки') }}
          HelpTooltip(
            :text="$t('Скажите клиенту например, что уже начали расчёт и в ближайшее время с ним свяжетесь. Слово \"Спасибо\" писать не надо. Здесь можно использовать ссылки')")
        .form-group
          textarea(v-model="thanks" class="form-control" 
                :placeholder="$t('Спасибо! Мы отправим Вам результаты теста в течение двух часов')")
          | Также в этом поле вы можете использовать ссылку для перехода на вашу страницу "Спасибо" или скачивание каталога. Ссылка должна быть следующего вида:
          br
          code [скачать каталог](http://example.com)
          br
          | Тогда пользователь увидит только текст "скачать каталог" (саму ссылку не увидит), по которому сможет нажать.

        hr

        .form-group
          label {{ $t('Переадресация на страницу после заполнения формы') }}  
            CSwitch(type="3d" variant="primary" :value="!redirect" @change="redirect = null")
          b-form-input(v-model="redirect" type="url" placeholder="http://example.com")

        hr

        h5 {{ $t('Поля контактов') }}

        .alert.alert-info 
          |{{ $t('Мы специально выбрали такой порядок, потому что посетителю сначала гораздо проще оставить свой email. А потом, с горячей руки, он уже более легко согласится оставить свои имя и телефон. Отсюда конверсия выше. Но вы можете выбрать другой порядок') }}
 
        .row
          .col-sm-4
            h6 {{ $t('Шаг 1 (сразу)') }}
            ul.list-group.finish__fields(v-dragula="fields1" drake="first")
              .list-group-item.finish__fields-item(v-for="field in fields1" :key="field.key")
                i.fa.fa-arrows.fields__handle-move
                span  {{ field.name }}
                CSwitch(type="3d" variant="primary" v-model="field.enabled")
          .col-sm-4
            h6 {{ $t('Шаг 2 (после заполнения шага 1)') }}
            ul.list-group.finish__fields(v-dragula="fields2" drake="first")
              .list-group-item.finish__fields-item(v-for="field in fields2" :key="field.key")
                i.fa.fa-arrows.fields__handle-move
                span  {{ field.name }}
                CSwitch(type="3d" variant="primary" v-model="field.enabled")

        hr

        b-row
          b-col(:sm="6")
            p {{ $t('Маска для поля \"Телефон\"') }}  
              CSwitch(type="3d" variant="primary" :value="!phoneMask" @change="phoneMask = null")
            b-form-input(v-model="phoneMask" placeholder="+7 (111) 111-11-11")
            p Используйте <code>1</code> для подстановки чисел
          b-col(:sm="6")
            p {{ $t('Готовые маски') }}
            b-list-group
              b-list-group-item(href="#" button @click="phoneMask = '+7 (111) 111-11-11'") +7 (111) 111-11-11
              b-list-group-item(href="#" button @click="phoneMask = '+38 (111) 111-11-11'") +38 (111) 111-11-11
              b-list-group-item(href="#" button @click="phoneMask = '+375 (11) 111-11-11'") +375 (11) 111-11-11

</template>

<script>
  import _ from 'lodash'

  export default {
    props: {
      value: Object
    },
    data () {
      return {
        text: _.get(this.value, 'text', this.$t('Введите email для получения результатов теста')),
        thanks: _.get(this.value, 'thanks', this.$t('Мы отправим Вам результаты теста в течение двух часов')),
        extra: _.get(this.value, 'extra'),
        button: _.get(this.value, 'button', this.$t('Получить результаты')),
        fields1: this.value && this.value.fields1 && (this.value.fields1.length || this.value.fields2.length) ? this.value.fields1 : [
          { key: 'email', name: this.$t('Email'), enabled: true }
        ],
        fields2: this.value && this.value.fields2 && (this.value.fields1.length || this.value.fields2.length) ? this.value.fields2 : [
          { key: 'name', name: this.$t('Имя'), enabled: true },
          { key: 'phone', name: this.$t('Телефон'), enabled: true }
        ],
        phoneMask: _.get(this.value, 'phoneMask'),
        phoneMaskCode: _.get(this.value, 'phoneMaskCode'),
        redirect: _.get(this.value, 'redirect')
      }
    },
    methods: {
      emit () {
        this.$emit('input', Object.assign({}, this.value, {
          text: this.text,
          thanks: this.thanks,
          extra: this.extra,
          button: this.button,
          fields1: this.fields1,
          fields2: this.fields2,
          phoneMask: this.phoneMask,
          redirect: this.redirect
        }))
      }
    },
    watch: {
      text () { this.emit() },
      thanks () { this.emit() },
      extra () { this.emit() },
      button () { this.emit() },
      fields1 () { this.emit() },
      fields2 () { this.emit() },
      phoneMask () { this.emit() },
      redirect () { this.emit() }
    }
  }
</script>

<style lang="stylus">
  .finish__fields
    min-height: (57px * 3)
    background: #ccc

  .finish__fields-item
    display: flex
    justify-content: space-between
    align-items: center

    .fields__handle-move
      cursor: move
      display: block
      height: 2rem
      width: 2rem
      line-height: 2
      text-align: center
</style>



// WEBPACK FOOTER //
// Finish.vue?bdb32de2