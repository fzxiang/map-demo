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
      "startPosX": 718, // 起始x坐标
      "startPosY": 469, // 起始y坐标
      "lengthX": 1, // 范围x坐标
      "lengthY": 1, // 范围y坐标
      "uId":10001033763, // ⾮必填
      "guildId": 7 // ⾮必填
    }
  }
  const res = await ajax({
    // url: '/map/api',
    url: '/api/map',
    method: 'post',
    data: {
      "do": "getMapList",
      "data": {
        "startPosX": 150, // 起始x坐标
        "startPosY": 140, // 起始y坐标
        "lengthX": 40, // 范围x坐标
        "lengthY": 40, // 范围y坐标
        // "uId": 10001033763, // ⾮必填
        // "guildId": 7 // ⾮必填
      },
    }
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
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
