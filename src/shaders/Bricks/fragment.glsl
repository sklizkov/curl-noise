uniform sampler2D texturePosition;
uniform sampler2D textureVelosity;
uniform vec3 uAmbientColor;
uniform vec3 uSpecularColor;
uniform float uShininess;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uRatio;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;
varying vec3 vNormal;
varying float vLife;
varying vec3 vTexCoord;


void main() {
  // Material
  vec3 viewDirection = normalize(cameraPosition);

  vec3 colorA = vTexCoord.z < uRatio ? uColorA : uColorB * 2.;
  vec3 colorB = colorA * .5;
  vec3 diffuseColor = mix(colorA, colorB, vUv.x);
  diffuseColor = mix(diffuseColor * .05, diffuseColor, vLife);
  vec3 lightPosition = normalize(vec3(100.));
  // vec3 lightPosition = normalize(cameraPosition);
  vec3 reflectDirection = normalize(reflect(-lightPosition, vNormal));

  vec3 ambient = uAmbientColor;
  vec3 diffuse = diffuseColor * max(dot(vNormal, lightPosition), 0.0);
  vec3 specular = uSpecularColor * pow(max(dot(viewDirection, reflectDirection), 0.), uShininess);

  vec3 color = ambient + diffuse + specular;

  if (uColorB == vec3(1., 1., 1.)) {
    color = vTexCoord.z < uRatio ? color : vec3(1.);
  }

  gl_FragColor = vec4(color, 1.);

  // FOG
  #ifdef USE_FOG
    #ifdef USE_LOGDEPTHBUF_EXT
      float depth = gl_FragDepthEXT / gl_FragCoord.w;
    #else
      float depth = gl_FragCoord.z / gl_FragCoord.w;
    #endif
    float fogFactor = smoothstep( fogNear, fogFar, depth );
    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
  #endif
}