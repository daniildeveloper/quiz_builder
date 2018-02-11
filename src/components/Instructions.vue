<template>
  <div class="animated fadeIn">
    <div class="card card-accent-info">
      <div class="card-block">
        <Instructions/>
      </div>
    </div>
  </div>
</template>

<script>
  import Instructions from '@/components/Instructions'

  export default {
    components: {
      Instructions
    },
    methods: {
      changeLang () {
        this.$store.commit('')
      }
    }
  }
</script>



// WEBPACK FOOTER //
// Instructions.vue?3218b50e