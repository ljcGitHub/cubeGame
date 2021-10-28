import Game from '@/core/Game'
import { getEasingFn, Easing } from '@/core/modules/tween'
import { nullFunc } from '@/core/modules/shared'

export default class Animation {
  constructor(easing, duration, tick, callback) {
    this._animation = true
    this.setEasing(easing)
    this.setDuration(duration)
    this._tick = tick || nullFunc
    this._callback = callback || nullFunc
  }
  setEasing(easing) {
    if (easing && easing.constructor === Array) {
      this._easingFunc = easing.map(es => getEasingFn(es))
    } else {
      this._easingFunc = getEasingFn(easing)
    }
  }
  setDuration(duration) {
    this._step = 0
    this._maxStep = Math.ceil(duration / Game.fps)
    this._duration = duration || 400
  }
  nextTcik() {
    if (this._animation) {
      let val
      if (this._easingFunc.constructor === Array) {
        val = this._easingFunc.map(es => es(this._step / this._maxStep, 0, 1, 1))
      } else {
        val = this._easingFunc(this._step / this._maxStep, 0, 1, 1)
      }
      if (this._step >= this._maxStep) {
        this._callback(val)
      } else {
        const next = this._tick(val)
        this._step++
        if (next !== false) {
          Game.nextTick(() => {
            this.nextTcik()
          })
        }
      }
    }
  }
  play() {
    Game.nextTick(() => {
      this._animation = true
      this.nextTcik()
    })
    return this
  }
  stop() {
    this._animation = false
    return this
  }
  reset() {
    this._step = 0
    this._animation = false
    return this
  }
  destroy() {
    this._animation = false
    this._step = null
    this._callback = null
  }
}