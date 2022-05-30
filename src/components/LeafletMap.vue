<template>
  <div class="wrapper">
    <div class="container" id="map_id">
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import render from '../mapD3/leaflet'

import { ajax } from 'jquery'

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
  res.result.forEach(item => {
    const width = item.rect ? item.rect.w : 1
    const height = item.rect ? item.rect.h : 1
    const [x, y] = item.pos
    item.Polygon = [
      [ [-1, -1], [0, -1], [0, 0], [-1, 0], [-1, -1] ],
      [ [0, 0], [1, 0], [1, 1], [0, 1], [0, 0] ],
      [ [1, 1], [2, 1], [2, 2], [1, 2], [1, 1] ],
    ]
  })

  const geoJson = res.result
  render('map_id', geoJson)

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
