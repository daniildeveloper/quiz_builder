<template>
  <div id="app">
    <!-- <Layout> -->
      <Quiz v-if="loaded"/>
    <!-- </Layout> -->
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </div>
</template>

<script>
  // import Layout from './components/Layout';
  import Quiz from './components/Quiz';
  import { mapState } from 'vuex';

  export default {
    beforeMount() {
      this.$store.dispatch('quiz/get', this.$route.params.id).then(() => {
        this.isLoading = false;
      });
    },
    data() {
      return {
        isLoading: true,
      };
    },
    computed: {
      ...mapState('quiz', ['loaded']),
    },
    components: { Quiz,
    },
    name: 'app',
  };
</script>



// WEBPACK FOOTER //
// src/App.vue