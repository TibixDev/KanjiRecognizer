<script setup lang="ts">
import KanjiBoard from './views/KanjiBoard.vue';
</script>

<template>
  <KanjiBoard/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}

body {
  margin: 0;
  padding: 0;
  background-color: rgb(47, 47, 47);
  color: white;
}

.square {
    width: 10px;
    height: 10px;
    background-color: red;
}
</style>
