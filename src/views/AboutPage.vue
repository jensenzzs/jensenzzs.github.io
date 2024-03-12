<template>
  <f7-page name="about">
    <f7-navbar title="About"></f7-navbar>
    <!-- Page content -->
    <a href="" @click="navigate">aaaa</a>
  </f7-page>
</template>
<script setup lang="ts">

import { defineProps, defineEmits, ref, reactive, onMounted, nextTick, defineExpose } from 'vue';

const props = defineProps({
  f7route: Object,
  f7router: Object,
})

onMounted(() => {
})

function navigate() {
  if (props.f7router) {
    props.f7router.back()
  }
}
</script>