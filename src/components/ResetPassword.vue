<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-sm-8">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-block">
                <h1>{{ $t('Восстановление пароля') }}</h1>
                <p class="text-muted">{{ $t('Введите новый пароль') }}</p>

                <div class="alert alert-danger" v-if="errors" v-for="error in errors">
                  {{ error }}
                </div>

                <form action="" @submit.prevent="changePassword">
                  <div class="input-group mb-4">
                    <span class="input-group-addon"><i class="icon-lock"></i></span>
                    <input type="password" v-focus class="form-control"
                           :placeholder="$t('Новый пароль')" v-model="password">

                  </div>
                  <div class="row">
                    <div class="col-6">
                      <button type="submit" class="btn btn-primary px-4" :disabled="!isPasswordStrong">
                        {{ $t('Сменить пароль') }}
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        password: '',
        errors: [],
        user: {}
      }
    },
    mounted () {
      this.$auth.setAccessToken(this.$route.query['access_token'])
    },
    methods: {
      changePassword () {
        this.errors = []

        this.$auth.resetPassword({ newPassword: this.password }).then(res => {
          this.$analytic.event('change-password')
          this.$router.push('/')
        }).catch(error => {
          if (error.response) {
            this.errors.push(error.response.data.error.message)
          }
        })
      }
    },
    computed: {
      isPasswordStrong () {
        return this.password.length > 5
      }
    }
  }
</script>



// WEBPACK FOOTER //
// ResetPassword.vue?1e078834