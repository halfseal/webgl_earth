export class VAO {
    id = 0;
    gl;

    constructor(gl, prog_id, vertices, normal, texcoord, indices) {
        this.gl = gl;

        // let attrib_manager = function (name, array, size) {
        //     let buf = gl.createBuffer();
        //     gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        //     let data = [];
        //     for (let i = 0; i < indices.length; i++) {
        //         let arr = array[indices[i]];
        //         for (let j = 0; j < size; j++) {
        //             data.push(arr[j]);
        //         }
        //     }
        //     let pos = gl.getAttribLocation(prog_id, name);
        //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        //     gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        //     gl.vertexAttribPointer(pos, size, gl.FLOAT, false, 0, 0);
        //     gl.enableVertexAttribArray(pos);
        // };
        //
        // attrib_manager("position", vertices, 3);
        // attrib_manager("normal", normal, 3);
        // attrib_manager("texcoord", texcoord, 2);

        let data = [];
        for (let i = 0; i < indices.length; i++) {
            let vert = vertices[indices[i]];
            let norm = normal[indices[i]];
            let tex = texcoord[indices[i]];

            data.push(vert[0]);
            data.push(vert[1]);
            data.push(vert[2]);

            data.push(norm[0]);
            data.push(norm[1]);
            data.push(norm[2]);

            data.push(tex[0]);
            data.push(tex[1]);
        }

        this.id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0);
        // gl.enableVertexAttribArray(0);
        //
        // gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        // gl.enableVertexAttribArray(1);
        //
        // gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        // gl.enableVertexAttribArray(2);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);


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
    }

    bind() {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0);
        gl.enableVertexAttribArray(0);

        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
        gl.enableVertexAttribArray(1);

        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        gl.enableVertexAttribArray(2);
    }

    unbind() {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);

        gl.disableVertexAttribArray(0);

        gl.disableVertexAttribArray(1);

        gl.disableVertexAttribArray(2);
    }
}