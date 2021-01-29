import {GL} from "./GL.js"
import {status} from "./Status.js";

let canvas;

window.onload = function () {
    canvas = document.querySelector("#glCanvas");

    window.onresize(undefined);
    console.log("screen size: " + canvas.width + " * " + canvas.height);

    let gl = new GL(canvas);
    gl.onstart();
};

window.onresize = function () {
    let width = (canvas.clientWidth * window.devicePixelRatio);
    let height = (canvas.clientHeight * window.devicePixelRatio);

    // let needed_height = width * (1 / status.ratio);
    //
    // if (height > needed_height) {
    //     height = needed_height;
    // } else {
    //     width = height * status.ratio;
    // }

    canvas.width = width;
    canvas.height = height;

    status.screen_size[0] = width;
    status.screen_size[1] = height;

    const gl = canvas.getContext("webgl");
    gl.viewport(0, 0, width, height);
};

window.onkeydown = function (e) {
    console.log(e);
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