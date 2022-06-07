<template>
  <div class="wrapper">
    <div class="container" ref="containerRef">
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import render from '../leaflet/render'

const containerRef = ref(null)

onMounted(async () => {
  render(containerRef.value)
})

</script>

<style scoped>
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 100px;
}

.container {
  display: flex;
  height: 100%;
  border: 1px solid #ccc;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}


</style>
