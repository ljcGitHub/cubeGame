import THREE from '@/common/libs/Three'
import NetWork from './NetWork'
import Game from '@/core/Game'
import { clone, getPixelRatio } from '@/core/modules/shared'
import {
  physical, creatPhysicalBox, getBoxBorder
} from '@/core/modules/physical'

export default class Object3d extends THREE.Group {
  constructor(option = {}, attribute = {}) {
    super()
    this.option = option
    this.display = '3d'
    this.mesh = option.mesh
    this.position = attribute.position || new THREE.Vector3()
    this.rotation = attribute.rotation || new THREE.Euler(0, 0, 0, 'XYZ')
    this.scale = attribute.scale
    this.physical = { ...clone(physical), ...(attribute.physical || {}) }
    this.add(option.mesh)
    this.updateMeshScale()
    this.updateMeshMaterial()
    this.updateMeshPosition()
  }

  update() {
  }
  
  updateMeshPosition() {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
  }
  updateMeshScale() {
    const size = this.scale || 20
    const box = new THREE.Box3()
    this.mesh.geometry.computeBoundingBox()
    box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld)
    const s = getPixelRatio(size / (box.max.x - box.min.x))
    this.mesh.scale.set(s, s, s)
  }

  updateMeshMaterial() {
    if (this.option.material) {
      this.mesh.material = this.option.material
      this.mesh.material.needsUpdate = true
    } else if (this.option.texture) {
      this.mesh.material.map = texture
      this.mesh.material.needsUpdate = true
    } else if (this.option.imgUrl) {
      NetWork.loadTexture(this.option.imgUrl).then(texture => {
        this.mesh.material.map = texture
        this.mesh.material.needsUpdate = true
      })
    }
  }

  creatPhysicalBox() {
    creatPhysicalBox(this.position, option)
  }

  destroy() {
    this.children.forEach(item => {
      item.destroy && item.destroy()
      this.remove(item)
    })
  }
}