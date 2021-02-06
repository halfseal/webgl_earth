import {Program} from "../glfunctions/Program.js"
import {Sphere} from "./Sphere.js";
import {status} from "./Status.js";
import {cam, key} from "../glfunctions/Camera.js";
import {Skybox} from "./Skybox.js";
import {OBJ} from "../../OBJ.js";
import {Light} from "./Light.js";

let gl;
let prog;

let sphere;
let skybox;

// let mountain = new OBJ();
let light = new Light();

export function glStart(canvas) {
    gl = canvas.getContext("webgl");
    initGLSetting();
    initVariables();
    initDrawFunc();
    window.requestAnimationFrame(loop);
}

function update(delta) {
    key.update(delta, cam);
    skybox.update(delta);
    sphere.update(delta);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    cam.aspect = status.screen_size[0] / status.screen_size[1];

    let view_mx = cam.get_view();
    let proj_mx = cam.get_proj();

    let skyProg = skybox.prog;
    skyProg.bind();
    skyProg.uniformMat4("cam.view_mx", false, view_mx);
    skyProg.uniformMat4("cam.proj_mx", false, proj_mx);
    skybox.draw();

    light.draw(prog, view_mx);

    prog.bind();
    prog.uniform1f("t", 0.5 * Math.cos(t) + 0.5);
    prog.uniformMat4("cam.view_mx", false, view_mx);
    prog.uniformMat4("cam.proj_mx", false, proj_mx);

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
    // mountain.readFile("./source/model/BaseSpiderMan.obj")

    prog = new Program(gl,
        document.querySelector("#h_vert").innerHTML,
        document.querySelector("#h_frag").innerHTML
    );

    sphere = new Sphere(gl, prog, "./source/image/earthmap1k.jpg", true);
    skybox = new Skybox(gl, "./source/image/", ["ypos.png", "yneg.png", "zpos.png", "zneg.png", "xpos.png", "xneg.png"]);
}

function initDrawFunc() {
    sphere.draw = () => {
        prog.bind();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sphere.tex.id);
        prog.uniform1i("tex_color", 0);

        prog.uniform1i("render_mode", 0);

        prog.uniformMat4("model_mx", false, sphere.getSRT());
        sphere.vo.bind(prog);
        gl.drawArrays(status.is_line ? gl.LINE_STRIP : gl.TRIANGLES, 0, sphere.indices.length);
        sphere.vo.unbind();
    }

    skybox.draw = () => {
        let skyProg = skybox.prog;
        skyProg.bind();
        gl.disable(gl.DEPTH_TEST);
        gl.activeTexture(gl.TEXTURE0);
        skyProg.uniform1i("skybox", 0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.texID);
        skyProg.uniformMat4("model_mx", false, skybox.getSRT());
        skybox.vo.bind(skyProg);
        gl.drawArrays(status.is_line ? gl.LINE_STRIP : gl.TRIANGLES, 0, skybox.indices.length);
        skybox.vo.unbind();
        gl.enable(gl.DEPTH_TEST);
    }
}

let t = 0.0, t0 = 0.0;

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
