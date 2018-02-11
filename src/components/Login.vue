<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-block">
                <h1>{{ $t('Вход') }}</h1>
                <p class="text-muted">{{ $t('Войдите в ваш аккаунт') }}</p>

                <div class="alert alert-danger" v-if="errors" v-for="error in errors">
                  {{ error }}
                </div>

                <form action="" @submit.prevent="login" v-if="step === 1">
                  <div class="input-group mb-3">
                    <span class="input-group-addon"><i class="icon-envelope"></i></span>
                    <input type="email" v-focus class="form-control" :placeholder="$t('Email')" v-model="email">
                  </div>
                  <div class="input-group mb-4">
                    <span class="input-group-addon"><i class="icon-lock"></i></span>
                    <input type="password" class="form-control" :placeholder="$t('Пароль')" v-model="password">
                  </div>
                  <div class="row">
                    <div class="col-6">
                      <button type="submit" class="btn btn-primary px-4">{{ $t('Войти') }}</button>
                    </div>
                    <div class="col-6 text-right">
                      <router-link to="/request-password" class="btn btn-link px-0">{{ $t('Забыли пароль?') }}</router-link>
                    </div>
                  </div>
                </form>

                <div v-if="step === 2">
                  <p class="">{{ $t('Пожалуйста, дополните информацию о себе') }}:</p>
                  <UserInfoForm :user="user"/>
                </div>

              </div>
            </div>
            <div class="card card-inverse card-primary py-5 d-md-down-none" style="width:44%">
              <div class="card-block text-center">
                <div>
                  <h2>{{ $t('Регистрация') }}</h2>
                  <p>{{ $t('Чтобы впервые начать создавать квизы, пройдите регистрацию') }}</p>
                  <button type="button" class="btn btn-primary active mt-3" @click="$router.push('/signup')">{{ $t('Зарегистрироваться сейчас!') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserInfoForm from '@/components/UserInfoForm'

  export default {
    components: {
      UserInfoForm
    },
    name: 'Login',
    data () {
      return {
        email: '',
        password: '',
        errors: [],
        step: 1,
        user: {}
      }
    },
    methods: {
      login () {
        this.errors = []

        this.$auth.signin({
          email: this.email,
          password: this.password
        }).then((user, token) => {
          this.$analytic.event('login')
          if (user.info && user.info.phone && user.info.name) {
            this.$store.commit('user/setInfo', user)
            this.$router.push('/')
          } else {
            this.user = user
            this.step = 2
          }
        }).catch(error => {
          this.errors.push(error.message)
        })
      }
    }
  }
</script>



// WEBPACK FOOTER //
// Login.vue?0e041484