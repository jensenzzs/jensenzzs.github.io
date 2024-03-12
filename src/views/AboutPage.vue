<template>
  <f7-page name="about">
    <f7-navbar title="About"></f7-navbar>
    <!-- Page content -->
    <a href="" @click="navigate">aaaa</a>
  </f7-page>
</template>
<script>
export default {
  // define props so the component will receive it
  props: {
    f7route: Object,
    f7router: Object,
  },

  mounted() {
    console.log(this.f7route.url)
  },
  methods: {
    navigate() {
      this.f7router.back()
    }
  }
};
</script>