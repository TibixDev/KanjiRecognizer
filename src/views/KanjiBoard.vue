<template>
    <div class="grid grid-cols-1 md:grid-cols-2 container mx-auto text-xl gap-4 px-4">
        <div class="text-center">
            <canvas
                height="512"
                width="512"
                ref="board"
                class="board mx-2 pixel-rendering"
                @mousedown="startMove"
                @mousemove="move"
                @mouseup="endMove"
                @touchstart="startMove"
                @touchmove="move"
                @touchend="endMove"
                @mouseleave="endMove"
            >
            </canvas>
            <div class="py-2"></div>
            <canvas style="width: 30%" ref="smallBoard" class="border-2 border-indigo-300 mx-auto pixel-rendering hidden" width="64" height="64"></canvas>
            <div class="flex flex-row gap-3 justify-center">
                <button @click="drawingBoard!.reset(); predictions = []" class="bg-purple-500 rounded-sm px-3 py-1 text-white">Reset</button>
                <button
                    @click="undo()"
                    class="rounded-sm px-3 py-1 text-white"
                    :class="{
                        'bg-purple-500': drawingBoard!?.history.length > 0,
                        'bg-gray-500': drawingBoard!?.history.length == 0
                    }"
                    :disabled="predictions.length === 0"
                >ᐊ</button>
            </div>
        </div>
        <div>
            <h1 class="text-2xl font-bold py-2">Predictions</h1>
            <p
                v-if="predictions.length > 0"
                v-for="prediction, index of predictions"
                :key="index"
            >{{ prediction[0] }} - {{prediction[1]}}%</p>
            <p v-else>Please draw something on the drawing board...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
//import { $ref, ReactiveVariable } from "vue/macros";
import DrawingBoard from '../utils/DrawingBoard';
import AI from '../utils/AI';

// Reactive definitions
let board = ref<HTMLCanvasElement>();
let smallBoard = ref<HTMLCanvasElement>();
let drawingBoard: Ref<undefined|DrawingBoard> = ref();
let predictions = ref<any[][]>([]);

// AI definitions
let ai = new AI();
ai.init("/kanji-model-v3-tfjs/model.json");

// On mount, create a new drawing board
onMounted(() => {
    console.log("Mounted!")
    drawingBoard.value = new DrawingBoard(board.value!);
});

function resize64(orig: HTMLCanvasElement, dest: HTMLCanvasElement) {
    let destCtx = dest.getContext("2d");
    destCtx!.drawImage(orig, 0, 0, 64, 64);
}

function startMove(event: TouchEvent | MouseEvent) {
    event.preventDefault();
    drawingBoard.value!.startMove(event);
}

function move(event: TouchEvent | MouseEvent) {
    event.preventDefault();
    drawingBoard.value!.move(event);
}

function endMove(event: TouchEvent | MouseEvent) {
    // If it's a mouse leave event and the board was reset
    if (event.type === "mouseleave" && drawingBoard.value!.history.length === 0) {
        return;
    }
    event.preventDefault();
    drawingBoard.value!.endMove();
    predict();
}

async function predict() {
    let perfInit = Date.now();
    resize64(board.value!, smallBoard.value!);
    let val = await ai.predict(smallBoard.value!);
    console.log(val);
    predictions.value = val;
    console.log("Took " + (Date.now() - perfInit) + "ms to predict");
}

function undo() {
    drawingBoard.value!.undo();
    predictions.value = [];
    if (drawingBoard.value!.history.length > 0) {
        predict();
    }
}
</script>

<style scoped>
.board {
    background-color: #fff;
    margin: 0 auto;
    width: 75%;
}

.pixel-rendering {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}
.line {
    background-color: blue;
}
</style>