<template lang="pug">
  .question
    .form-group.input-group.input-group-lg
      //- label {{ $t('Заголовок квиза') }} 
      input(type="text" :placeholder="$t('Вопрос')" class="form-control" v-model="question")
      HelpTooltip(:text="$t('Например, \"Для каких целей Вы подбираете велосипед?\"')")
    .form-group.input-group
      textarea(:placeholder="$t('Подсказка')"
                id="" cols="30" rows="3"
                v-model="text"
                class="form-control")
      HelpTooltip(:text="$t('Подсказка будет показываться от лица консультанта справа')")
      
    b-tabs(pills card vertical v-model="variant")
      b-tab(:title="$t('Варианты ответов')")
        .alert.alert-dark {{ $t('Чтобы прикрепить картинки, нажмите на иконку с фотоаппаратом слева от вопроса') }}
    
        div(v-dragula="answers" drake="answers")
          .question__answerGroup.form-group(v-for="(answer, i) in answers" :key="answer.id")
            .question__answer
              Answer(:answer="answer" @input="changeAnswer(i, $event)" :index="i")
              button.btn.btn-link.question__deleteAnswer(@click="deleteAnswer(i)" tabindex="-1")
                i.fa.fa-trash
            i.fa.fa-arrows.question__moveAnswer
        
        button.btn.btn-link(@click="addAnswer") 
          i.fa.fa-plus &nbsp;
          template {{ $t('Добавить вариант') }}
        .question__checkboxes.form-actions.text-right
          .checkbox
            label {{ $t('Можно несколько') }} 
              input(type="checkbox" v-model="many")
          .checkbox
            label {{ $t('Позволить пользователю вводить свой ответ') }} 
              input(type="checkbox" v-model="other")

      b-tab(:title="$t('Своё поле для ввода')")
        p {{ $t('Здесь пользователь вместо выбора вариантов ответа увидит поле для ввода значения') }}
        b-form-group(:label="$t('Название поля для ввода (пример ответа)')")
          b-form-input(v-model="placeholder")
      

</template>

<script>
  import Answer from './Answer'

  export default {
    components: {
      Answer
    },
    beforeMount () {
      this.addEmptyAnswer()
    },
    props: {
      data: Object
    },
    data () {
      return {
        question: this.data.title,
        answers: this.getAnswers(),
        text: this.data.text,
        many: this.data.select === 'many',
        maxCount: 8,
        variant: this.data.type === 'input' ? 1 : 0,
        placeholder: this.data.options ? this.data.options.placeholder : null,
        other: this.data.other
      }
    },
    methods: {
      getAnswers () {
        return this.data.answers || []
      },
      // Изменить варианты ответов
      changeAnswer (i, answer) {
        if (answer.title) {
          this.$set(this.answers, i, answer)
        }

        // Добавляем дополнительное поле
        if (i === this.answers.length - 1) this.addEmptyAnswer()
        this.emit()
      },
      // Добавляет ответ
      addAnswer () {
        this.answers.push({ title: '' })
        // TODO фокус
//        this.$nextTick(() => {
//          this.$children[this.answers.length - 1].$el.focus()
//        })
      },
      addEmptyAnswer () {
        if (!this.answers.length || (this.answers.length < this.maxCount && !!this.answers[this.answers.length - 1].title)) {
          this.answers.push({ title: '' })
        }
      },
      deleteAnswer (i) {
        this.$delete(this.answers, i)
      },
      // Вызов события изменения
      emit () {
        const answers = []
        this.answers.forEach((v, k) => {
          if (v.title) {
            answers.push(v)
          }
        })
        const type = this.getType(this.variant)
        const options = {
          placeholder: this.placeholder
        }

        this.$emit('input', {
          title: this.question,
          text: this.text,
          select: this.many ? 'many' : 'one',
          answers,
          type,
          options,
          other: this.other
        })
      },
      // Возвращает тип вопроса по выбранному варианту
      getType (variant) {
        return ['answers', 'input'][variant]
      }
    },
    watch: {
      question () {
        this.emit()
      },
      many () {
        this.emit()
      },
      text () {
        this.emit()
      },
      answers () {
        this.emit()
      },
      placeholder () {
        this.emit()
      },
      variant () {
        this.emit()
      },
      other () {
        this.emit()
      }
    }
  }
</script>

<style lang="stylus">
  .question
    &__answer
      position: relative

    &__deleteAnswer
      position: absolute
      top: 0
      right: 0
    
    &__answerGroup
      display flex
      
    &__answer
      flex 1 1 95%

    &__moveAnswer
      flex 1 1 20px
      padding 8px 16px
      cursor move
      color: #ccc

    &__checkboxes
      @media (min-width: 1024px)
        white-space nowrap
</style>



// WEBPACK FOOTER //
// Question.vue?644ec824