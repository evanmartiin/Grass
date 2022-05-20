attribute vec3 aOffset;

void main() {
    vec3 translation = position + aOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(translation, 1.);
}