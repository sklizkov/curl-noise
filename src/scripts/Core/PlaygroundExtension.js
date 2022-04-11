import * as THREE from 'three'


export default class PlaygroundExtension {

  constructor({ viewport, loop, loader, gui }, props) {
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

}