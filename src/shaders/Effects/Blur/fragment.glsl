uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uStrength;

varying vec2 vUv;


#pragma glslify: blur = require('../../assets/blur.glsl')


void main() {
  float strength = distance(vUv, vec2(0.5));

  vec4 diffuseColor = texture2D(tDiffuse, vUv);
  vec4 blurColor = blur(tDiffuse, vUv, uResolution, vec2(uStrength));

  vec3 color = mix(diffuseColor.rgb, blurColor.rgb, strength);

  gl_FragColor = vec4(color, 1.);
}