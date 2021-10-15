import THREE from '@/common/libs/Three'
import Game from '@/core/Game'

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

export default class Scene{
  constructor(options = {}) {
    this.object3d = new THREE.Group()
    this.object2d = new THREE.Group()
    this.preload = options.preload || {} // 预加载资源
    Game.scene.add(this.object3d)
    Game.camera.add(this.object2d)
  }
  add(obj) {
    if (obj.type === '3d') {
      this.object3d.add()
    } else {
      this.object2d.add()
    }
  }
  remove(obj) {
    if (obj.type === '3d') {
      this.object3d.remove()
    } else {
      this.object2d.remove()
    }
  }
  update() {
    for (const item of this.object2d) {
      item.update()
    }
    for (const item of this.object3d) {
      item.update()
    }
  }
  destroy() {
    Game.scene.remove(this.object3d)
    Game.camera.remove(this.object2d)
  }
}