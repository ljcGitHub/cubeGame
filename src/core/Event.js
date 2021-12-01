import THREE from '@/common/libs/Three'
import Game from '@/core/Game'
import { getEventIntersectObjects, getEvents } from './modules/shared'

const touchType = ['touchstart', 'touchmove', 'touchend']

const W = window.innerWidth
const H = window.innerHeight
const mouse = new THREE.Vector2() // 鼠标坐标值
const raycaster = new THREE.Raycaster() // 射线
const instances = {}
const guid = () => 'uxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0
  const v = c === 'x' ? r : (r & 0x3 | 0x8)
  return v.toString(16)
})

touchType.forEach((type, index) => {
  document.addEventListener(type, (e) => {
    for (const x in instances) {
      instances[x][touchType[index]](e)
    }
  })
})

export default class Event {
  constructor(scene) {
    this.uid = guid()
    this.isTouch = false
    this.sceneInstance = scene
    this.intersectObjects = []
    this.touchstartExtens = []
    this.touchmoveExtens = []
    this.touchendExtens = []
    instances[this.uid] = this
  }

  touchstart(e) {
    this.isTouch = true
    const uis = {}
    getEventIntersectObjects(this.sceneInstance.object2d.children, uis)
    const uiEvents = Object.values(uis)
    const objs = {}
    getEventIntersectObjects(this.sceneInstance.object3d.children, objs)
    const objEvents = Object.values(objs)
    const intersectObjects = []
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touche = e.changedTouches[i]
      mouse.x = (touche.pageX / W) * 2 - 1
      mouse.y = - (touche.pageY / H) * 2 + 1
      raycaster.setFromCamera(mouse, Game.uiCamera)
      const uiIntersectObjects = raycaster.intersectObjects(uiEvents) || []
      if (uiIntersectObjects.length) {
        intersectObjects.push({ touche, intersects: getEvents(uiIntersectObjects) })
      } else {
        raycaster.setFromCamera(mouse, Game.obejctCamera)
        const objsIntersectObjects = raycaster.intersectObjects(objEvents) || []
        if (objsIntersectObjects.length) {
          intersectObjects.push({ touche, intersects: getEvents(objsIntersectObjects) })
        }
      }
    }
    this.dispatch('touchstart', intersectObjects)
    this.intersectObjects = [...this.intersectObjects, ...intersectObjects]
    for (let i = 0; i < this.touchstartExtens.length; i++) {
      this.touchstartExtens[i](e, this.intersectObjects)
    }
  }
  touchmove(e) {
    if (!this.isTouch) return false
    const intersectObjects = []
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touche = e.changedTouches[i]
      for (const data of this.intersectObjects) {
        if (data.touche.identifier === touche.identifier) {
          if (Math.abs(touche.clientX - data.touche.clientX) > 20 ||
            Math.abs(touche.clientY - data.touche.clientY) > 20) {
            data.isMove = true
          }
          intersectObjects.push({ touche, intersects: data.intersects})
        }
      }
    }
    this.dispatch('touchmove', intersectObjects)
    for (let i = 0; i < this.touchmoveExtens.length; i++) {
      this.touchmoveExtens[i](e, intersectObjects)
    }
  }
  touchend(e) {
    const intersectObjects = []
    const clickObjects = []
    const removeObjects = []
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touche = e.changedTouches[i]
      for (const data of this.intersectObjects) {
        if (data.touche.identifier === touche.identifier) {
          removeObjects.push(data)
          intersectObjects.push({ touche, intersects: data.intersects })
          if (!data.isMove) {
            clickObjects.push({ touche, intersects: data.intersects })
          }
        }
      }
    }
    for (const data of removeObjects) {
      this.intersectObjects.splice(removeObjects.indexOf(data), 1)
    }
    this.dispatch('touchend', intersectObjects)
    this.dispatch('click', clickObjects)
    for (let i = 0; i < this.touchendExtens.length; i++) {
      this.touchendExtens[i](e, intersectObjects)
    }
    this.isTouch = false
  }
  dispatch(type, intersectObjects) {
    for (const data of intersectObjects) {
      const { touche, intersects } = data
      for (const item of intersects) {
        if (item.object && item.object[type]) {
          const stopPropagation = item.object[type](touche)
          if (stopPropagation) return true
        }
      }
    }
  }
  destroy() {
    this.intersectObjects = []
    this.sceneInstance = null
    delete instances[this.uid]
  }
}