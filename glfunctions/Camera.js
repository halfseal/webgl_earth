const oneDegRad = Math.PI / 180.0;

function toRad(num) {
    return num * oneDegRad;
}

class Camera {
    eye = glMatrix.vec3.fromValues(0.0, 0.0, 10.0);
    up = glMatrix.vec3.fromValues(0.0, 1.0, 0.0);

    yaw = -90.0;
    pitch = 0.0;

    aspect = 1.0;
    fov = 45.0;
    dNear = 1.0;
    dFar = 1000.0;

    xyz_to_rhc = glMatrix.mat4.fromValues(
        0, 1, 0, 0,
        0, 0, 1, 0,
        1, 0, 0, 0,
        0, 0, 0, 1
    );

    get_front() {
        let x = Math.cos(toRad(this.yaw)) * Math.cos(toRad(this.pitch));
        let y = Math.sin(toRad(this.pitch));
        let z = Math.sin(toRad(this.yaw)) * Math.cos(toRad(this.pitch));
        let xyz = glMatrix.vec3.fromValues(x, y, z);
        xyz = glMatrix.vec3.normalize(glMatrix.vec3.create(), xyz);
        return xyz;
    }

    get_view() {
        return glMatrix.mat4.lookAt(
            glMatrix.mat4.create(),
            this.eye,
            glMatrix.vec3.add(glMatrix.vec3.create(), this.eye, this.get_front()),
            this.up
        );
    }

    get_proj() {
        return glMatrix.mat4.perspective(
            glMatrix.mat4.create(),
            toRad(this.fov),
            this.aspect,
            this.dNear,
            this.dFar
        );
    }
}

export let cam = new Camera();