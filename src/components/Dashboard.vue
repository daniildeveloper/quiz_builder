<template>
  <div class="animated fadeIn">
    <div class="alert alert-info">
      Здесь скоро будет выводиться статистика по Вашим квизам
    </div>

    <div class="card">
      <div class="card-header">
        Пожалуйста, подтвердите аккаунт:
      </div>
      <div class="card-block">
        <UserInfoForm :user="{}"/>
      </div>
    </div>

    <button class="btn btn-primary btn-lg" @click="$router.push('quizzes/edit')">
      {{ $t('Создать квиз') }}
    </button>
  </div>
</template>

<script>
  import UserInfoForm from '@/components/UserInfoForm'

  export default {
    components: {
      UserInfoForm
    },
    name: 'dashboard',
    methods: {
      changeLang () {
        this.$store.commit('')
      }
    }
  }
</script>



// WEBPACK FOOTER //
// Dashboard.vue?65fdb49f