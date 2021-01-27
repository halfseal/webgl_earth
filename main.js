import {GL} from "./GL.js"
import {status} from "./Status.js";

let canvas, text;

window.onload = function () {
    canvas = document.querySelector("#glCanvas");
    text = document.querySelector("#glTitle");

    window.onresize(undefined);
    console.log("screen size: " + canvas.width + " * " + canvas.height);

    let gl = new GL(canvas);
    gl.onstart();
};

window.onresize = function () {
    let width = (window.innerWidth) * 0.9;
    let height = (window.innerHeight - text.clientHeight) * 0.9;

    let needed_height = width * 9 / 16;

    if (height > needed_height) {
        height = needed_height;
    } else {
        width = height * 16 / 9;
    }

    canvas.width = width;
    canvas.height = height;
    const gl = canvas.getContext("webgl");
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};

window.onkeydown = function (e) {

};

document.querySelector("#lineButton").onclick = function () {
    status.is_line = !status.is_line;
    document.querySelector("button").innerHTML
        = status.is_line ? "SOLID" : "WIRE";
};