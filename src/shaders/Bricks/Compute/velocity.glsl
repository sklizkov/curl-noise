uniform float uTime;

#pragma glslify: snoise = require('../../assets/simplex3.glsl')
#pragma glslify: curlNoise = require('../../assets/curl.glsl')


float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 velocityBuffer = texture2D(textureVelocity, uv);

  vec3 velocity = velocityBuffer.xyz;
  float life = velocityBuffer.w;

  life -= .005;

  if (life < .005) {
    life = 1.;

    velocity = vec3(
      random(uv + .234234) * 2. - 1.,
      random(uv + .017232) * 2. - 1.,
      random(uv + .532349) * 2. - 1.
    );
  }

  velocity += curlNoise(velocity * .1 + uTime * .1 - .25) * .1;

  gl_FragColor = vec4(velocity, life);
}