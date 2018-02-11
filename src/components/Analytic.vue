<template lang="pug">
  .analytic
    .card
      .card-header {{ $t('Аналитика') }}
      .card-block
        h4 {{ $t('Яндекс.Метрика') }} 
          CSwitch(type="3d" variant="primary" v-model="metrika")

        template(v-if="metrika")

          label {{ $t('Номер счётчика') }}
            input.form-control(v-model="metrikaId" placeholder="46119039" ref="metrikaInput")

          h4.mt-3 {{ $t('Цели') }}
          p {{ $t('Установите цели в аналитике, чтобы отслеживать поведение посетителя по шагам и построить воронку конверсии') }}.
          .alert.alert-info 
            p {{ $t('Создайте в метрике составную цель, где у каждого шага условие - "событие:идентификатор цели", а значение согласно таблице ниже.')}} 
            p {{ $t('В Яндекс.Метрике в составной цели можно задать максимум 5 шагов, поэтому, если вы хотите отслеживать каждый вопрос, создайте для них отдельные воронки, или не используйте составные цели.')}}
            a(@click.prevent="modal = true" href="#") {{ $t('Смотреть пример') }}

          table.table
            thead
              tr
                th {{ $t('Описание') }}
                th {{ $t('Идентификатор цели') }}
            tbody
              tr
                td
                  input.form-control(readonly :value="$t('Посетитель открыл квиз')" @click="$event.target.select()")
                td
                  input.form-control(readonly value="marquiz-start" @click="$event.target.select()")
              tr
                td
                  input.form-control(readonly :value="$t('Посетитель прошёл вопрос N')"
                      @click="$event.target.select()")
                  | {{ $t('где N - порядковый номер вопроса. Например, marquiz-step2. Необязательно.') }}
                td
                  input.form-control(readonly value="marquiz-stepN" @click="$event.target.select()")
              tr
                td
                  input.form-control(readonly :value="$t('Посетитель дошёл до формы контактов')" @click="$event.target.select()")
                td
                  input.form-control(readonly value="marquiz-form" @click="$event.target.select()")
              tr
                td
                  input.form-control(readonly :value="$t('Посетитель заполнил форму контактов (1-й шаг)')" @click="$event.target.select()")
                td
                  input.form-control(readonly value="marquiz-contacts1" @click="$event.target.select()")
              //- tr
              //-   td
              //-     input.form-control(readonly :value="$t('Посетитель заполнил форму контактов (2-й шаг)')" @click="$event.target.select()")
              //-   td
              //-     input.form-control(readonly value="marquiz-contacts2" @click="$event.target.select()")
              tr
                td
                  input.form-control(readonly :value="$t('Посетитель увидел страницу \"спасибо\"')" @click="$event.target.select()")
                td
                  input.form-control(readonly value="marquiz-finish" @click="$event.target.select()")

        hr

        h4 {{ $t('Google Analytics')}} 
          CSwitch(type="3d" variant="primary" v-model="ga")

        template(v-if="ga")          
          label {{ $t('Идентификатор отслеживания') }}
            b-row
              b-form-group(:description="$t('Администратор / Код отслеживания : Идентификатор отслеживания')")
                input.form-control(v-model="gaId" placeholder="UA-111111111-1" ref="gaInput")

          h6 {{ $t('Как настроить воронку прохождения квиза в Google Analytics') }}:
          ol
            li 
              a(href="https://analytics.google.com/analytics/web/" target="_blank") {{ $t('В Google Analytics') }}
              |  {{ $t('перейдите в Администратор / Цели.') }} 
            li {{ $t('Нажмите "Импортировать из галереи" и в поиске напишите "Marquiz".') }}
            li {{ $t('Выберите "Прохождение квиза Marquiz" и нажмите "Импортировать". Составная цель автоматически создастся.') }} 
            li {{ $t('Вы можете отредактировать цель под свои нужды, удалить лишние шаги.') }} 
          p {{ $t('Когда накопится достаточное количество данных, вы сможете смотреть воронку прохождения квиза в разделе "Конверсии / Визуализация" ') }}


    modal(v-model="modal" large)
      img(src="/static/img/metrika-setup.png")
      div(slot="modal-footer")
      
</template>

<script>
  import _ from 'lodash'

  export default {
    props: {
      value: Object
    },
    data () {
      return {
        metrika: !!_.get(this.value, 'metrika.id'),
        ga: !!_.get(this.value, 'ga.id'),
        metrikaId: _.get(this.value, 'metrika.id'),
        gaId: _.get(this.value, 'ga.id'),
        modal: false
      }
    },
    computed: {
      settings () {
        return {
          metrika: {
            id: this.metrikaId
          },
          ga: {
            id: this.gaId
          }
        }
      }
    },
    watch: {
      settings (v) {
        this.$emit('input', v)
      },
      ga (v) {
        if (!v) {
          this.gaId = null
        } else {
          this.$nextTick(() => {
            this.$refs.gaInput.focus()
          })
        }
      },
      metrika (v) {
        if (!v) {
          this.metrikaId = null
        } else {
          this.$nextTick(() => {
            this.$refs.metrikaInput.focus()
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  .analytic
    .table
      input[readonly]
        background: #fff
</style>



// WEBPACK FOOTER //
// Analytic.vue?6ff5cc02