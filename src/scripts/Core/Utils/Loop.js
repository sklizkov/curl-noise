import EventEmitter from './EventEmitter'


export default class Loop extends EventEmitter {

  constructor() {
    super()

    this.deltaTime = 0
    this.elapsedTime = 0
    this.currentTime = 0
    this.frameCount = 0

    this.tick = this.tick.bind(this)
    this._rAF = null
    // this._rAF = requestAnimationFrame(this.tick)
  }

  tick(timestamp) {
    const now = (performance || Date).now()

    this.deltaTime = now - this.currentTime
    this.elapsedTime += this.deltaTime
    this.currentTime = now
    this.frameCount += 1

    if (this.deltaTime > 60) this.deltaTime = 60

    this.emit('tick', {
      timestamp: timestamp,
      deltaTime: this.deltaTime,
      elapsedTime: this.elapsedTime,
      frameCount: this.frameCount,
    })

    this._rAF = requestAnimationFrame(this.tick)
  }

  play() {
    if (!this._rAF) {
      this._rAF = requestAnimationFrame(this.tick)
    }
  }

  stop() {
    this.deltaTime = 0
    this.elapsedTime = 0
    this.currentTime = 0
    this.frameCount = 0

    cancelAnimationFrame(this._rAF)
  }

}