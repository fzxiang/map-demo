<template>
  <div class="btns">
    <button v-on:click="zoomIn()">放大</button>
    <button v-on:click="zoomOut()">缩小</button>
    <button v-on:click="reset()">还原</button>
  </div>
  <div class="container">
    <canvas style="border: 1px red solid" ref="canvasRef" width="500" height="500"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { CanvasOperation } from "../utils/class";

const canvasRef = ref(null)
const operationRef = ref(null)
// 创建对象并进行配置
onMounted(() => {
  const canvas = new CanvasOperation({
    ele: canvasRef.value, // 画布对象
    draw: userDraw, // 用户绘图方法
    width: 500, // 画布宽
    height: 500, // 画布高
    cssWidth: 500, // css设置的宽(对应css style的width)
    cssHeight: 500, // css设置的高(对应css style的height)
    maxScale: 8, // 缩放最大倍数（缩放比率倍数）
    minScale: 0.4, // 缩放最小倍数（缩放比率倍数）
    scaleStep: 0.2, // 缩放比率
  });
  canvas.addMusewheelEvent(); // 添加滚轮放大缩小事件
  canvas.addDragEvent(); // 添加拖动事件
  canvas.draw();
  operationRef.value = canvas
})

// 用户绘图
function userDraw() {
  // for (let i = 0; i < 100000; i++) {
  //
  // }
  this.ctx.fillStyle = "#f00";
  this.ctx.fillRect(0, 0, 100, 100);
  this.ctx.fillStyle = "#00f";
  this.ctx.fillRect(150, 150, 200, 200);
  this.ctx.fillStyle = "#0f0";
  this.ctx.fillRect(400, 400, 100, 100);
}

// 放大
function zoomIn(){
  operationRef.value.zoomIn();
}

// 缩小
function zoomOut() {
  operationRef.value .zoomOut();
}

// 还原
function reset() {
  operationRef.value .reset();
}

</script>

<style scoped>
.btns button {
  margin: 10px;
  padding: 3px 10px;
  cursor: pointer;
}
.container {
  text-align: center;
}
</style>
