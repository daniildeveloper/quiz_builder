<template>
  <div class="">

      <form action="" @submit.prevent="send">

        <div class="form-group">
          <input type="text" :placeholder="$t('Имя')" class="form-control" v-focus v-model="name">
          <span class="help-block">{{ $t('') }}</span>
        </div>

        <div class="form-group">
          <input type="text" :placeholder="$t('Телефон')" class="form-control" v-model="phone">
          <span class="help-block text-muted">{{ $t('для проверки, что Вы не робот') }}</span>
        </div>

        <div class="row">
          <div class="col-6">
            <button type="submit" class="btn btn-primary px-4">{{ $t('Далее') }}</button>
          </div>
        </div>
      </form>

  </div>
</template>

<script>
  /**
   * Форма для заполнения дополнительной информации о пользователе
   */
  export default {
    props: {
      user: Object
    },
    data () {
      return {
        name: this.user.info ? this.user.info.name : '',
        phone: this.user.info ? this.user.info.phone : ''
      }
    },
    methods: {
      send () {
        if (this.name || this.phone) {
          this.$axios.patch(`v1/users/${this.user.id}`, {
            info: {
              name: this.name, phone: this.phone
            }
          }).then(res => {
            this.$router.push('/')
          })
        } else {
          this.$router.push('/')
        }
      }
    }
  }
</script>



// WEBPACK FOOTER //
// UserInfoForm.vue?da0c8b7c