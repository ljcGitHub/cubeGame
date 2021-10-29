import THREE from '@/common/libs/Three'
import Game from '@/core/Game'
import Event from '@/core/Event'

/*
const options = {
  preload: {
    objs: ['./obj/box.obj'],
    gltfs: [],
    textures: [
      './texture/button0.png',
      './texture/button1.png',
      './texture/button2.png',
    ],
  }
}
*/

export default class Scene {
  constructor(options = {}) {
    this.object3d = new THREE.Group()
    this.object2d = new THREE.Group()
    this.object2d.lookAt(Game.uiCamera.position)
    Game.objectScene.add(this.object3d)
    Game.uiScene.add(this.object2d)
    this.event = new Event(this)
    this.preload = options.preload || {} // 预加载资源
  }
  add(obj) {
    if (obj.display === '3d') {
      this.object3d.add(obj)
    } else {
      this.object2d.add(obj)
    }
  }
  remove(obj) {
    if (obj.display === '3d') {
      this.object3d.remove(obj)
    } else {
      this.object2d.remove(obj)
    }
  }
  update() {
    for (const item of this.object2d.children) {
      item.update()
    }

    for (const item of this.object3d.children) {
      item.update()
    }
  }
  destroy() {
    this.event.destroy()
    const object3d = [...this.object3d]
    object3d.forEach(item => {
      item.destroy && item.destroy()
      this.remove(item)
    })
    const object2d = [...this.object2d]
    object2d.forEach(item => {
      item.destroy && item.destroy()
      this.remove(item)
    })
    Game.objectScene.remove(this.object3d)
    Game.uiScene.remove(this.object2d)
  }
}