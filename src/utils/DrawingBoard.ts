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
        this.pen = new Pen(this.ctx.canvas.width * 0.01, this.ctx.canvas.height * 0.01);
        this.reset();
    }

    reset() {
        this.pen.reset();
        this.ctx!.fillStyle = 'rgb(0,0,0)';
        this.ctx!.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.history = [];
    }

    startMove(touch: TouchEvent | MouseEvent) {
        console.log("Started", touch)
        if (!this.pen.isDown) {
            this.pen.isDown = true
            //this.pen.id = touch.identifier
            this.pen.x = this.touchToCanvasPos(touch)[0]
            this.pen.y = this.touchToCanvasPos(touch)[1]
        }
        this.history.push(this.ctx!.getImageData(0, 0, this.canvas.width, this.canvas.height))
        if (this.history.length > this.historyMaxLen) {
            this.history.shift()
        }
    }

    move(touch: TouchEvent | MouseEvent) {
        //console.log("Moving", touch)
        if (!this.pen.isDown) {
            return;
        }
        if (this.pen.x == null || this.pen.y == null) {
            this.pen.x = this.touchToCanvasPos(touch)[0]
            this.pen.y = this.touchToCanvasPos(touch)[1]
        } else {
            let x = this.pen.x
            let y = this.pen.y

            //console.log(`${x} ${y}`)
            let dX = (this.touchToCanvasPos(touch)[0]) - x;
            let dY = (this.touchToCanvasPos(touch)[1]) - y;

            let distance = Math.sqrt(dX ** 2 + dY ** 2)

            let step = distance / this.minDistance
            let deltaX = dX / step
            let deltaY = dY / step

            for (let i = 0; i < step; i++) {
                this.ctx!.fillStyle = this.brushStyle;
                this.ctx!.beginPath()
                this.ctx!.arc(x, y, this.pen.radius + 2, 0, Math.PI * 2, false)
                this.ctx!.fill()

                x += deltaX
                y += deltaY
            }
            this.pen.x = this.touchToCanvasPos(touch)[0]
            this.pen.y = this.touchToCanvasPos(touch)[1]
        }
    }

    endMove(touch: TouchEvent | MouseEvent) {
        console.log("Ended")
        if (this.pen.isDown) {
            this.pen.isDown = false
            this.pen.x = null
            this.pen.y = null
        }
    }

    touchToCanvasPos(touch: TouchEvent | MouseEvent) {
        let x, y;
        if (touch instanceof TouchEvent) {
            x = touch.touches[0].clientX;
            y = touch.touches[0].clientY;
        } else {
            x = touch.clientX;
            y = touch.clientY;
        }
        //console.log(this.canvas.offsetLeft, this.canvas.offsetTop)
        const rect = this.canvas.getBoundingClientRect();
        //const pos = [x - this.canvas.offsetLeft, y - this.canvas.offsetTop];
        const pos = [x - rect.left, y - rect.top];
        //console.log(pos);
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