import {Program} from "./glfunctions/Program.js"
import {Sphere} from "./Sphere.js";
import {VO} from "./glfunctions/VO.js";
import {Texture} from "./glfunctions/Texture.js";
import {status} from "./Status.js";

let gl;

let program;
let vao;
let vao2;

let t = 0.0;
let t1 = 0.0, t0 = 0.0;

let sphere;
let softball_tex;

export class GL {
    constructor(canvas) {
        gl = canvas.getContext("webgl");
    }

    init() {
        alert("init!");
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.lineWidth(1.0);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
    }


    onstart() {
        this.init();

        program = new Program(gl,
            document.querySelector("#h_vert").innerHTML,
            document.querySelector("#h_frag").innerHTML
        );

        sphere = new Sphere();
        vao = new VO(gl, program.id, sphere.pos, sphere.norm, sphere.tc, sphere.indices);

        let vertices =
            [
                [1.0, 1.0, 0.0],
                [-1.0, 1.0, 0.0],
                [-1.0, -1.0, 0.0],
                [1.0, -1.0, 0.0],
            ];

        let normal =
            [
                [0.0, 0.0, 1.0],
                [0.0, 0.0, 1.0],
                [0.0, 0.0, 1.0],
                [0.0, 0.0, 1.0],
            ];

        let texcoord =
            [
                [1.0, 1.0],
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0]
            ];

        let indices = [0, 1, 2, 0, 2, 3];

        vao2 = new VO(gl, program.id, vertices, normal, texcoord, indices);

        softball_tex = new Texture(gl, "./source/image/cubetexture.png", true);

        window.requestAnimationFrame(loop);
    }
}

function update(delta) {
    sphere.update(delta);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program.bind();
    program.uniform1f("t", 0.5 * Math.cos(t) + 0.5);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, softball_tex.id);
    program.uniform1i("tex_color", 0);

    const aspect = status.screen_size[0] / status.screen_size[1];
    const aspect_matrix =
        glMatrix.mat4.fromValues(
            Math.min(1 / aspect, 1.0), 0, 0, 0,
            0, Math.min(aspect, 1.0), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )

    program.uniformMat4("view_proj", false, aspect_matrix);

    // gl.disable(gl.DEPTH_TEST);
    // program.uniformMat4("model_mx", false, glMatrix.mat4.create());
    // vao2.bind();
    // gl.drawArrays(status.is_line ? gl.LINES : gl.TRIANGLES, 0, 6);
    // vao2.unbind();
    // gl.enable(gl.DEPTH_TEST);

    program.uniformMat4("model_mx", false, sphere.getSRT());
    vao.bind();
    gl.drawArrays(status.is_line ? gl.LINE_STRIP : gl.TRIANGLES, 0, sphere.indices.length);
    vao.unbind();

}

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
