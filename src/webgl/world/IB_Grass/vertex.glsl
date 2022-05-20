attribute vec3 offset;
attribute float scale;
attribute float cut;

uniform vec3 uCameraPos;
uniform vec3 uLawnmowerPos;

varying vec2 vUv;

void main() {
    vec3 fwd = normalize(position - uCameraPos);
    vec3 up = vec3(0, 1, 0);
    vec3 right = normalize(cross(fwd, up));
    mat3 rotationMatrix = mat3(right, up, fwd);
    vec3 newPosition = rotationMatrix * position;

    float distanceToLawnmower = distance(newPosition * scale + offset, uLawnmowerPos);
    distanceToLawnmower = step(1., distanceToLawnmower);

    vec3 translation = newPosition * scale * cut + offset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(translation, 1.);

    vUv = uv;
}