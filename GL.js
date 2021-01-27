import {Program} from "./glfunctions/Program.js"
import {Sphere} from "./Sphere.js";
import {VAO} from "./glfunctions/VAO.js";

let gl;

let program;
let vao;

let t = 0.0;

export class GL {
    constructor(canvas) {
        gl = canvas.getContext("webgl");
    }

    init() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.lineWidth(1.0);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    onstart() {
        this.init();

        program = new Program(gl,
            document.querySelector("#h_vert").innerHTML,
            document.querySelector("#h_frag").innerHTML
        );

        let vertices =
            [
                [1.0, 1.0, 0.0],
                [-1.0, 1.0, 0.0],
                [-1.0, -1.0, 0.0],
                [1.0, -1.0, 0.0],
            ];
        let texcoord =
            [
                [1.0, 1.0],
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0]
            ];

        let indices = [0, 1, 2, 0, 2, 3];

        vao = new VAO(gl, program._id, vertices, texcoord, indices);

        this.render_loop();
    }

    render_loop() {
        let t1 = 0.0, t0 = 0.0;

        let update = this.update;
        let render = this.render;

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

    update(delta) {

    }

    render() {
        program.bind();
        program.uniform1f("t", 0.5 * Math.cos(t) + 0.5);
        vao.bind();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}