<script setup lang="ts">
import Experience from "@/webgl/Experience";
import { onMounted } from "vue";

onMounted(() => {
  const experience = new Experience(document.getElementById("webgl") as HTMLCanvasElement);
});
</script>

<template>
  <main>
    <canvas id="webgl"></canvas>
  </main>
</template>

<style lang="scss" src="./App.scss"></style>
