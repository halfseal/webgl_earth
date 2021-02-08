import {Program} from "../glfunctions/Program.js"
import {Sphere} from "./Sphere.js";
import {status} from "./Status.js";
import {cam, key} from "../glfunctions/Camera.js";
import {Skybox} from "./Skybox.js";
import {OBJ} from "../../OBJ.js";
import {Light} from "./Light.js";
import {Texture} from "../glfunctions/Texture.js";

const {mat4, mat3, vec3, vec2} = glMatrix;

let gl;
let prog;

let sphere;
let cloud_sphere;
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
    if (!status.is_update) return;
    skybox.update(delta * 0.01);
    sphere.update(delta);
    cloud_sphere.update(delta * 0.7);
}

function render() {
    let errorEnum = gl.getError();
    if (errorEnum !== gl.NO_ERROR) enumToMsg(errorEnum);

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
    cloud_sphere.draw();
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

    sphere = new Sphere(gl, prog, "./source/image/2k_earth_daymap.jpg", true);
    sphere.texNorm = new Texture(gl, "./source/image/2k_earth_normal_map.png", true);
    sphere.texSpec = new Texture(gl, "./source/image/2k_earth_specular_map.png", true);
    sphere.texDark = new Texture(gl, "./source/image/2k_earth_nightmap.jpg", true);
    cloud_sphere = new Sphere(gl, prog, "./source/image/2k_earth_clouds.jpg", true);
    cloud_sphere.scale_mx = mat4.scale(mat4.create(), cloud_sphere.scale_mx, vec3.fromValues(1.001, 1.001, 1.001));
    skybox = new Skybox(gl, "./source/image/", ["ypos.png", "yneg.png", "zpos.png", "zneg.png", "xpos.png", "xneg.png"]);
}

function initDrawFunc() {
    sphere.draw = () => {
        prog.bind();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, sphere.tex.id);
        prog.uniform1i("tex_color", 1);

        prog.uniform1i("render_mode", 0);

        prog.uniform1i("isTexNormExist", 1);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, sphere.texNorm.id);
        prog.uniform1i("tex_normal", 2);

        prog.uniform1i("isTexSpecExist", 1);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, sphere.texSpec.id);
        prog.uniform1i("tex_spec", 3);

        prog.uniform1i("isTexDarkExist", 1);
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, sphere.texDark.id);
        prog.uniform1i("tex_Dark", 4);

        prog.uniformMat4("model_mx", false, sphere.getSRT());
        sphere.vo.bind(prog);
        gl.drawArrays(status.is_line ? gl.LINE_STRIP : gl.TRIANGLES, 0, sphere.indices.length);
        sphere.vo.unbind();
        prog.uniform1i("isTexNormExist", 0);
        prog.uniform1i("isTexSpecExist", 0);
        prog.uniform1i("isTexDarkExist", 0);
    }

    cloud_sphere.draw = () => {
        prog.bind();
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, cloud_sphere.tex.id);
        prog.uniform1i("tex_color", 1);

        prog.uniform1i("render_mode", 0);
        prog.uniform1i("isSetAlpha", 1);

        prog.uniformMat4("model_mx", false, cloud_sphere.getSRT());
        cloud_sphere.vo.bind(prog);
        gl.drawArrays(status.is_line ? gl.LINE_STRIP : gl.TRIANGLES, 0, cloud_sphere.indices.length);
        cloud_sphere.vo.unbind();
        gl.disable(gl.BLEND);
        prog.uniform1i("isSetAlpha", 0);
    }

    skybox.draw = () => {
        let skyProg = skybox.prog;
        skyProg.bind();
        gl.disable(gl.DEPTH_TEST);
        gl.activeTexture(gl.TEXTURE1);
        skyProg.uniform1i("skybox", 1);
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

function enumToMsg(err) {
    switch (err) {
        case gl.NO_ERROR :
            return "No error has been recorded.";
        case gl.INVALID_ENUM :
            return "An unacceptable value has been specified for an enumerated argument.";
        case gl.INVALID_VALUE :
            return "A numeric argument is out of range.";
        case gl.INVALID_OPERATION :
            return "The specified command is not allowed for the current state.";
        case gl.INVALID_FRAMEBUFFER_OPERATION :
            return "The currently bound framebuffer is not framebuffer complete when trying to render to or to read from it.";
        case gl.OUT_OF_MEMORY :
            return "Not enough memory is left to execute the command.";
        case gl.CONTEXT_LOST_WEBGL :
            return "If the WebGL context is lost, this error is returned on the first call to getError.";
    }
}