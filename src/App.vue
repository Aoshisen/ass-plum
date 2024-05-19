<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Plum } from "./plum";

let canvasEl = ref<HTMLCanvasElement>();
onMounted(() => {
  new Plum(canvasEl.value!);
});
</script>

<template>
  <canvas ref="canvasEl" width="800" height="800"></canvas>
</template>

<style>
body {
  background-color: #000;
}
canvas {
  margin: 0 auto;
}
</style>
