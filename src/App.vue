<script setup lang="ts">
import DrawingBoardVue from './views/DrawingBoard.vue';
</script>

<template>
  <DrawingBoardVue/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  margin: 0;
  padding: 0;
}

.square {
    width: 10px;
    height: 10px;
    background-color: red;
}
</style>
