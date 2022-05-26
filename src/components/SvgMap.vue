<template>
  <div class="wrapper">
    <div class="container" ref="container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import render from '../mapD3/render'

const container = ref(null)
onMounted(async () => {
  const res = await fetch('/api/map')
  console.log(res)
  const geoJson = await res.json()
  render(container.value, geoJson.result)
})


</script>

<style scoped>
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.container {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
