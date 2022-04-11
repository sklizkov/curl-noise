precision highp float;

attribute vec3 aTexCoord;

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

varying vec2 vUv;
varying vec3 vNormal;
varying float vLife;
varying vec3 vTexCoord;


mat3 lookatMat(vec3 origin, vec3 target, vec3 up) {
  vec3 zAxis = normalize(origin - target);
  vec3 xAxis = normalize(cross(up, zAxis));
  vec3 yAxis = normalize(cross(zAxis, xAxis));

  return mat3(xAxis, yAxis, zAxis);
}

float parabola(float x, float k) {
  return pow(4. * x * (1. - x), k);
}

void main() {
  vec4 positionBuffer = texture2D(texturePosition, aTexCoord.xy);
  vec4 velocityBuffer = texture2D(textureVelocity, aTexCoord.xy);

  mat3 look = lookatMat(positionBuffer.rgb, velocityBuffer.rgb, vec3(0.0, 1.0, 0.0));
  float life = parabola(velocityBuffer.w, 1.);

  vec3 newPosition = positionBuffer.rgb * 5. + look * position * life;

  vUv = uv;
  vLife = life;
  vNormal = normalize(look * normal);
  vTexCoord = aTexCoord;
  
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
}