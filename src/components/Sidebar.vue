<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav">
        <li class="nav-item">
          <router-link :to="'/quizzes'" class="nav-link">
            <i class="icon-list"></i> {{ $t('Мои квизы') }}
          </router-link>
        </li>
        <li class="nav-title">
          {{ $t('Справка') }}
        </li>
        <li class="nav-item">
          <router-link :to="'/help'" class="nav-link">
            <i class="icon-question"></i> {{ $t('Как создать квиз') }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/instructions'" class="nav-link">
            <i class="icon-question"></i> {{ $t('Как вставить квиз на лендинг') }}
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
  export default {
    name: 'sidebar',
    methods: {
      handleClick (e) {
        e.preventDefault()
        e.target.parentElement.classList.toggle('open')
      }
    }
  }
</script>

<style lang="css">
  .nav-link {
    cursor:pointer;
  }
</style>



// WEBPACK FOOTER //
// Sidebar.vue?3f3ff3ec