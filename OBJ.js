const {mat4, mat3, vec3, vec2} = glMatrix;

export class OBJ {
    lines;

    pos = [];
    norm = [];
    tc = [];
    indices = [];

    readFile(path) {
        let reader = new XMLHttpRequest();
        reader.open("GET", path);
        reader.onreadystatechange = () => {
            if (reader.readyState === 4) {
                if (reader.status === 200 || reader.status === 0) {
                    console.log("Successfully loaded " + reader.responseURL)
                    this.lines = (reader.responseText).split('\n');
                    this.handleObj();
                } else {
                    alert("Failed loading " + reader.responseURL);
                }
            }
        }
        reader.send(null);
    }

    handleObj() {
        // console.log(this.lines.length);
        for (let i = 0; i < this.lines.length; i++) {
            let line = this.lines[i];
            let items = line.replace(/\s\s+/g, ' ').trim().split(' ');

            switch (items[0].toLowerCase()) {
                case "#" :
                    continue;

                case "o" :
                    break;

                case "v" : {
                    let x = parseFloat(items[1]);
                    let y = parseFloat(items[2]);
                    let z = parseFloat(items[3]);
                    this.pos.push(vec3.fromValues(x, y, z));
                    break;
                }
                case "vt" : {
                    let x = parseFloat(items[1]);
                    let y = parseFloat(items[2]);
                    this.tc.push(vec3.fromValues(x, y));
                    break;
                }
                case "vn" : {
                    let x = parseFloat(items[1]);
                    let y = parseFloat(items[2]);
                    let z = parseFloat(items[3]);
                    this.norm.push(vec3.fromValues(x, y, z));
                    break;
                }
                case "f" :
                    console.log(items[1],items[2],items[3],items[4])
                    break;

                case "mtllib" :
                    // console.table(items);
                    break;


            }
        }
    }
}