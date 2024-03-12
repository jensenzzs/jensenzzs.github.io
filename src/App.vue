<!-- app.vue -->

<template>
  <!-- Main Framework7 App component where we pass Framework7 params -->
  <f7-app v-bind="f7params">
    <!-- initial page is specified in routes.js -->
    <f7-view main url="/"></f7-view>
  </f7-app>
</template>
<script>
// import router from './router';

import AboutPage from '@/views/AboutPage.vue'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'

export default {
  data() {
    return {
      // Framework7 parameters that we pass to <f7-app> component
      f7params: {
        // Array with app routes
        // routes: router.getRoutes(),
        // App Name
        name: 'My App',
        // ...
        routes: [
          {
            path: '/',
            component: HomePage,
          },
          {
            path: '/about',
            component: AboutPage,
          },
          {
            path: '/login',
            component: LoginPage,
          },
        ],
      }
    }
  }
}
</script>