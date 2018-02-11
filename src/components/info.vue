<template lang="pug">
  div
    .form-group.input-group.input-group-lg
      input(type="text" :placeholder="$t('Заголовок квиза')" class="form-control" v-model="title")
      HelpTooltip(:text="$t('Его увидит пользователь в окне квиза. Например, \"Пройди тест и узнай, какой велосипед подойдет для тебя\"')")
    .form-group.input-group.input-group-sm
      input(type="text" :placeholder="$t('Имя квиза')" class="form-control" v-model="name")
      HelpTooltip(:text="$t('Его увидите только вы в разделе \"Мои квизы\". Это исключительно для вашего удобства ;)')")
</template>

<script>
  export default {
    data () {
      return {
        title: this.value.title,
        name: this.value.name
      }
    },
    props: {
      value: Object
    },
    watch: {
      title (title) {
        this.$emit('input', Object.assign({}, this.value, { title }))
      },
      name (name) {
        this.$emit('input', Object.assign({}, this.value, { name }))
      }
    }
  }
</script>



// WEBPACK FOOTER //
// Info.vue?209d5484