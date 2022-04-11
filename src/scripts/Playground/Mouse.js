import * as THREE from 'three'

import { PlaygroundExtension } from 'Scripts/Core'


export default class Mouse extends PlaygroundExtension {

  initialize() {
    // Viewport
    const { width, height } = this.viewport

    // Spherical
    const sphericalOptions = { 
      radius: Math.max(1, height / width) * 7,
      phi: Math.PI * 0.4, 
      theta: 0, 
    }

    this.spherical = new THREE.Spherical(sphericalOptions.radius * 15, sphericalOptions.phi, Math.PI * 2)

    // Camera
    const cameraPosition = new THREE.Vector3()
    cameraPosition.setFromSpherical(this.spherical)

    this.props.camera.position.copy(cameraPosition)
    this.props.camera.position.add(new THREE.Vector3(0, 0, 0))
    this.props.camera.lookAt(new THREE.Vector3(0, 0, 0))

    // Move
    this.wheel = {
      radiusDelta: sphericalOptions.radius, 
      radiusShift: 0,
      thetaDelta: sphericalOptions.theta,
      thetaShift: 0,
    }

    // Double Click
    this.props.renderer.domElement.addEventListener('dblclick', () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

      if (!fullscreenElement) {
        const $canvas = this.props.renderer.domElement

        if ($canvas.requestFullscreen) {
          $canvas.requestFullscreen()
        } else if ($canvas.webkitRequestFullscreen) {
          $canvas.webkitRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      }
    })

    // Context Menu
    window.addEventListener('contextmenu', e => e.preventDefault())
  }

  /**
   * Loop
   */
  tick({ timestamp, deltaTime, elapsedTime, frameCount }) {
    // Spherical
    this.wheel.radiusShift = (this.wheel.radiusDelta - this.spherical.radius) * .05
    this.spherical.radius += this.wheel.radiusShift

    this.wheel.thetaShift = (this.wheel.thetaDelta - this.spherical.theta) * .01
    this.spherical.theta += this.wheel.thetaShift


    if (!this.props.orbitControls.enabled) {
      // Camera
      const cameraPosition = new THREE.Vector3()
      cameraPosition.setFromSpherical(this.spherical)

      this.props.camera.position.copy(cameraPosition)
      this.props.camera.position.add(new THREE.Vector3(0, 0, 0))
      this.props.camera.lookAt(new THREE.Vector3(0, 0, 0))
    }
  }

}