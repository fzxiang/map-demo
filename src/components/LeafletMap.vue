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
import GeoJSON from "geojson";
import { pos2polygon } from "../utils/datafilter";

onMounted(async () => {
  const param = {
    "do": "getMapList",
    "data": {
      "startPosX": 0, // 起始x坐标
      "startPosY": 0, // 起始y坐标
      "lengthX": 10, // 范围x坐标
      "lengthY": 10, // 范围y坐标
      // "uId":10001033763, // ⾮必填
      // "guildId": 7 // ⾮必填
    }
  }
  const res = await ajax({
    url: '/map/api',
    // url: '/api/map',
    method: 'post',
    data: param
  })

  const json = pos2polygon(res.result)

  const geoJson = GeoJSON.parse(json, {
    Polygon: 'Polygon'
  })

  console.log(geoJson)
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
