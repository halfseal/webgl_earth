export class VO {
    id = 0;
    gl;

    constructor(gl, prog_id, vertices, normal, texcoord, indices) {
        this.gl = gl;

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