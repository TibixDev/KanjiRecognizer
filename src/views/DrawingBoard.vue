<template>
    <canvas
        height="512"
        width="512"
        ref="board"
        class="board"
        @mousedown="startMove"
        @mousemove="move"
        @mouseup="endMove"
        @touchstart="startMove"
        @touchmove="move"
        @touchend="endMove"
    >
    </canvas>
    <canvas ref="smallBoard" class="border-2 border-indigo-300 mx-auto" width="64" height="64"></canvas>
    <button @click="drawingBoard!.clear()" class="bg-purple-500 rounded-sm px-3 py-1">reset</button>
    <p v-for="prediction, index of predictions" :key="index">{{ prediction[0] }} - {{prediction[1]}}%</p>
    <div class="line bottom" :style="`width: ${offsetL}px; height: 4px; position: fixed; top: ${offsetT}px`">{{ offsetL }}</div>
    <div class="line top" :style="`height: ${offsetT}px; width: 4px; position: fixed; top: 0; left: ${offsetL}px;`">{{ offsetT }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, computed } from 'vue';
//import { $ref, ReactiveVariable } from "vue/macros";
import DrawingBoard from '../utils/DrawingBoard';
import AI from '../utils/AI';

let board = ref<HTMLCanvasElement>();
let smallBoard = ref<HTMLCanvasElement>();

let ai = new AI();
ai.init("/kanji-model-v3-tfjs/model.json");

let predictions = ref<any[][]>([]);

onMounted(() => {
    console.log("Mounted!")
    drawingBoard.value = new DrawingBoard(board.value!);
});

let offsetL = computed(() => {
    return board.value?.offsetLeft;
});

let offsetT = computed(() => {
    return board.value?.offsetTop;
});

let drawingBoard: Ref<undefined|DrawingBoard> = ref();

function resize64(orig: HTMLCanvasElement, dest: HTMLCanvasElement) {
    let origCtx = orig.getContext("2d");
    let destCtx = dest.getContext("2d");
    destCtx!.drawImage(orig, 0, 0, 64, 64);
}

function startMove(touch: TouchEvent | MouseEvent) {
    touch.preventDefault();
    drawingBoard.value!.startMove(touch);
}

function move(touch: TouchEvent | MouseEvent) {
    touch.preventDefault();
    drawingBoard.value!.move(touch);
}

async function endMove(touch: TouchEvent | MouseEvent) {
    touch.preventDefault();
    drawingBoard.value!.endMove(touch);
    let perfInit = Date.now();
    resize64(board.value!, smallBoard.value!);
    let val = await ai.predict(smallBoard.value!);
    console.log(val);
    predictions.value = val;
    console.log("Took " + (Date.now() - perfInit) + "ms to predict");
}
</script>

<style scoped>
.board {
    background-color: #fff;
    margin: 0 auto;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}

.line {
    background-color: blue;
}
</style>