<template>
  <header class="app-header navbar">
    <slot></slot>
  </header>
</template>
<script>
export default {
  name: 'navbar',
  created () {
    this._navbar = true
  }
}
</script>



// WEBPACK FOOTER //
// Navbar.vue?17d4ae6d