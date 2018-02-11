<template lang="pug">
  .animated.fade-in
    .row
      .col-sm-8
        .card
          .card-block
            QuizInfo(v-model="q.info")
        div(v-dragula="questions" drake="questions")
          .card(v-for="(question, i) in questions" :key="question.id")
            .card-header(@click.prevent="collapse(i)")
              .edit__questionNumber №{{ i + 1 }} &nbsp;
              .edit__questionTitle(v-show="question.collapsed && (question.name || question.title)") {{ question.name || question.title }}
              div(v-show="!question.collapsed || !question.title") &nbsp;
              .card-actions
                a.btn-close(:title="$t('Удалить')" @click.prevent.stop="remove(i)")
                  i.icon-trash
                a.btn-setting(v-if="!question.collapsed" :title="$t('Свернуть')" @click.prevent.stop="collapse(i)")
                  .icon-minus
                a.btn-setting(v-if="question.collapsed" :title="$t('Развернуть')" @click.prevent.stop="collapse(i)")
                  .icon-plus
                a.btn-minimize.drag(:title="$t('Переместить. Сверните вопросы для удобства')" @click.stop="")
                  i.fa.fa-arrows.drag
            .card-block(v-show="!question.collapsed")
              Question(:data="question" @input="editQuestion(i, $event)")

        button.btn.btn-primary.btn-mb(@click="addQuestion" :disabled="questionLimit") {{ $t('Добавить вопрос') }}
           i.fa.fa-plus

      .col-sm-4
        .card
          .card-header {{ $t('Консультант') }}
          .card-block
            Assistant(v-model="q.info.assistant")

</template>

<script>
  import Vue from 'vue'
  import Question from '@/components/quiz/Question'
  import QuizInfo from '@/components/quiz/Info'
  import Assistant from '@/components/quiz/Assistant'

  export default {
    components: {
      Question, QuizInfo, Assistant
    },
    created () {
      // Конфигурация drag'n'drop
      const service = Vue.$dragula.$service
      service.options('questions', {
        direction: 'vertical',
        moves: function (el, container, handle) {
          return handle.classList.contains('drag')
        }
      })
    },
    mounted () {
      if (!this.q.questions.length) this.addQuestion()
    },
    props: {
      id: String,
      quiz: Object
    },
    data () {
      return {
        maxQuestions: 10,
        message: null
      }
    },
    computed: {
      q: {
        get () {
          return this.quiz
        },
        set (v) {
          this.$emit('input', v)
        }
      },
      questionLimit () {
        return this.q.questions.length >= this.maxQuestions
      },
      questions () {
        return this.q.questions
      }
    },
    methods: {
      // Добавить вопрос
      addQuestion () {
        if (!this.questionLimit) {
          Vue.set(this.q.questions, this.q.questions.length, {
            title: '',
            text: '',
            select: 'one',
            answers: [],
            type: 'answers',
            options: {}
          })
        }
      },
      // Редактировать вопрос
      editQuestion (i, value) {
        this.$set(this.q.questions, i, Object.assign({}, this.q.questions[i], value))
      },
      // Удалить вопрос
      remove (i) {
        Vue.delete(this.q.questions, i)
      },
      // Свернуть вопрос
      collapse (i) {
        this.$set(this.q.questions[i], 'collapsed', !this.q.questions[i].collapsed)
      }
    }
  }
</script>

<style lang="stylus">
  .btn-mb
    margin-bottom: 1.5rem

  .drag
    cursor: move

  .edit__questionTitle
    float: left
    @media (max-width: 767px)
      max-width: 100px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis

  .edit__questionNumber
    float: left

  .card-actions
    a
      cursor: pointer
      &.btn-close
        i
          transition: all .2s ease
        &:hover
          color: #f86c6b
          i
            font-size: 16px
      &.btn-setting
        &:hover
          .icon-minus
            transition: all .2s ease
            font-size: 16px
          .icon-plus
            transition: all .2s ease
            font-size: 16px
      &.btn-minimize
        &:hover
          i
            transition: all .2s ease
            font-size: 16px
</style>



// WEBPACK FOOTER //
// Edit.vue?58c86584