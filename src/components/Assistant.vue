<template>
  <div class="assistant">

    <div class="assistant__avatar">
      <ImageUpload :image="avatar" @input="changeFile($event)" modifier="s80-cscale" size="medium"/>
    </div>

    <div class="assistant__info">
      <div class="form-group input-group">
        <input type="text" :placeholder="$t('Имя')" class="form-control" v-model="name">
      </div>

      <div class="form-group input-group">
        <input type="text" :placeholder="$t('Должность')" class="form-control" v-model="title">
      </div>
    </div>

  </div>
</template>

<script>
  import ImageUpload from '@/components/ImageUpload'

  export default {
    components: {
      ImageUpload
    },
    data () {
      return {
        title: this.value ? this.value.title : '',
        name: this.value ? this.value.name : '',
        avatar: this.value && this.value.avatar ? this.value.avatar : {}
      }
    },
    props: {
      value: Object
    },
    methods: {
      changeFile (v) {
        this.avatar = v
      }
    },
    watch: {
      name (val) {
        this.$emit('input', Object.assign({}, this.value, { name: val }))
      },
      title (val) {
        this.$emit('input', Object.assign({}, this.value, { title: val }))
      },
      avatar (val) {
        this.$emit('input', Object.assign({}, this.value, { avatar: val }))
      }
    }
  }
</script>

<style lang="stylus">
  .assistant
    display flex
    flex-wrap wrap
    &__avatar
      margin-bottom 1rem
      flex 0 1 70px
    &__info
      flex 1 1 70%
</style>



// WEBPACK FOOTER //
// Assistant.vue?42c7829e