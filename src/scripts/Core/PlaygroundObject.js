import * as THREE from 'three'


export default class PlaygroundObject {

  constructor({ viewport, loop, loader, gui }, props) {
    this.target = new THREE.Object3D()

    this.gui = gui
    this.viewport = viewport
    this.loop = loop
    this.loader = loader

    this.props = props
  }

  /**
   * Render
   */
  _r() {
    this.viewport.on('resize', next => this.resize(next))
    this.loop.on('tick', next => this.tick(next))

    this.initialize()

    return this
  }

  /**
   * Resize
   */
  resize({ width, height, pixelRatio }) {}

  /**
   * Loop
   */
  tick({ timestamp, deltaTime, elapsedTime, frameCount }) {}

  /**
   * Initialize
   */
  initialize() {}

  /**
   * Add
   */
  add(Obj, props = {}) {
    if (PlaygroundObject.isPrototypeOf(Obj)) {
      const { viewport, loop, loader, gui } = this
      const instance = new Obj({ viewport, loop, loader, gui }, props).render()

      this.target.add(instance.target)

      return instance.target
    } else {
      this.target.add(Obj)
    }
  }

  ext(Obj, props = {}) {
    const { viewport, loop, loader, gui } = this
    const instance = new Obj({ viewport, loop, loader, gui }, props)._r()

    return instance
  }

}