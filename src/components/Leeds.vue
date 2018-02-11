<template lang="pug">
  div
    div(v-if='loaded')
      h3.leeds__title
        | {{ quiz.info.title || $t('Без названия') }}
        router-link.leeds__editBtn.small(:to='`/quizzes/edit/${quiz.id}`') &nbsp;
          i.icon-pencil
      .alert.alert-info(v-if='!leeds.length') {{ $t('Ответов пока нет') }}
      .card.leeds(v-if='leeds.length')
        .card-header
          b {{ $t('Ответы на квиз') }}
          .card-actions
            a.btn-setting(:title="$t('Обновить')", @click.prevent='load')
              i.icon-reload
        .card-block
          .table-responsive
            table.table.table-striped
              transition-group(tag="tbody" name="fade")
                tr(v-for='(leed, i) in leeds' :key="leed.id")
                  td(v-if='hasFieldEmail') {{ leed.contacts.email }}
                  td(v-if='hasFieldName') {{ leed.contacts.name }}
                  td(v-if='hasFieldPhone') {{ leed.contacts.phone }}
                  td {{ formatDate(leed.created) }}
                  td
                    span.badge.badge-warning(v-if='!leed.paid') {{ $t('новый') }}
                  td.text-center
                    button.btn(:class="{ 'btn-danger': !leed.paid, 'btn-default': leed.paid }", @click='showAnswers(leed, i)')
                      span.d-xl-inline-block.d-none
                        | {{ $t('Показать ответы и контакты') }}&nbsp;
                      span.visible-xs.hidden-sm
                        i.fa.fa-eye
                  td
                    b-btn(v-b-modal.confirmDelete="" @click="chooseDeleteAnswer(leed, i)")
                      i.fa.fa-trash(:title="$t('удалить')")

            infinite-loading(@infinite="infiniteHandler" spinner="bubbles" force-use-infinite-wrapper="true")
              span(slot="no-more") {{ $t('Пока что это все ответы, но это только начало! ;)') }}
              //- span(slot="spinner")
                  // <td class="text-muted">
                  // <i class="fa fa-eye" v-if="leed.paid" :title="$t('просмотрено')"></i>
                  // <i class="fa fa-eye-slash" v-if="!leed.paid" :title="$t('не просмотрено')"></i>
                  // </td>
        modal(:title="$t('Ответы клиента')", v-model='modal', @ok='modal = false', effect='fade/zoom')
          .modal-header(slot='modal-header')
            div(v-if='user.contacts')
              template(v-if='user.contacts.name')
                p
                  b {{ $t('Имя') }}
                  | : {{ user.contacts.name }}
              template(v-if='user.contacts.email')
                p
                  b {{ $t('Email') }}
                  | : {{ user.contacts.email }}
              template(v-if='user.contacts.phone')
                p
                  b {{ $t('Телефон') }}
                  | : {{ user.contacts.phone }}
          dl(v-if='user.answers')
            template(v-for='answer in user.answers')
              dt {{ answer.q }}
              dd {{ answer.a }}

          hr
          b-row
            b-col(sm="4") 
              b {{ $t('Время заявки:')}}
            b-col(sm="8") {{ user.created }}
          template(v-if="extraDiscount")
            b-row
              b-col(sm="4") 
                b {{ $t('Скидка:')}}
              b-col(sm="8") {{ extraDiscount }}₽
          template(v-if="extraUtm")
            b-row.mt-3
              b-col(sm="4") 
                b {{ $t('UTM-метки:') }}
              b-col(sm="8")
                div(v-for="utmValue, utmName in extraUtm")
                  i {{ utmName }}
                  span : {{ utmValue }}
          div(slot='modal-footer')

        alert(v-model='isError', placement='top', :duration='3000', type='danger', width='400px', dismissable='')
          span.icon-info-circled.alert-icon-float-left
          strong {{ error }}
          p {{ $t('Пополните баланс') }}

        b-modal#confirmDelete(
          hide-header,
          :ok-title="$t('Удалить')",
          ok-variant="danger",
          :cancel-title="$t('Нет')",
          @ok="deleteAnswer",
          @cancel="deletingAnswer = null",
          v-if="deletingAnswer",
          centered,
        )
          h4 {{ $t('Точно удалить эту заявку?')}}
          b-alert(variant="secondary" show)
            div(v-for="contact in deletingAnswer.leed.contacts") {{ contact }}

</template>

