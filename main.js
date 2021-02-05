import {glStart} from "./source/object/GL.js"
import {status} from "./source/object/Status.js";
import {cam, mouse, key} from "./source/glfunctions/Camera.js";

let canvas;
let container;

window.onload = function () {

    canvas = document.querySelector("#glCanvas");
    container = document.querySelector("#glContainer");

    window.onresize(undefined);
    console.log("screen size: " + canvas.width + " * " + canvas.height);

    glStart(canvas);
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

document.querySelector("#hideButton").onclick = function () {
    status.is_show_button = !status.is_show_button;

    let set1 = document.querySelector("#buttonSet");
    let set2 = document.querySelector("#arrowSet");

    if (!status.is_show_button) {
        set1.style.visibility = "hidden";
        set2.style.visibility = "hidden";
    } else {
        set1.style.visibility = "visible";
        set2.style.visibility = "visible";
    }
}

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

(() => {
    if ("ontouchstart" in document.documentElement) {
        console.log("on touch!");

        window.ontouchstart = function (ev) {
            mouse.start();
        };

        window.ontouchmove = function (ev) {
            mouse.move(ev.touches[0].clientX, ev.touches[0].clientY, cam);
        };

        window.ontouchend = function (ev) {
            mouse.end();
            key.reset();
        };

        document.querySelector("#wButton").ontouchstart = function () {
            key.changeStatus("w", true);
        };
        document.querySelector("#aButton").ontouchstart = function () {
            key.changeStatus("a", true);
        };
        document.querySelector("#sButton").ontouchstart = function () {
            key.changeStatus("s", true);
        };
        document.querySelector("#dButton").ontouchstart = function () {
            key.changeStatus("d", true);
        };
        document.querySelector("#downButton").ontouchstart = function () {
            key.changeStatus("ArrowDown", true);
        };
        document.querySelector("#upButton").ontouchstart = function () {
            key.changeStatus("ArrowUp", true);
        };

        window.on

    } else {
        console.log("on mouse!");

        window.onmousedown = function () {
            mouse.start();
        };

        window.onmousemove = function (ev) {
            mouse.move(ev.clientX, ev.clientY, cam);
        };

        window.onmouseup = function () {
            mouse.end();
            if (!key.usingKeyboard) key.reset();
        };

        document.querySelector("#wButton").onmousedown = function () {
            key.changeStatus("w", true);
        };
        document.querySelector("#aButton").onmousedown = function () {
            key.changeStatus("a", true);
        };
        document.querySelector("#sButton").onmousedown = function () {
            key.changeStatus("s", true);
        };
        document.querySelector("#dButton").onmousedown = function () {
            key.changeStatus("d", true);
        };
        document.querySelector("#downButton").onmousedown = function () {
            key.changeStatus("ArrowDown", true);
        };
        document.querySelector("#upButton").onmousedown = function () {
            key.changeStatus("ArrowUp", true);
        };

        window.onkeydown = function (ev) {
            key.usingKeyboard = true;
            key.changeStatus(ev.key, true);
        };

        window.onkeyup = function (ev) {
            key.usingKeyboard = false;
            key.changeStatus(ev.key, false);
        };

        window.onwheel = function (ev) {
            let dy = ev.deltaY;
            dy = 5 * dy / Math.abs(dy);

            cam.fov += dy;
            if (cam.fov < 15) cam.fov = 15;
            if (cam.fov > 45) cam.fov = 45;
        };
    }
})();





