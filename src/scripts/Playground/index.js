import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

// Core
import { PlaygroundWorld } from 'Scripts/Core'

// ...
import Mouse from './Mouse'
import Effects from './Effects'

import Bricks from './Bricks'


export default class Playground extends PlaygroundWorld {

  initialize() {
    // Viewport
    const { width, height, pixelRatio } = this.viewport

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, .1, 30)

    this.camera.rotation.reorder('YXZ')
    // this.camera.position.set(0, 0, 7)

    // Scene
    this.scene = new THREE.Scene()

    this.scene.background = new THREE.Color(0x301206)
    this.scene.fog = new THREE.Fog(0x301206, 10, 15)

    this.scene.add(this.camera)
    this.scene.add(this.target) // !!!

    if (this.gui) {
      const folder = this.gui.addFolder('Fog')

      folder.addColor(this.scene.fog, 'color').name('Color').onChange(next => {
        this.scene.background = next
      })
      folder.add(this.scene.fog, 'near', 0, 100, .1).name('Near')
      folder.add(this.scene.fog, 'far', 0, 100, .1).name('Far')
    }

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true })

    this.renderer.sortObjects = false
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.toneMapping = THREE.ReinhardToneMapping

    this.renderer.setClearColor(0x000000, 1)
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(pixelRatio)

    this.$container.appendChild(this.renderer.domElement)

    // Orbit Controls
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbitControls.enableDamping = false
    this.orbitControls.enabled = false

    if (this.gui) {
      const folder = this.gui.addFolder('Camera')

      folder.add(this.orbitControls, 'enabled').name('Orbit Controls')
    }

    // Post Processing
    this.ext(Effects, {
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
      renderPass: new RenderPass(this.scene, this.camera),
    })

    // ...
    this.ext(Mouse, { 
      camera: this.camera,
      renderer: this.renderer,
      orbitControls: this.orbitControls,
    })

    // Objects
    this.add(Bricks, {
      renderer: this.renderer,
      scene: this.scene,
      width: 128,
    })
  }

  resize({ width, height, pixelRatio }) {
    // Camera
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    // Renderer
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(pixelRatio)
  }

  tick({ timestamp, deltaTime, elapsedTime, frameCount }) {
    this.orbitControls.update()

    // this.renderer.render(this.scene, this.camera)
  }

}