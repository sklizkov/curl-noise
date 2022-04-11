import EventEmitter from './EventEmitter'
import throttle from './throttle'


export default class Viewport extends EventEmitter {

  constructor() {
    super()

    this.width = 0
    this.height = 0
    this.pixelRatio = 1

    this.resize = this.resize.bind(this)

    this.resize()
    window.addEventListener('resize', throttle(this.resize, 200))
  }

  resize() {
    const { innerWidth, innerHeight, devicePixelRatio } = window

    this.width = innerWidth
    this.height = innerHeight
    this.pixelRatio = Math.min(devicePixelRatio, 2)

    this.emit('resize', {
      width: this.width,
      height: this.height,
      pixelRatio: this.pixelRatio,
    })
  }

}