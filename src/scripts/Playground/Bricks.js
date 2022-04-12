import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';

import { PlaygroundObject } from 'Scripts/Core'

// Shaders
import vertexShader from 'Shaders/Bricks/vertex.glsl'
import fragmentShader from 'Shaders/Bricks/fragment.glsl'

import fragmentPosition from 'Shaders/Bricks/Compute/position.glsl'
import fragmentVelocity from 'Shaders/Bricks/Compute/velocity.glsl'


export default class Bricks extends PlaygroundObject {

  initialize() {
    // GPU Computation Renderer
    this.gpuCompute = new GPUComputationRenderer(this.props.width, this.props.width, this.props.renderer)

    if (this.props.renderer.capabilities.isWebGL2 === false) this.gpuCompute.setDataType(THREE.HalfFloatType)

    // Buffers
    const dtPosition = this.gpuCompute.createTexture()
    const dtVelocity = this.gpuCompute.createTexture()

    for (let i = 0, l = Math.pow(this.props.width , 2) * 4; i < l; i += 4) {
      const x = Math.random() * 2 - 1
      const y = Math.random() * 2 - 1
      const z = Math.random() * 2 - 1
      const w = Math.random()

      dtPosition.image.data[i + 0] = x
      dtPosition.image.data[i + 1] = y
      dtPosition.image.data[i + 2] = z
      dtPosition.image.data[i + 3] = w

      dtVelocity.image.data[i + 0] = x
      dtVelocity.image.data[i + 1] = y
      dtVelocity.image.data[i + 2] = z
      dtVelocity.image.data[i + 3] = w
    }

    this.positionVariable = this.gpuCompute.addVariable('texturePosition', fragmentPosition, dtPosition)
    this.velocityVariable = this.gpuCompute.addVariable('textureVelocity', fragmentVelocity, dtVelocity)

    const dependencies = [ this.positionVariable, this.velocityVariable ]
    this.gpuCompute.setVariableDependencies(this.positionVariable, dependencies)
    this.gpuCompute.setVariableDependencies(this.velocityVariable, dependencies)

    this.velocityVariable.material.uniforms.uTime = { value: 0 }

    this.positionVariable.wrapS = THREE.RepeatWrapping
    this.positionVariable.wrapT = THREE.RepeatWrapping
    this.velocityVariable.wrapS = THREE.RepeatWrapping
    this.velocityVariable.wrapT = THREE.RepeatWrapping

    const error = this.gpuCompute.init()
    if (error !== null) throw new Error(error)

    // Geometry
    const brickGeometry = new THREE.BoxBufferGeometry(1, .5, 6)

    this.geometry = new THREE.InstancedBufferGeometry().copy(brickGeometry)
    this.geometry.instanceCount = Math.pow(this.props.width , 2)

    // Attributes
    const aTexCoord = new THREE.InstancedBufferAttribute(new Float32Array(Math.pow(this.props.width, 2) * 3), 3)
    for (let i = 0, l = aTexCoord.count; i < l; i++) {
      const x = (i % this.props.width) / this.props.width
      const y = Math.floor(i / this.props.width) / this.props.width
      const z = Math.random()

      aTexCoord.setXYZ(i, x, y, z)
    }
    this.geometry.setAttribute('aTexCoord', aTexCoord)

    // Material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        texturePosition: { value: null },
        textureVelocity: { value: null },
        width: { value: this.props.width },
        uAmbientColor: { value: new THREE.Color(1. * .2, 0. * .2, .25 * .2) },
        uSpecularColor: { value: new THREE.Color(0, 0, 0) },
        uShininess: { value: 1 },
        uColorA: { value: new THREE.Color(1., .6, .25) },
        uColorB: { value: new THREE.Color(1, 1, 1) },
        uRatio: { value: .96 },
        fogColor: { value: this.props.scene.fog.color },
        fogNear: { value: this.props.scene.fog.near },
        fogFar: { value: this.props.scene.fog.far },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      fog: true,
    })

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.scale.set(.1, .1, .1)

    this.add(this.mesh)

    // Debug
    if (this.gui) {
      const folder = this.gui.addFolder('Material')

      folder.addColor(this.material.uniforms.uAmbientColor, 'value').name('Ambient Color')
      folder.addColor(this.material.uniforms.uSpecularColor, 'value').name('Specular Color')
      folder.add(this.material.uniforms.uShininess, 'value', 0, 10, 1).name('Shininess')
      folder.addColor(this.material.uniforms.uColorA, 'value').name('Color A')
      folder.addColor(this.material.uniforms.uColorB, 'value').name('Color B')
      folder.add(this.material.uniforms.uRatio, 'value', 0, 1, .01).name('Ratio')
    }
  }

  tick({ deltaTime }) {
    this.gpuCompute.compute()

    this.material.uniforms.texturePosition.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture
    this.material.uniforms.textureVelocity.value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture

    this.velocityVariable.material.uniforms.uTime.value += deltaTime * .001


    this.material.uniforms.uTime.value += deltaTime * .001
  }

}