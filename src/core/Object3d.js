import THREE from '@/common/libs/Three'
import NetWork from './NetWork'
import { materialClone, getPixelRatio } from '@/core/modules/shared'
import Physical from '@/core/objectMixins/physical'
import Game from '@/core/Game'

export default class Object3d extends Physical {
  constructor(option = {}, attribute = {}) {
    super(option, attribute)
    this.option = option
    this.display = '3d'
    this.mesh = option.mesh
    this.add(option.mesh)
    this.updateMeshScale()
    this.updateMeshMaterial()
  }

  update() {
  }
  
  updateMeshScale() {
    const size = this.option.size || 20
    const box = new THREE.Box3()
    this.mesh.geometry.computeBoundingBox()
    box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld)
    const s = getPixelRatio(size / (box.max.x - box.min.x))
    this.mesh.scale.set(s, s, s)
  }

  updateMeshMaterial() {
    if (this.option.material) {
      this.mesh.material = materialClone(this.option.material, this.option.isNotMaterialClone)
      this.mesh.material.uniforms.u_texture = this.option.material.uniforms.u_texture
      this.mesh.material.uniforms.u_matCap = this.option.material.uniforms.u_matCap
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
  
  destroy() {
    const children = [...this.children]
    children.forEach(item => {
      item.destroy && item.destroy()
      this.remove(item)
    })
  }
}