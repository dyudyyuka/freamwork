class Graph2DComponent extends Component {
    constructor(options) {
        super(options);

        this.WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20
        };

        this.ui = new UIComponent({
            id: 'ui',
            parent: this.id,
            template: template.uiTemplate,
            callbacks: {
                delFunction: (num) => this.delFunction(num),
                addFunction: (f, num, width, color) => this.addFunction(f, num, width, color)
            },
        });

        this.canvas = new Canvas({
            WIN: this.WIN,
            id: 'canvas',
            width: 700,
            height: 700,
            callbacks: {
                wheel: event => this.wheel(event),
                mouseMove: event => this.mouseMove(event),
                mouseUp: () => this.mouseUp(),
                mouseDown: () => this.mouseDown(),
                mouseLeave: () => this.mouseLeave()
            }
        });

        this.funcs = [];
        this.canMove = false;
        this.render();
    }

    addFunction(f, num, width = 2, color = 'rgb(180, 0, 0)') {
        this.funcs[num] = { f, color, width };
        this.render();
    }
    delFunction(num) {
        this.funcs[num] = null;
        this.render();
    }

    mouseMove(event) {
        if (this.canMove) {
            this.WIN.LEFT -= event.movementX * 0.05
            this.WIN.BOTTOM += event.movementY * 0.05
        }
        this.render();
    }
    mouseLeave() {
        this.canMove = false;
    }
    mouseUp() {
        this.canMove = false;
    }
    mouseDown() {
        this.canMove = true;
    }
    wheel(event) {
        let delta = event.deltaY * -0.05
        if (this.WIN.BOTTOM + delta < -3) {
            this.WIN.WIDTH -= delta * 2
            this.WIN.HEIGHT -= delta * 2
            this.WIN.LEFT += delta
            this.WIN.BOTTOM += delta
        }
        this.render();
    }

    printFunction(f, color, width) {
        let x = this.WIN.LEFT;
        const dx = this.WIN.WIDTH / 1000;
        while (x < this.WIN.LEFT + this.WIN.WIDTH) {
            this.canvas.line(x, f(x), x + dx, f(x + dx), color, width);
            x += dx;
        }
    }

    render() {
        this.canvas.clear();
        this.printXY();
        this.funcs.forEach(element => {
            if (element) {
                this.printFunction(element.f, element.color, element.width);
            }
        });
    }

    printXY() {
        const { LEFT, BOTTOM, WIDTH, HEIGHT } = this.WIN;
        //XY
        this.canvas.line(0, BOTTOM, 0, HEIGHT + BOTTOM, 'black');
        this.canvas.line(LEFT, 0, WIDTH + LEFT, 0, 'black');
        //Arrows
        this.canvas.line(WIDTH + LEFT, 0, WIDTH + LEFT - 0.4, 0.15, 'black', 1.5);
        this.canvas.line(WIDTH + LEFT, 0, WIDTH + LEFT - 0.4, -0.15, 'black', 1.5);
        this.canvas.line(0, HEIGHT + BOTTOM, -0.15, HEIGHT + BOTTOM - 0.4, 'black', 1.5);
        this.canvas.line(0, HEIGHT + BOTTOM, 0.15, HEIGHT + BOTTOM - 0.4, 'black', 1.5);
        //Text
        this.canvas.text('0', 0.5, -0.7);
        this.canvas.text('1', 1, 1);
        this.canvas.text('-1', -1, -1);
        this.canvas.text('x', WIDTH + LEFT - 0.4, -0.5);
        this.canvas.text('y', 0.5, HEIGHT + BOTTOM - 1);
        //Lines
        for (let i = 0; i < HEIGHT + BOTTOM; i++) {
            this.canvas.line(-0.2, i, 0.2, i, 'black', 1);
        }
        for (let i = 0; i > BOTTOM; i--) {
            this.canvas.line(-0.2, i, 0.2, i, 'black', 1);
        }
        for (let i = 0; i < WIDTH + LEFT; i++) {
            this.canvas.line(i, -0.2, i, 0.2, 'black', 1);
        }
        for (let i = 0; i > LEFT; i--) {
            this.canvas.line(i, -0.2, i, 0.2, 'black', 1);
        }
        //Net
        for (let i = 0; i > LEFT; i--) {
            this.canvas.line(i, BOTTOM + LEFT, i, HEIGHT + BOTTOM, 'black', 0.2);
        }
        for (let i = 0; i < HEIGHT + LEFT - BOTTOM + WIDTH; i++) {
            this.canvas.line(i, BOTTOM, i, 0, 'black', 0.2);
        }
        for (let i = 0; i < HEIGHT + LEFT + BOTTOM + WIDTH; i++) {
            this.canvas.line(i, 0, i, HEIGHT + BOTTOM, 'black', 0.2);
            this.canvas.line(LEFT, i, HEIGHT + LEFT, i, 'black', 0.2);
        }
        for (let i = 0; i > BOTTOM; i--) {
            this.canvas.line(LEFT + BOTTOM, i, WIDTH + LEFT, i, 'black', 0.2);
        }
        for (let i = 0; i < HEIGHT - LEFT + BOTTOM + WIDTH; i++) {
            this.canvas.line(LEFT, i, 0, i, 'black', 0.2);
        }
    }

    getZero(f, a, b, eps) {
        if (f(a) * f(b) > 0) {
            return null;
        }
        if (Math.abs(f(a) - f(b)) <= eps) {
            return (a + b) / 2;
        }
        var half = (a + b) / 2
        if (f(a) * f(half) <= 0) {
            return this.getZero(f, a, half, eps);
        }
        if ((f(half) * f(b)) <= 0) {
            return this.getZero(f, half, b, eps);
        }
    }

    getCross(f, g, a, b, eps) {
        if ((f(a) - g(a)) * (f(b) - g(b)) > 0) {
            return null;
        }
        if (Math.abs(f(a) - g(a)) <= eps) {
            return a
        }
        var half = (a + b) / 2
        if ((f(a) - g(a)) * (f(half) - g(half)) <= 0) {
            return this.getCross(f, g, a, half, eps);
        }
        if ((f(half) - g(half)) * (f(b) - g(b)) <= 0) {
            return this.getCross(f, g, half, b, eps);
        }
    }
}