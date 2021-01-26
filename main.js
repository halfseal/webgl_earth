import {Program} from "./glfunctions/Program.js"

let gl, program;
let t = 0.0;

window.onload = function start() {
    if (!(gl = glInit())) return;

    program = new Program(gl,
        document.querySelector("#h_vert").innerHTML,
        document.querySelector("#h_frag").innerHTML
    );

    initializeAttributes(gl);

    let t1 = 0.0, t0 = 0.0;

    function loop(time) {
        time *= 0.001;  // convert millisecond to second

        t1 = time;
        let delta = t1 - t0;
        t += delta;

        update(delta);
        if (delta > 1.0 / 60.0) {
            render();
            t0 = t1;
        }
        window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
}

function update(delta) {

}

function render() {
    program.bind();
    program.uniform1f("t", 0.5 * Math.cos(t) + 0.5);
    // gl.uniform1f(gl.getUniformLocation(program._id, "t"), 0.5 * Math.cos(t) + 0.5);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

let buffer;

function initializeAttributes(gl) {
    gl.enableVertexAttribArray(0);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}

function glInit() {
    const canvas = document.querySelector("#main_canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvas.width = window.innerWidth * 9 / 10;
    canvas.height = window.innerHeight * 9 / 10;

    if (canvas.width < canvas.height) {
        console.log("canvas.width : " + canvas.width);
        canvas.height = canvas.width * 9 / 16;
    } else {
        console.log("canvas.height : " + canvas.height);
        canvas.width = canvas.height * 16 / 9;
    }

    console.log("screen size: " + canvas.width + " * " + canvas.height);

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
        const paragraph = document.querySelector("p");
        paragraph.innerHTML = "Failed to get WebGL context." + "Your browser or device may not support WebGL.";
        return null;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.lineWidth(1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BITS);
    return gl;
}


