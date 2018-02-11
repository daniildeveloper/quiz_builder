<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-block">
                <h1>{{ $t('Восстановление пароля') }}</h1>
                <p class="text-muted">{{ $t('Введите Ваш email') }}</p>

                <div class="alert alert-danger" v-if="errors" v-for="error in errors">
                  {{ error }}
                </div>

                <form action="" @submit.prevent="requestPassword" v-if="!requested">
                  <div class="input-group mb-4">
                    <div class="input-group mb-3">

                      <span class="input-group-addon"><i class="icon-envelope"></i></span>
                      <input type="text" v-focus class="form-control" :placeholder="$t('Ваш Email')" v-model="email">
                    </div>

                  </div>
                  <div class="row">
                    <div class="col-6">
                      <button type="submit" class="btn btn-primary px-4" :disabled="!email">
                        {{ $t('Сменить пароль') }}
                      </button>
                    </div>
                  </div>
                </form>

                <div v-if="requested">
                  <alert type="success">
                    {{ $t('На Ваш email {email} отправлена ссылка для восстановления пароля', { email: email }) }}
                  </alert>
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
  export default {
    data () {
      return {
        email: '',
        errors: [],
        user: {},
        requested: false
      }
    },
    mounted () {
      this.$auth.setAccessToken(this.$route.query['access_token'])
    },
    methods: {
      requestPassword () {
        this.errors = []

        this.$auth.requestPassword({ email: this.email }).then(res => {
          this.$analytic.event('request-password')
          this.requested = true
        }).catch(error => {
          if (error.response) {
            this.errors.push(error.response.data.error.message)
          }
        })
      }
    }
  }
</script>



// WEBPACK FOOTER //
// RequestPassword.vue?6bc5041b