export default class EventEmitter {

  constructor() {
    this._events = {}
  }

  on(event, handler) {
    if (!this._events[event]) this._events[event] = []
    this._events[event].push(handler)

    return this
  }

  off(event, handler) {
    const i = (this._events[event] || []).findIndex(h => h === handler)
    if (i > -1) this._events[event].splice(i, 1)
    if (this._events[event].length === 0) delete this._events[event]

    return this
  }

  emit(event, data) {
    (this._events[event] || []).forEach(handler => handler(data))

    return this
  }

}