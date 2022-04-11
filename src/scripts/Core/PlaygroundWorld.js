import * as THREE from 'three'
import GUI from 'lil-gui'

import { Viewport, Loop, Loader } from './Utils'
import PlaygroundObject from './PlaygroundObject'


export default class PlaygroundWorld {

  constructor(opt = {}) {
    this.assets = []

    this.debug = !!opt.debug

    this.gui = null
    this.viewport = null
    this.loop = null
    this.loader = null
  }

  /**
   * Render
   */
  renderTo($container) {
    if ($container) {
      this.$container = $container

      this._r()
    } else {
      throw new Error('Missing "$container" property')
    }
  }

  _r() {
    this.target = new THREE.Object3D()

    if (this.debug) this.gui = new GUI()
    this.viewport = new Viewport()
    this.loop = new Loop()
    this.loader = new Loader()

    this.viewport.on('resize', next => this.resize(next))
    this.loop.on('tick', next => this.tick(next))

    this.initialize()

    this.loader.on('start', next => this.assetsStart(next))
    this.loader.on('progress', next => this.assetsLoading(next))
    this.loader.on('load', () => this.assetsReady())

    if (this.assets.length > 0) {
      this.loader.load(this.assets)
    } else {
      this.loader.emit('start', { loaded: 0, total: 0 })
      this.loader.emit('progress', { loaded: 0, total: 0 })
      this.loader.emit('load')
    }

    this.loop.play()

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
   * Loader
   */
  assetsStart({ loaded, total }) {}

  assetsLoading({ loaded, total }) {}

  assetsReady() {}

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
      const instance = new Obj({ viewport, loop, loader, gui }, props)._r()

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