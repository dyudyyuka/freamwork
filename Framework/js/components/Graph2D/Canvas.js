class Canvas {
    constructor({ WIN, id, width, height, callbacks }) {
        this.WIN = WIN;
        this.canvas = document.getElementById(id);
        this.canvas.width = width;
        this.canvas.height = height
        this.context = this.canvas.getContext(`2d`);
        this.canvas.addEventListener('wheel', callbacks.wheel);
        this.canvas.addEventListener('mousemove', callbacks.mouseMove);
        this.canvas.addEventListener('mouseup', callbacks.mouseUp);
        this.canvas.addEventListener('mousedown', callbacks.mouseDown);
        this.canvas.addEventListener('mouseleave', callbacks.mouseLeave);
    }

    xs(x) {
        return this.canvas.width * (x - this.WIN.LEFT) / this.WIN.WIDTH;
    }
    ys(y) {
        return this.canvas.height - (this.canvas.height * (y - this.WIN.BOTTOM) / this.WIN.HEIGHT);
    }

    clear() {
        this.context.fillStyle = "#eee";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    line(x1, y1, x2, y2, color, weidth) {
        this.context.beginPath();
        this.context.strokeStyle = color || 'red';
        this.context.lineWidth = weidth || 2;
        this.context.moveTo(this.xs(x1), this.ys(y1));
        this.context.lineTo(this.xs(x2), this.ys(y2));
        this.context.stroke();
    };
    text(text, x, y, color, font) {
        this.context.fillStyle = color || 'black';
        this.context.font = font || 'italic 15px Arial';
        this.context.fillText(text, this.xs(x), this.ys(y));
    };
    point(x, y, color = '#f00', size = 3) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.arc(this.xs(x), this.ys(y), size, 0, 2 * Math.PI);
        this.context.stroke();
    }
}