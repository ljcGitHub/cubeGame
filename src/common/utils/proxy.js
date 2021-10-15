export default function (obj, key, val, func) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      return val
    },
    set: newVal => {
      val = newVal
      func()
    }
  })
}