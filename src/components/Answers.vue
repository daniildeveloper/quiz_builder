<template>
  <div>
    <Leeds :id="id"/>
  </div>
</template>

<script>
  import Leeds from '@/components/quiz/Leeds'

  export default {
    components: {
      Leeds
    },
    data () {
      return {
        id: this.$route.params.id
      }
    }
  }
</script>



// WEBPACK FOOTER //
// Answers.vue?07abb8f8