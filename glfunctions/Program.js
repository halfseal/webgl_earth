export class Program {
    _gl;
    _id;

    constructor(gl, vs, fs) {
        this._gl = gl;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vs);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fs);
        gl.compileShader(fragmentShader);

        this._id = gl.createProgram();
        gl.attachShader(this._id, vertexShader);
        gl.attachShader(this._id, fragmentShader);
        gl.linkProgram(this._id);
        gl.detachShader(this._id, vertexShader);
        gl.detachShader(this._id, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        if (!gl.getProgramParameter(this._id, gl.LINK_STATUS)) {
            const linkErrLog = gl.getProgramInfoLog(this._id);
            gl.useProgram(null);
            if (this._id)
                gl.deleteProgram(this._id);
            document.querySelector("p").innerHTML =
                "Shader program did not link successfully. " + "Error log: " + linkErrLog;

            throw new Error("something went wrong");
        }
    }

    bind() {
        this._gl.useProgram(this._id);
    }

    uniform1f(name, f0) {
        this.bind();
        this._gl.uniform1f(this._gl.getUniformLocation(this._id, name), f0);
    }

    uniform2f(name, f0, f1) {
        this.bind();
        this._gl.uniform2f(this._gl.getUniformLocation(this._id, name), f0, f1);
    }

    uniform3f(name, f0, f1, f2) {
        this.bind();
        this._gl.uniform3f(this._gl.getUniformLocation(this._id, name), f0, f1, f2);
    }

    uniform4f(name, f0, f1, f2, f3) {
        this.bind();
        this._gl.uniform4f(this._gl.getUniformLocation(this._id, name), f0, f1, f2, f3);
    }

    uniform1i(name, i0) {
        this.bind();
        this._gl.uniform1i(this._gl.getUniformLocation(this._id, name), i0);
    }

    uniform2i(name, i0, i1) {
        this.bind();
        this._gl.uniform2i(this._gl.getUniformLocation(this._id, name), i0, i1);
    }

    uniform3i(name, i0, i1, i2) {
        this.bind();
        this._gl.uniform3i(this._gl.getUniformLocation(this._id, name), i0, i1, i2);
    }

    uniform4i(name, i0, i1, i2, i3) {
        this.bind();
        this._gl.uniform4i(this._gl.getUniformLocation(this._id, name), i0, i1, i2, i3);
    }

    uniform1ui(name, ui0) {
        this.bind();
        this._gl.uniform1ui(this._gl.getUniformLocation(this._id, name), ui0);
    }

    uniform2ui(name, ui0, ui1) {
        this.bind();
        this._gl.uniform2ui(this._gl.getUniformLocation(this._id, name), ui0, ui1);
    }

    uniform3ui(name, ui0, ui1, ui2) {
        this.bind();
        this._gl.uniform3ui(this._gl.getUniformLocation(this._id, name), ui0, ui1, ui2);
    }

    uniform4ui(name, ui0, ui1, ui2, ui3) {
        this.bind();
        this._gl.uniform4ui(this._gl.getUniformLocation(this._id, name), ui0, ui1, ui2, ui3);
    }

    uniform1fv(name, count, vec) {
        this.bind();
        this._gl.uniform1fv(this._gl.getUniformLocation(this._id, name), count, vec);
    }

    uniform2fv(name, count, vec) {
        this.bind();
        this._gl.uniform2fv(this._gl.getUniformLocation(this._id, name), count, vec);
    }

    uniform3fv(name, count, vec) {
        this.bind();
        this._gl.uniform3fv(this._gl.getUniformLocation(this._id, name), count, vec);
    }

    uniform4fv(name, count, vec) {
        this.bind();
        this._gl.uniform4fv(this._gl.getUniformLocation(this._id, name), count, vec);
    }

    uniform1iv(name, count, vec) {
        this.bind();
        this._gl.uniform1iv(this._gl.getUniformLocation(this._id, name), count, vec);
    }

    uniform2iv(name, count, vec) {
        this.bind();
        this._gl.uniform2iv(this._gl.getUniformLocation(this._id, name), count, vec);
    }

    uniform3iv(name, count, vec) {
        this.bind();
        this._gl.uniform3iv(this._gl.getUniformLocation(this._id, name), count, vec);
    }

    uniform4iv(name, count, vec) {
        this.bind();
        this._gl.uniform4iv(this._gl.getUniformLocation(this._id, name), count, vec);
    }

    uniformMat3(name, count, transpose, mat) {
        this.bind();
        this._gl.uniformMatrix3fv(this._gl.getUniformLocation(this._id, name), count, transpose, mat.valueOf());
    }
}