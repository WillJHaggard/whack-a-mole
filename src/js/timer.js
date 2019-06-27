class Timer {
  constructor(cb, delay) {
    this.onDone = cb
    this.timerId = undefined
    this.start = undefined
    this.remaining = delay

    this.resume()
  }
  resume() {
    const { timerId, onDone, remaining } = this
    if (timerId) return

    this.start = Date.now()
    window.clearTimeout(this.timerId)
    this.timerId = window.setTimeout(onDone, remaining)
  }
  stop() {
    const { timerId } = this
    window.clearTimeout(timerId)
  }
  pause() {
    const { timerId, start, remaining } = this
    this.remaining = remaining - Date.now() - start
  }
}

export default Timer
