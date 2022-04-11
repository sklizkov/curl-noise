void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 velocityBuffer = texture2D(textureVelocity, uv);

  gl_FragColor = velocityBuffer;
}