import {GL} from "./GL.js"
import {status} from "./Status.js";
import {cam} from "./glfunctions/Camera.js";

let canvas;
let container;

window.onload = function () {
    canvas = document.querySelector("#glCanvas");
    container = document.querySelector("#glContainer");

    window.onresize(undefined);
    console.log("screen size: " + canvas.width + " * " + canvas.height);

    let gl = new GL(canvas);
    gl.onstart();
};

window.onresize = function () {
    let width = (container.clientWidth * window.devicePixelRatio);
    let height = (container.clientHeight * window.devicePixelRatio);

    canvas.width = width;
    canvas.height = height;

    status.screen_size[0] = width;
    status.screen_size[1] = height;

    const gl = canvas.getContext("webgl");
    gl.viewport(0, 0, width, height);
};

window.onkeydown = function (ev) {
    console.log(ev);
};

document.querySelector("#lineButton").onclick = function () {
    status.is_line = !status.is_line;
    document.querySelector("#lineButton").innerHTML
        = status.is_line ? "SOLID" : "WIRE";
};

document.querySelector("#stopButton").onclick = function () {
    status.is_update = !status.is_update;
    document.querySelector("#stopButton").innerHTML
        = status.is_update ? "STOP" : "RESUME";
};

let isClicked = false;
let firstMouse = true;
let lastX = 0.0;
let lastY = 0.0;

function start() {
    isClicked = true;
    firstMouse = true;
}

function move(x, y) {
    if (!isClicked) return;

    if (firstMouse) {
        lastX = x;
        lastY = y;
        firstMouse = false;
    }

    let xOffset = x - lastX;
    let yOffset = lastY - y;
    lastX = x;
    lastY = y;

    let sensitivity = 0.1;
    xOffset *= sensitivity;
    yOffset *= sensitivity;

    cam.yaw += xOffset;
    cam.pitch += yOffset;

    if (cam.pitch > 89.0) cam.pitch = 89.0;
    if (cam.pitch < -89.0) cam.pitch = -89.0;
}

function end() {
    isClicked = false;
}

(() => {
    if ("ontouchstart" in document.documentElement) {
        console.log("on touch!");

        window.ontouchstart = function () {
            start();
        };

        window.ontouchmove = function (ev) {
            move(ev.touches[0].clientX, ev.touches[0].clientY);
        };

        window.ontouchend = function () {
            end();
        };
    } else {
        console.log("on mouse!");

        window.onmousedown = function () {
            start();
        };

        window.onmousemove = function (ev) {
            move(ev.clientX, ev.clientY);
        };

        window.onmouseup = function () {
            end();
        };
    }
})();



