class Status {
    is_line = false;
    is_update = true;
    screen_size = glMatrix.vec2.create();
    ratio = 16 / 9;
}

export let status = new Status();
