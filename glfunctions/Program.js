export class Program {
    id;

    constructor(gl, vs, fs) {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader,vs);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader,fs);
        gl.compileShader(fragmentShader);

        this.id = gl.createProgram();
        gl.attachShader(this.id, vertexShader);
        gl.attachShader(this.id, fragmentShader);
        gl.linkProgram(this.id);
        gl.detachShader(this.id, vertexShader);
        gl.detachShader(this.id, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
            const linkErrLog = gl.getProgramInfoLog(this.id);
            gl.useProgram(null);
            if (buffer)
                gl.deleteBuffer(buffer);
            if (this.id)
                gl.deleteProgram(this.id);
            document.querySelector("p").innerHTML =
                "Shader program did not link successfully. " + "Error log: " + linkErrLog;

            throw new Error("something went wrong");
        }
    }

    bind(gl) {
        gl.useProgram(this.id);
    }
}