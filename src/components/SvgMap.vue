<template>
  <div class="wrapper">
    <div class="container" ref="container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import render from '../mapD3/render'
import { ajax } from 'jquery'
import GeoJSON from 'geojson'

const baseSize = 10

const container = ref(null)
onMounted(async () => {
  const param = {
    "do": "getMapList",
    "data": {
      "startPosX": 150, // 起始x坐标
      "startPosY": 150, // 起始y坐标
      "lengthX": 3, // 范围x坐标
      "lengthY": 3, // 范围y坐标
      // "uId":10001033763, // ⾮必填
      // "guildId": 7 // ⾮必填
    }
  }
  const res = await ajax({
    // url: '/map/api',
    url: '/api/map',
    method: 'post',
    data: param
  })
  console.log(res)

  // const geoJson = GeoJSON.parse(data, {'Point': ['pos[0]', 'pos[1]']})

  // polygon: [
  //   [[100, 0], [110, 0], [110, 10], [100,10], [100, 0] ],
  //   [[110, 0], [120, 0], [120, 10], [110,10], [110, 0] ],
  // ],
  const geoJson = res.result
  render(container.value, geoJson)
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
  width: 60%;
  height: 60%;
  border: 1px solid #ccc;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
