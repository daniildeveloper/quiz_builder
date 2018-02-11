<template lang="pug">
  .card
    .card-block(v-if="status === 'success'")
      alert(type="success") {{ $t('Оплата зачислена успешно!') }}
      h4(v-if="status === 'success'") {{ $t('Ваш баланс') }}: {{ $t('{count} контактов', { count: balance }) }}
      router-link.btn.btn-primary(to="/quizzes") {{ $t('Перейти в квизы') }}
    
    .card-block(v-if="status === 'fail'")
      alert(type="danger") {{ $t('Оплата не прошла.') }}
      router-link.btn.btn-primary(to="/balance") {{ $t('Попробовать снова') }}
</template>


<script>
  import { mapState } from 'vuex'

  export default {
    mounted () {
      console.log(this.status)
      this.$store.dispatch('user/requestBalance')
      if (this.status === 'success') {
        this.$analytic.event('payment-success')
      } else {
        this.$analytic.event('payment-fail')
      }
    },
    data () {
      return {
        status: this.$route.params.status
      }
    },
    computed: {
      ...mapState('user', ['balance', 'email', 'info', 'id'])
    }
  }
</script>



// WEBPACK FOOTER //
// Payment.vue?f9a0b322