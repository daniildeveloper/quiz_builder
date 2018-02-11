<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-block p-4">
                <h1>{{ $t('Регистрация') }}</h1>
                <p class="text-muted">{{ $t('Создайте аккаунт') }}</p>

                <div class="alert alert-danger" v-if="errors" v-for="error in errors">
                  {{ error }}
                </div>

                <form action="" @submit.prevent="register" v-if="step === 1">
                  <div class="input-group mb-3">
                    <span class="input-group-addon">@</span>
                    <input type="email" class="form-control" :placeholder="$t('Email')" v-model="email" v-focus>
                  </div>

                  <div class="input-group mb-3">
                    <span class="input-group-addon"><i class="icon-lock"></i></span>
                    <input type="password" class="form-control" :placeholder="$t('Пароль')" v-model="password">
                  </div>

                  <button type="submit" class="btn btn-block btn-success">{{ $t('Создайте аккаунт') }}</button>
                </form>

                <div v-if="step === 2">
                  <h3 class="">{{ $t('Шаг 2') }}</h3>
                  <UserInfoForm :user="user"/>
                </div>

              </div>
            </div>
            <div class="card card-inverse card-primary py-5 d-md-down-none" style="width:44%">
              <div class="card-block text-center">
                <div>
                  <h2>{{ $t('Вход') }}</h2>
                  <p>{{ $t('Если у вас уже есть аккаунт, войдите') }}</p>
                  <button type="button" class="btn btn-primary active mt-3" @click="$router.push('/signin')">{{ $t('Войти') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--<div class="card-footer p-4">-->
          <!--<div class="row">-->
            <!--<div class="col-6">-->
              <!--<button class="btn btn-block btn-facebook" type="button"><span>facebook</span></button>-->
            <!--</div>-->
            <!--<div class="col-6">-->
              <!--<button class="btn btn-block btn-twitter" type="button"><span>twitter</span></button>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
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
    name: 'Register',
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
      register () {
        this.errors = []

        this.$auth.signup({
          email: this.email,
          password: this.password
        }).then((user, token) => {
          this.$analytic.event('register')
          this.user = user
          this.step = 2
        }).catch(error => {
          this.errors.push(error.message)
        })
      }
    }
  }
</script>



// WEBPACK FOOTER //
// Register.vue?9aa8697c