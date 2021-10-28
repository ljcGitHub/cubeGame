class Dep{
  constructor() {
    this.events = {}
  }

  on(type, fn, context = this) {
    if (!this.events[type]) {
      this.events[type] = []
    }
    this.events[type].push([fn, context])
  }

  emit(type, ...args) {
    let events = this.events[type]
    if (!events)  return

    let len = events.length
    let eventsCopy = [...events]
    for (let i = 0; i < len; i++) {
      let event = eventsCopy[i]
      let [fn, context] = event
      if (fn) {
        fn.apply(context, args)
      }
    }
  }

  off(type, fn) {
    let events = this.events[type]
    if (!events)  return

    let count = events.length
    while (count--) {
      if (events[count][0] === fn || (events[count][0] && events[count][0].fn === fn)) {
        events[count][0] = undefined
      }
    }
    delete this.events[type]
  }
}

export default new Dep()