export default class DrawingBoard {
    readonly canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D | null
    pen: Pen
    readonly brushStyle: string = 'rgb(255,255,255)'
    brushWidth: number = 1
    readonly bgStyle: string = 'rgb(0,0,0)'
    readonly minDistance = 1
    history: ImageData[] = []
    historyMaxLen = 20

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Canvas not supported');
        }
        this.pen = new Pen(this.canvas.width / 64, this.canvas.width / 64);
        this.reset();
    }

    reset() {
        this.pen.reset();
        this.ctx!.fillStyle = 'rgb(0,0,0)';
        this.ctx!.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.history = [];
    }

    startMove(event: TouchEvent | MouseEvent) {
        console.log("Started", event)
        if (!this.pen.isDown) {
            this.pen.isDown = true
            this.pen.x = this.touchToCanvasPos(event)[0]
            this.pen.y = this.touchToCanvasPos(event)[1]
        }
        this.history.push(this.ctx!.getImageData(0, 0, this.canvas.width, this.canvas.height))
        if (this.history.length > this.historyMaxLen) {
            this.history.shift()
        }
    }

    move(event: TouchEvent | MouseEvent) {
        //console.log("Moving", touch)
        if (!this.pen.isDown) {
            return;
        }
        if (this.pen.x == null || this.pen.y == null) {
            this.pen.x = this.touchToCanvasPos(event)[0]
            this.pen.y = this.touchToCanvasPos(event)[1]
        } else {
            let x = this.pen.x
            let y = this.pen.y

            //console.log(`${x} ${y}`)
            let dX = (this.touchToCanvasPos(event)[0]) - x;
            let dY = (this.touchToCanvasPos(event)[1]) - y;

            let distance = Math.sqrt(dX ** 2 + dY ** 2)

            let step = distance / this.minDistance
            let deltaX = dX / step
            let deltaY = dY / step

            for (let i = 0; i < step; i++) {
                this.ctx!.fillStyle = this.brushStyle;
                this.ctx!.beginPath()
                this.ctx!.arc(x, y, this.pen.radius, 0, Math.PI * 2, false)
                this.ctx!.fill()

                x += deltaX
                y += deltaY
            }
            this.pen.x = this.touchToCanvasPos(event)[0]
            this.pen.y = this.touchToCanvasPos(event)[1]
        }
    }

    endMove() {
        console.log("Ended")
        if (this.pen.isDown) {
            this.pen.isDown = false
            this.pen.x = null
            this.pen.y = null
        }
    }

    touchToCanvasPos(event: TouchEvent | MouseEvent) {
        let x, y;
        if (event instanceof MouseEvent) {
            x = event.clientX;
            y = event.clientY;
        } else {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        const rect = this.canvas.getBoundingClientRect();
        const cw = this.canvas.clientWidth;
        const ch = this.canvas.clientHeight;
        const pos = [(x - rect.left) * (this.canvas.width / cw), (y - rect.top) * (this.canvas.width / ch)];
        return pos;
    }

    undo() {
        if (this.history.length > 0) {
            this.ctx!.putImageData(this.history.pop()!, 0, 0)
        }
    }
}

class Pen {
    x: number|null = null
    y: number|null = null
    isDown: boolean = false;
    color: string = 'black';
    lineWidth: number = 1;
    radius: number = 1;
    constructor(radius: number = 1, lineWidth: number = 1) {
        console.log('Pen Initialized!');
        this.radius = radius;
        this.lineWidth = lineWidth;
    }

    /**
     * Resets the pen
     */
    reset(): void {
        this.x = 0;
        this.y = 0;
        this.isDown = false;
        this.color = 'black';
    }
}