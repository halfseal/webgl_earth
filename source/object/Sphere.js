import {status} from "./Status.js";
import {VO, Vertex} from "../glfunctions/VO.js";
import {Texture} from "../glfunctions/Texture.js";

export class Sphere {
    tex;
    vo;

    scale_mx = glMatrix.mat4.create();
    rotate_mx = glMatrix.mat4.create();
    trans_mx = glMatrix.mat4.create();

    xyz_to_rhc = glMatrix.mat4.fromValues(
        0, 1, 0, 0,
        0, 0, 1, 0,
        1, 0, 0, 0,
        0, 0, 0, 1
    );

    vert = new Vertex();
    indices = [];

    t = 0;

    update(delta) {
        if (!status.is_update) return;
        this.rotate_mx =
            glMatrix.mat4.rotate(
                glMatrix.mat4.create(),
                this.rotate_mx,
                delta,
                glMatrix.vec3.fromValues(0.0, 1.0, 0.0)
            );
    }

    getSRT() {
        let mat4 = glMatrix.mat4.create();
        let res = glMatrix.mat4.multiply(mat4, this.scale_mx, this.xyz_to_rhc);
        res = glMatrix.mat4.multiply(mat4, this.rotate_mx, res);
        return glMatrix.mat4.multiply(mat4, this.trans_mx, res);
    }

    constructor(gl, prog, path, need_flip) {
        this.tex = new Texture(gl, path, need_flip);
        this.xyz_to_rhc = glMatrix.mat4.transpose(glMatrix.mat4.create(), this.xyz_to_rhc);

        const longitude_num = 72;
        const latitude_num = 36;

        let radius = 1.0;
        let long_interval = 2 * Math.PI / longitude_num;
        let lat_interval = Math.PI / latitude_num;

        for (let i = 0; i <= latitude_num; i++) {
            let lat_degree = i * lat_interval;

            for (let j = 0; j <= longitude_num; j++) {
                let long_degree = j * long_interval;

                const x = radius * Math.sin(lat_degree) * Math.cos(long_degree);
                const y = radius * Math.sin(lat_degree) * Math.sin(long_degree);
                const z = radius * Math.cos(lat_degree);

                const nx = Math.sin(lat_degree) * Math.cos(long_degree);
                const ny = Math.sin(lat_degree) * Math.sin(long_degree);
                const nz = Math.cos(lat_degree);

                const tx = long_degree / (2 * Math.PI);
                const ty = 1.0 - (lat_degree / Math.PI);

                this.vert.pos.push([x, y, z]);
                this.vert.norm.push([nx, ny, nz]);
                this.vert.tc.push([tx, ty]);
            }
        }

        for (let i = 0; i < latitude_num; i++) {
            let k1 = i * (longitude_num + 1);
            let k2 = k1 + longitude_num + 1;

            for (let j = 0; j < longitude_num; j++, k1++, k2++) {
                this.indices.push(k1);
                this.indices.push(k2);
                this.indices.push(k1 + 1);

                this.indices.push(k1 + 1);
                this.indices.push(k2);
                this.indices.push(k2 + 1);
            }
        }

        this.vo = new VO(gl, prog, this.vert.pos, this.vert.norm, this.vert.tc, this.indices);
    }
}