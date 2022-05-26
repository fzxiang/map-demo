<template>
  <div class="wrapper">
    <div class="container">
      <svg class="chart">
      </svg>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

import render from '../mapD3/render'

onMounted(async () => {
  const res = await fetch('https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json')
  const geoJson = await res.json()
  render('.chart', geoJson)
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
