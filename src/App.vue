<script setup lang="ts">
import KanjiBoard from './views/KanjiBoard.vue';
</script>

<template>
    <div style="min-height: 90vh;" class="flex flex-col justify-between">
        <KanjiBoard />
        <div class="p-5 flex items-center flex-col">
            <p>Copyright (c) 2022  <a class="text-violet-400 font-bold" href="https://github.com/TibixDev">TibixDev</a></p>
            <p>ML Model: <a class="text-violet-400 font-bold" href="https://github.com/ichisadashioko/kanji-recognition">ichisadashioko</a></p>
            <p>Licensed under the MIT license</p>
        </div>
    </div>
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