<script>
  import moment from 'moment'
  import _ from 'lodash'
  import InfiniteLoading from 'vue-infinite-loading'

  export default {
    components: {
      InfiniteLoading
    },
    props: {
      id: String
    },
    beforeMount () {
      this.load()
    },
    data () {
      return {
        leeds: [],
        answers: [],
        quiz: {},
        modal: false,
        user: {},
        loaded: false,
        isError: false,
        error: '',
        page: 1,
        limit: 15,
        //
        deletingAnswer: null
      }
    },
    computed: {
      hasFieldEmail () {
        return this.hasField('email')
      },
      hasFieldPhone () {
        return this.hasField('phone')
      },
      hasFieldName () {
        return this.hasField('name')
      },
      extraDiscount () {
        return _.get(this.user, 'extra.discount')
      },
      extraUtm () {
        return _.get(this.user, 'extra.utm')
      }
    },
    methods: {
      infiniteHandler ($state) {
        setTimeout(() => {
          this.getQuizes()
          if (this.allLeedsLoaded) {
            $state.complete()
          } else {
            $state.loaded()
          }
        }, 500)
      },
      // Проверка, включено ли в квизе поле
      hasField (key) {
        // Если поля не сохранены в кв��зе
        if (!this.quiz.info.form.fields1) return true
        let result = false
        this.quiz.info.form.fields1.forEach(v => {
          if (v.key === key && v.enabled) result = true
        })
        this.quiz.info.form.fields2.forEach(v => {
          if (v.key === key && v.enabled) result = true
        })
        return result
      },
      // Загрузить данные
      getQuizes () {
        this.$axios.get(`v1/quizzes/${this.id}/answers/`, {
          params: {
            filter: {
              order: 'created DESC',
              limit: this.limit,
              skip: this.page * this.limit
            }
          }
        }).then(res => {
          if (res.data.length < this.limit) {
            this.allLeedsLoaded = true
          }
          this.leeds = this.leeds.concat(res.data)
          this.page++
        })
      },
      load () {
        this.loaded = false
        const promise = new Promise((resolve, reject) => {
          // Специальная конструкция, чтобы дождаться ответов из трех запросов
          let cr = 1
          const r = () => {
            cr++
            if (cr === 3) {
              resolve()
            }
          }
          this.$axios.get(`v1/quizzes/${this.id}/answers/`, {
            params: {
              filter: {
                order: 'created DESC',
                limit: this.limit
              }
            }
          }).then(res => {
            this.leeds = res.data
            r()
          })

          this.$axios.get(`v1/quizzes/${this.id}`).then(res => {
            this.quiz = res.data
            r()
          })
        })

        promise.then(() => {
          this.loaded = true
        })
      },
      // Форматировать дату
      formatDate (value) {
        return moment(value).fromNow()
      },
      // Показать ответы клиента
      showAnswers (leed, i) {
        this.user = {}
        if (leed.paid) {
          this.user = this._getAnswer(leed)
          this.modal = true
        } else {
          this.$axios.get(`v1/quizzes/${this.id}/buyLeed/${leed.id}`).then(res => {
            if (res.data) {
              const leed = res.data
              this.$analytic.event('buy-leed')
              this.user = this._getAnswer(leed)

              this.$set(this.leeds, i, leed)
              this.$store.commit('user/decrementBalance')
            }
            this.modal = true
          }).catch(err => {
            if (err.response) {
              this.error = err.response.data.error.message
              this.isError = true
            }
          })
        }
      },
      // Подтверждение удаления
      chooseDeleteAnswer (leed, index) {
        this.deletingAnswer = {
          leed,
          index
        }
      },
      // Удаляет лид
      deleteAnswer (leed, i) {
        this.$axios.delete(`v1/quizzes/${this.deletingAnswer.leed.quizId}/answers/${this.deletingAnswer.leed.id}`).then(res => {
          this.$delete(this.leeds, this.deletingAnswer.index)
          this.deletingAnswer = null
        })
      },
      // Возвращает ответ клиента, готовый для отображения
      _getAnswer (leed) {
        return {
          answers: this._formatAnswers(leed.answers2),
          contacts: leed.contacts,
          extra: leed.extra,
          created: moment(leed.created).format('LLLL')
        }
      },
      // Форматирует ответы вида вопрос - ответы (без id)
      _formatAnswers (leedAnswers) {
        for (let qId in leedAnswers) {
          let a = leedAnswers[qId]
          if (typeof a.a !== 'string') {
            leedAnswers[qId]['a'] = a.a.join(', ')
          }
        }
        return leedAnswers
      }
    }
  }
</script>

<style lang="stylus">
  .leeds
    @media (max-width: 767px)
      margin: auto -15px;
    &__title
      color: #fff
    &__editBtn
      color: #fff
      opacity: 0.6
      &:hover, &:focus
        opacity: 1
        color:   #fff
</style>



// WEBPACK FOOTER //
// Leeds.vue?1e60b394