'use strict';

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 144;
const SCREEN_SCALE = 2;

let canvas = null;
let context = null;

let then = 0;
let fps = 0;

let keys = {};

let p1x = 64;
let p1y = 64;
let p2x = 128;
let p2y = 64;
let p1color = [255, 0, 0];
let p2color = [0, 0, 255];

window.addEventListener('load', main);
function main(){
    start();
}

function start(){
    createCanvas();

    document.addEventListener('keydown', (evnt) => {
        keys[evnt.key] = true;
    });
    document.addEventListener('keyup', (evnt) => {
        keys[evnt.key] = false;
    });

    requestAnimationFrame(tick);
}

function tick(now) {
    let delta = (now - then) / 1000.0
    fps = (1.0 / delta);

    update(delta);
    draw();

    then = now;
    requestAnimationFrame(tick);
}

function update(delta) {
    if(keys['w']) {
        p1y -= 32 * delta;
    }
    if(keys['s']) {
        p1y += 32 * delta;
    }
    if(keys['a']) {
        p1x -= 32 * delta;
    }
    if(keys['d']) {
        p1x += 32 * delta;
    }

    p1color = [255, 0, 0];
    let p1aabb = new AABB(p1x, p1y, p1x + 16, p1y + 16);
    let p2aabb = new AABB(p2x, p2y, p2x + 16, p2y + 16);
    if(p1aabb.is_overlapping(p2aabb) === true){
        p1color = [255, 255, 255];
    }
}

function draw() {
    clearCanvas();

    drawRect(p1x, p1y, 16, 16, p1color);
    drawRect(p2x, p2y, 16, 16, p2color);

    // draw shadows
    // horizontal
    drawHorizontalLine(2, p1x, p1x + 16, p1color);
    drawHorizontalLine(2, p2x, p2x + 16, p2color);

    // vertical
    drawVerticalLine(2, p1y, p1y + 16, p1color);
    drawVerticalLine(2, p2y, p2y + 16, p2color);
}

function createCanvas(){
    canvas = document.createElement('canvas');
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    canvas.style.width = (SCREEN_WIDTH * SCREEN_SCALE) + 'px';
    canvas.style.height = (SCREEN_HEIGHT * SCREEN_SCALE) + 'px';
    document.body.appendChild(canvas);

    context = canvas.getContext('2d');
}

function clearCanvas() {
    context.fillStyle = 'rgb(0, 0, 0)';
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
}

function drawRect(x, y, w, h, color) {
    context.strokeStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
    context.strokeRect(x, y, w, h);
}

function drawHorizontalLine(y, x1, x2, color) {
    drawRect(x1, y, Math.abs(x2 - x1), y, color);
}

function drawVerticalLine(x, y1, y2, color) {
    drawRect(x, y1, x, Math.abs(y2 - y1), color);
}

class AABB {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.left = x1;
        this.top = y1;
        this.right = x2;
        this.bottom = y2;
    }

    is_overlapping(other) {
        if(this.right > other.left && this.left < other.right && // horizontal check
            this.bottom > other.top && this.top < other.bottom) { // vertical check
            return true
        }

        return false
    }
}