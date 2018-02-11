<template lang="pug">
  .answer
    ImageUpload(:image="answer.image" @input="changeFile($event)" modifier="w180-h240-cscale")
    input.answer__input.form-control(type="text" :value="answer.title" @input="changeAnswer($event.target.value)" @focus="$event.target.select()")
</template>

<script>
  import ImageUpload from '@/components/ImageUpload'

  export default {
    components: {
      ImageUpload
    },
    props: {
      answer: Object
    },
    methods: {
      changeAnswer (e) {
        this.$set(this.answer, 'title', e)
        this.emit()
      },
      changeFile (v) {
        this.$set(this.answer, 'image', v)
        this.emit()
      },
      emit () {
        this.$emit('input', this.answer)
      }
    }
  }
</script>

<style lang="less">
  .answer {
    display: flex;
    flex-direction: row;
  }
</style>



// WEBPACK FOOTER //
// Answer.vue?58ee41a7