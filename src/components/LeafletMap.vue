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
  await render(containerRef.value)
})

</script>

<style scoped>
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
}
@media(min-width: 1680px) {
  .wrapper{
    padding: 100px 200px;
  }
}



.container {
  display: inline-block;
  height: 100%;
  width: 100%;
  border: 1px solid #ccc;
  /*justify-content: center;*/
  /*align-items: center;*/
  overflow: hidden;
}
@media(min-width: 1920px) {
  .container{
    width: 1440px;
    height: 900px
  }
}

</style>
