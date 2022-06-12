import * as tf from '@tensorflow/tfjs';
import Dict from './Dict';

export default class AI {
    model: tf.LayersModel|null = null;

    async init(model: string | tf.LayersModel) {
        if (typeof model === 'string') {
            await this.loadModel(model);
        } else {
            this.model = model;
        }
    }

    async loadModel(url: string) {
        this.model = await tf.loadLayersModel(url);
        console.log("[AI] Model loaded!")
        return;
    }

    async predict(canvas: HTMLCanvasElement) {
        if (!this.model) {
            throw new Error('Model not loaded');
        }
        let inputImg = tf.browser.fromPixels(canvas, 1);
        inputImg = inputImg.asType('float32');
        inputImg = inputImg.div(255.0);
        inputImg = inputImg.reshape([1, 64, 64, 1]);

        let predictions = (await this.model.predict(inputImg) as tf.Tensor).arraySync() as number[][];
        let kanjiArr: any[][] = [];
        for (let i = 0; i < predictions[0].length; i++) {
            kanjiArr.push([Dict[i], predictions[0][i] * 100]);
        }
        kanjiArr.sort((a, b) => { return b[1] - a[1] })
        return kanjiArr.slice(0, 5);
    }
}