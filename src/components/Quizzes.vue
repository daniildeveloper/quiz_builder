<template lang="pug">
  .animated.fade-in(v-if='loaded')

    .card(v-if='!quizzes.length')
      .card-block
        h3 Добро пожаловать :)
        p Посмотрите это небольшое видео, чтобы начать создавать квиз
        iframe(
          width='560', height='315', src='https://www.youtube.com/embed/X0qrZ1jz3ss?autoplay=1',
          frameborder='0', allowfullscreen=''
        )
        br
        br
        h5 А также �� нас есть:
        | - интеграция с AmoCRM и Webhook'и
        br
        | - интеграция с Яндекс.Метрикой, где можно отслеживать конверсию по каждому шагу прохождения квиза
        br
        | - интерфейс квиза в любом цвете и на разных языках
        .mt-4
          button.btn.btn-primary.btn-lg(@click="$router.push('quizzes/edit')")
            | {{ $t('Создать квиз') }}

    .quizzes__buttons(v-if='quizzes.length')
      button.btn.btn-primary.btn-lg(@click="$router.push('quizzes/edit')")
        | {{ $t('Создать квиз') }}
        i.fa.fa-plus

    b-row(v-if="quizzes.length")
      b-col(:sm="6" v-for="quiz, i in quizzes" :key="i")
        b-card.quizzes__quiz
          .card-block
            h6.card-title {{ quiz.info.name || quiz.info.title }}

          .card-footer
            b-row
              b-col(:sm="6")
                b-btn.my-1(variant="warning" block :to='`quizzes/answers/${quiz.id}`')
                  i.fa.fa-list-alt
                  | &nbsp;
                  | {{ $t('Заявки') }}

              b-col.quizzes__quiz-edit-section(:sm="6")
                b-btn.quizzes__quiz-edit.my-1(variant="secondary" :to='`quizzes/edit/${quiz.id}`')
                  span
                    | {{ $t('Редактировать') }}&nbsp;
                  i.fa.fa-edit
                b-btn.my-1.pull-right(variant="link" v-b-modal.confirmDelete="" @click="chooseDelete(quiz, i)")
                  span
                  i.fa.fa-trash

    b-modal#confirmDelete(
      hide-header,
      :ok-title="$t('Удалить')",
      ok-variant="danger",
      :cancel-title="$t('Нет')",
      @ok="deleteQuiz",
      @cancel="deletingQuiz = null",
      v-if="deletingQuiz",
      centered,
    )
      h4 {{ $t('Точно удалить этот квиз?')}}
      b-alert(variant="secondary" show)
        | {{ deletingQuiz.quiz.info.title }}
      b {{ $t('Восстановление будет невозможно') }}

</template>


<script>
  export default {
    beforeMount () {
      this.load()
    },
    data () {
      return {
        quizzes: [],
        loaded: true,
        deletingQuiz: null
      }
    },
    methods: {
      load () {
        this.loaded = false
        this.$axios.get('v1/Quizzes').then(data => {
          this.quizzes = data.data
          this.loaded = true
        })
      },
      chooseDelete (quiz, index) {
        this.deletingQuiz = {
          quiz, index
        }
      },
      // Удаляет квиз
      deleteQuiz (leed, i) {
        this.$axios.delete(`v1/quizzes/${this.deletingQuiz.quiz.id}`).then(res => {
          this.$delete(this.quizzes, this.deletingQuiz.index)
          this.deletingQuiz = null
        })
      }
    }
  }
</script>

<style lang="stylus">
  .quizzes
    &__buttons
      margin-bottom: 1.5rem;

    &__quiz
      .btn-warning
        color: #000

    &__quiz-edit-section
      display flex
      justify-content flex-end

    &__quiz-edit
      span
        @media (max-width: 1023px)
          display: none


</style>



// WEBPACK FOOTER //
// Quizzes.vue?91cdf0da