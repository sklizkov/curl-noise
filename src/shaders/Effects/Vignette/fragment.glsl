uniform sampler2D tDiffuse;
uniform float uOpacity;
uniform float uBlendMode;

varying vec2 vUv;


// Subtract
float blendSubtract(float base, float blend) {
  return max(base+blend-1.0,0.0);
}

vec3 blendSubtract(vec3 base, vec3 blend) {
  return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendSubtract(vec3 base, vec3 blend, float opacity) {
  return (blendSubtract(base, blend) * opacity + base * (1.0 - opacity));
}

// Overlay
float blendOverlay(float base, float blend) {
  return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
  return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
  return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {
  float strength = distance(vUv * .5, vec2(0.5 - .25));

  vec3 diffuseColor = texture2D(tDiffuse, vUv).rgb;
  vec3 vignetteColor = mix(vec3(1.), vec3(0.), strength);

  vec3 color = diffuseColor;

  if (uBlendMode == 1.) {
    color = blendSubtract(diffuseColor, vignetteColor, uOpacity);
  } else if (uBlendMode == 2.) {
    color = blendOverlay(diffuseColor, vignetteColor, uOpacity);
  } else {
    color = mix(diffuseColor, mix(diffuseColor, vec3(0.), uOpacity), strength);
  }

  gl_FragColor = vec4(color, 1.);
}