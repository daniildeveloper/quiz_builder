<template>
  <div class="animated fadeIn">
    <div class="card">
      <div class="card-header">
        {{ $t('Посмотрите короткую видеоинструкцию') }}:
      </div>
      <div class="card-block">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/6Qd_dDJLYfk" frameborder="0" allowfullscreen></iframe>
        <p>{{ $t('Осталось что-то непонятно? Напишите нам в чате в нижнем углу. Будем рады помочь!') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'help',
  methods: {
    changeLang () {
      this.$store.commit('')
    }
  }
}
</script>



// WEBPACK FOOTER //
// Help.vue?7bbf71bd