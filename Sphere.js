export class Sphere {

    scale_mx;
    rotate_mx;
    trans_mx;

    pos = [];
    norm = [];
    tc = [];

    indices = [];

    constructor() {
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

                this.pos.push([x, y, z]);
                this.norm.push([nx, ny, nz]);
                this.tc.push([tx, ty]);
            }
        }

        for (let i = 0; i < latitude_num; i++) {
            let k1 = i * (longitude_num + 1);
            let k2 = k1 + longitude_num + 1;

            for (let j = 0; j < longitude_num; j++, k1++, k2++) {
                this.indices.push(k1);
                this.indices.push(k2)
                this.indices.push(k1 + 1);

                this.indices.push(k1 + 1);
                this.indices.push(k2);
                this.indices.push(k2 + 1);
            }
        }
    }
}