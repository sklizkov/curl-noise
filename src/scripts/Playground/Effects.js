import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import { PlaygroundExtension } from 'Scripts/Core'

// Shaders
import bloomVertexShader from 'Shaders/Effects/Bloom/vertex.glsl'
import bloomFragmentShader from 'Shaders/Effects/Bloom/fragment.glsl'

import blurVertexShader from 'Shaders/Effects/Blur/vertex.glsl'
import blurFragmentShader from 'Shaders/Effects/Blur/fragment.glsl'

import vignetteVertexShader from 'Shaders/Effects/Vignette/vertex.glsl'
import vignetteFragmentShader from 'Shaders/Effects/Vignette/fragment.glsl'


export default class Effects extends PlaygroundExtension {

  initialize() {
    // Viewport
    const { width, height, pixelRatio } = this.viewport

    // Composer
    this.effectComposer = new EffectComposer(this.props.renderer)
    this.effectComposer.setSize(width, height)
    this.effectComposer.setPixelRatio(pixelRatio)
    this.effectComposer.addPass(this.props.renderPass)

    // Bloom
    this.bloomComposer = new EffectComposer(this.props.renderer)
    this.bloomComposer.setSize(width, height)
    this.bloomComposer.setPixelRatio(pixelRatio)
    this.bloomComposer.renderToScreen = false
    this.bloomComposer.addPass(this.props.renderPass)

    const unrealBloomPass = new UnrealBloomPass()
    unrealBloomPass.strength = 1.5
    unrealBloomPass.radius = 0.25
    unrealBloomPass.threshold = 0.6
    this.bloomComposer.addPass(unrealBloomPass)

    this.shaderBloomPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
          uIntensity: { value: 1 },
        },
        vertexShader: bloomVertexShader,
        fragmentShader: bloomFragmentShader,
        defines: {}
      }),
      'baseTexture'
    )
    this.shaderBloomPass.needsSwap = true
    this.effectComposer.addPass(this.shaderBloomPass)

    if (this.gui) {
      const folder = this.gui.addFolder('Bloom')

      folder.add(unrealBloomPass, 'strength', 0, 2, .001)
      folder.add(unrealBloomPass, 'radius', 0, 2, .001)
      folder.add(unrealBloomPass, 'threshold', 0, 1, .001)

      folder.add(this.shaderBloomPass.uniforms.uIntensity, 'value', 0, 1, .1).name('Intensity')
    }

    // Blur
    this.blurPass = new ShaderPass({
      uniforms: {
        tDiffuse: {  value: null },
        uResolution: { value: new THREE.Vector2(width, height) },
        uStrength: { value: 1. },
      },
      vertexShader: blurVertexShader,
      fragmentShader: blurFragmentShader,
    })
    this.effectComposer.addPass(this.blurPass)

    if (this.gui) {
      const folder = this.gui.addFolder('Blur')

      folder.add(this.blurPass.uniforms.uStrength, 'value', 0, 1, .01).name('Strength')
    }

    // Vignette
    const vignetteOptions = {
      blendList: [ 'Normal', 'Subtract', 'Overlay' ],
      currentMode: 'Subtract',
    }

    this.vignettePass = new ShaderPass({
      uniforms: {
        tDiffuse: {  value: null },
        uOpacity: { value: .5 },
        uBlendMode: { value: 1 },
      },
      vertexShader: vignetteVertexShader,
      fragmentShader: vignetteFragmentShader,
    })
    this.effectComposer.addPass(this.vignettePass)

    if (this.gui) {
      const folder = this.gui.addFolder('Vignette')

      folder.add(vignetteOptions, 'currentMode', vignetteOptions.blendList).name('Blend Mode').onChange(next => {
        switch(next) {
          case 'Subtract':
            this.vignettePass.uniforms.uBlendMode.value = 1
            break
          case 'Overlay':
            this.vignettePass.uniforms.uBlendMode.value = 2
            break
          default:
            this.vignettePass.uniforms.uBlendMode.value = 0
        }
      })

      folder.add(this.vignettePass.uniforms.uOpacity, 'value', 0, 1, .01).name('Opacity')
    }
  }

  resize({ width, height, pixelRatio }) {
    this.effectComposer.setSize(width, height)
    this.effectComposer.setPixelRatio(pixelRatio)

    this.bloomComposer.setSize(width, height)
    this.bloomComposer.setPixelRatio(pixelRatio)

    this.blurPass.uniforms.uResolution.value = new THREE.Vector2(width, height)
  }

  tick({ timestamp, deltaTime, elapsedTime, frameCount }) {
    this.effectComposer.render()
    this.bloomComposer.render()
  }

}