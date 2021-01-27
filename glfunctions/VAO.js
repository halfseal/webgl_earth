export class VAO {
    id = 0;
    gl;

    constructor(gl, prog_id, vertices, normal, texcoord, indices) {
        this.gl = gl;

        this.id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);

        let attrib_manager = function (name, array, size) {
            let buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            let data = [];
            for (let i = 0; i < indices.length; i++) {
                let arr = array[indices[i]];
                for (let j = 0; j < size; j++) {
                    data.push(arr[j]);
                }
            }
            let pos = gl.getAttribLocation(prog_id, name);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.vertexAttribPointer(pos, size, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(pos);
        };

        attrib_manager("position", vertices, 3);
        attrib_manager("normal", normal, 3);
        attrib_manager("texcoord", texcoord, 2);

        // let posbuf = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, posbuf);
        // let vertex_data = [];
        // for (let i = 0; i < indices.length; i++) {
        //     let arr = vertices[indices[i]];
        //     vertex_data.push(arr[0]);
        //     vertex_data.push(arr[1]);
        //     vertex_data.push(arr[2]);
        // }
        // let pos = gl.getAttribLocation(prog_id, "position");
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_data), gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ARRAY_BUFFER, posbuf);
        // gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(pos);
        //
        // let normbuf = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, normbuf);
        // let norm_data = [];
        // for (let i = 0; i < indices.length; i++) {
        //     let arr = normal[indices[i]];
        //     norm_data.push(arr[0]);
        //     norm_data.push(arr[1]);
        //     norm_data.push(arr[2]);
        // }
        // pos = gl.getAttribLocation(prog_id, "normal");
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norm_data), gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ARRAY_BUFFER, normbuf);
        // gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(pos);
        //
        // let texbuf = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, texbuf);
        // let tex_data = [];
        // for (let i = 0; i < indices.length; i++) {
        //     let arr = texcoord[indices[i]];
        //     tex_data.push(arr[0]);
        //     tex_data.push(arr[1]);
        // }
        // pos = gl.getAttribLocation(prog_id, "texcoord");
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_data), gl.STATIC_DRAW);
        // gl.bindBuffer(gl.ARRAY_BUFFER, texbuf);
        // gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(pos);

        // gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 44, 12);
        // gl.enableVertexAttribArray(1);
        //
        // gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 44, 24);
        // gl.enableVertexAttribArray(2);
        //
        // gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 44, 32);
        // gl.enableVertexAttribArray(3);
    }

    bind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.id);
    }
}