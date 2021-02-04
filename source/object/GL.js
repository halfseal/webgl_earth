import {Program} from "../glfunctions/Program.js"
import {Sphere} from "./Sphere.js";
import {VO} from "../glfunctions/VO.js";
import {Texture} from "../glfunctions/Texture.js";
import {status} from "./Status.js";
import {cam, key} from "../glfunctions/Camera.js";

let gl;
let program;
let t = 0.0;
let sphere;

export function glStart(canvas) {
    gl = canvas.getContext("webgl");
    initGLSetting();
    initVariables();
    initDrawFunc();
    window.requestAnimationFrame(loop);
}

function update(delta) {
    key.update(delta, cam);
    sphere.update(delta);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program.bind();
    program.uniform1f("t", 0.5 * Math.cos(t) + 0.5);

    cam.aspect = status.screen_size[0] / status.screen_size[1];

    program.uniformMat4("view_mx", false, cam.get_view());
    program.uniformMat4("proj_mx", false, cam.get_proj());

    sphere.draw();
}

function initGLSetting() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.lineWidth(1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
}

function initVariables() {
    program = new Program(gl,
        document.querySelector("#h_vert").innerHTML,
        document.querySelector("#h_frag").innerHTML
    );

    sphere = new Sphere(gl, program, "./source/image/earthmap1k.jpg", true);

}

function initDrawFunc() {
    sphere.draw = function () {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sphere.tex.id);
        program.uniform1i("tex_color", 0);

        program.uniformMat4("model_mx", false, sphere.getSRT());
        sphere.vo.bind(program);
        gl.drawArrays(status.is_line ? gl.LINE_STRIP : gl.TRIANGLES, 0, sphere.indices.length);
        sphere.vo.unbind();
    }
}

let t0 = 0.0;
function loop(time) {
    time *= 0.001;  // convert millisecond to second

    let t1 = time;
    let delta = t1 - t0;
    t += delta;

    update(delta);
    if (delta > 1.0 / 60.0) {
        render();
        t0 = t1;
    }
    window.requestAnimationFrame(loop);
}
