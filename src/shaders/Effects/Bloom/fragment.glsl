uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
uniform float uIntensity;

varying vec2 vUv;


void main() {
  vec4 baseColor = texture2D( baseTexture, vUv );
  vec4 bloomColor = texture2D( bloomTexture, vUv );

  gl_FragColor = mix(baseColor, bloomColor, uIntensity);
}