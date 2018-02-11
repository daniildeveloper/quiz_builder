<template>
  <navbar class="header">
    <div class="container-fluid">
      <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
      <router-link class="navbar-brand" to="/"></router-link>
      <ul class="nav navbar-nav d-md-down-none mr-auto">
        <li class="nav-item px-2">
          <router-link to="/quizzes" class="nav-link">{{ $t('Мои квизы') }}</router-link>
        </li>
        <!-- <li class="nav-item px-1">
          <router-link :to="'/quizzes/edit'" class="nav-link">
            {{ $t('Создать квиз') }}
          </router-link>
        </li> -->
        <li class="nav-item px-2">
          <router-link :to="'/help'" class="nav-link">
            {{ $t('Как создать квиз') }}
          </router-link>
        </li>
        <li class="nav-item px-2">
          <router-link :to="'/instructions'" class="nav-link">
            {{ $t('Как вставить квиз на лендинг') }}
          </router-link>
        </li>
      </ul>
      <ul class="nav navbar-nav ml-auto">
        <li class="nav-item hidden-md-down px-5">
          <router-link to="/balance" class="nav-link header__balance">
            <i class="icon-wallet"></i> <span class="badge badge-pill badge-danger">{{ balance }}</span>
          </router-link>
        </li>
        <dropdown size="nav" class="nav-item">
          <span slot="button">
            <span class="d-inline-block d-sm-none"><i class="icon-user"></i></span>
            <span class="d-none d-sm-inline-block">{{ email || $t('Мой аккаунт') }}</span>
          </span>
          <div slot="dropdown-menu"class="dropdown-menu dropdown-menu-right">
            <router-link to="/balance" class="dropdown-item"><i class="icon-wallet"></i> {{ $t('Оплата и баланс') }}</router-link>
            <a class="dropdown-item" @click="logout"><i class="fa fa-lock"></i> {{ $t('Выйти') }}</a>
          </div>
        </dropdown>
      </ul>
    </div>
  </navbar>

</template>

<script>
  import { mapState } from 'vuex'
  import navbar from './Navbar'

  export default {
    name: 'header',
    components: {
      navbar
    },
    computed: {
      ...mapState('user', ['balance', 'email'])
    },
    methods: {
      click () {
        // do nothing
      },
      sidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-hidden')
      },
      sidebarMinimize (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-minimized')
      },
      mobileSidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-mobile-show')
      },
      asideToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('aside-menu-hidden')
      },
      logout () {
        this.$auth.logout().then(() => {
          this.$router.push('/signin')
        }).catch(e => {
          this.$router.push('/signin')
        })
      }
    }
  }
</script>

<style lang="less">
  .app-header.navbar {
    .dropdown-toggle {
      cursor: pointer;
    }
    .navbar-brand {
      font-weight: 700;
      color: #304047;
      text-align: center;
      padding-top: 11px !important;
      @media (min-width: 1024px) {
        background-size: 75% auto;
      }
    }
  }

  .header__balance i {
    font-size: 20px;
  }

  @media (max-width: 991px) {
    .hidden-md-down {
      display: none !important;
    }
    .app-header .navbar-nav {
      top: 3px;
    }
  }
</style>



// WEBPACK FOOTER //
// Header.vue?5e9f205b