<template>
  <div class="wrapper">
    <div class="container" ref="containerRef">
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import render from '../leaflet/render'
import useConfig from '../leaflet/useConfig'

import { ajax } from 'jquery'
import GeoJSON from "geojson";
import { pos2polygon } from "../utils/datafilter";
const { TILE_NUM } = useConfig()

const geoLayerRef = ref(null)
const containerRef = ref(null)
const param = {
  "do": "getMapList",
  "data": {
    "startPosX": 0, // 起始x坐标
    "startPosY": 0, // 起始y坐标
    "lengthX": TILE_NUM, // 范围x坐标
    "lengthY": TILE_NUM, // 范围y坐标
    // "uId":10001033763, // ⾮必填
    // "guildId": 7 // ⾮必填
  }
}
onMounted(async () => {
  const geoJson = await getMapApi(param)
  const { geoLayer } = render(containerRef.value, geoJson)
  geoLayerRef.value = geoLayer
})

setTimeout(async ()=>{
  param.data.startPosX = TILE_NUM;
  param.data.startPosY = 0
  const geoJson = await getMapApi(param)
  geoLayerRef.value.addData(geoJson)
}, 3000)


async function getMapApi(param) {
  const res = await ajax({
    url: '/map/api',
    // url: '/api/map',
    method: 'post',
    data: param
  })
  const json = pos2polygon(res.result)
  return GeoJSON.parse(json, {
    Polygon: 'Polygon'
  })
}

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
