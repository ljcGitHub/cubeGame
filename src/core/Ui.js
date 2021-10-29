import THREE from '@/common/libs/Three'
import NetWork from './NetWork'
import { getTransparent } from '@/common/utils/canvas'
import {
  getPixelRatio,
  getPlaneGeometry,
} from '@/core/modules/shared'

const material = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(getTransparent()),
  depthWrite: false,
  transparent: true
})

export default class Ui extends THREE.Mesh{
  constructor(option = {}) {
    super(getPlaneGeometry(option), material.clone())
    this.option = option
    this.display = option.display || '2d' || '2.5d'
    if (this.display === '2.5d') this.createMesh()
    this.updateMesh()
    option.children && option.children.forEach(item => this.add(item))
  }

  update() {
    for (const item of this.children) {
      item.update && item.update()
    }
  }

  add(mesh) {
    super.add(mesh)
    mesh.updateMesh && mesh.updateMesh()
  }

  createMesh() {
    if (this.option.mesh) {
      this.mesh = this.option.mesh.clone()
      this.add(this.mesh)
    } else if (this.option.meshUrl) {
      NetWork.loadObjects(this.option.meshUrl).then(obj => {
        this.mesh = obj.clone()
        this.updateMesh()
        this.add(this.mesh)
      })
    }
  }

  updateMesh() {
    const { top, right, bottom, left, zIndex } = this.option
    this.updatePosition(top, right, bottom, left, zIndex)
    let updateTarget = null
    if (this.display === '2.5d') {
      if (this.mesh) {
        const size = this.option.size || 1
        const box = new THREE.Box3()
        this.mesh.geometry.computeBoundingBox()
        this.mesh.geometry.center()
        box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld)
        const s = getPixelRatio(size / (box.max.x - box.min.x)) * 0.8
        this.mesh.scale.set(s, s, s)
        this.mesh.rotation.set(Math.PI * 0.12, -Math.PI * 0.2, 0)
        updateTarget = this.mesh
      }
    } else {
      updateTarget = this
      this.geometry.dispose()
      this.geometry = getPlaneGeometry(this.option)
    }
    if (updateTarget === null) return false
    if (this.option.material) {
      updateTarget.material = this.option.material
      updateTarget.material.needsUpdate = true
    }
    if (this.option.texture) {
      if (updateTarget.material.constructor === THREE.ShaderMaterial) {
        updateTarget.material.uniforms.u_texture.value = texture
      } else {
        updateTarget.material.map = texture
      }
      updateTarget.material.needsUpdate = true
    } else if (this.option.imgUrl) {
      NetWork.loadTexture(this.option.imgUrl).then(texture => {
        if (updateTarget.material.constructor === THREE.ShaderMaterial) {
          updateTarget.material.uniforms.u_texture.value = texture
        } else {
          updateTarget.material.map = texture
        }
      })
    }
  }

  updatePosition(top, right, bottom, left, zIndex) {
    let { width, height, size } = this.option
    width = width || size
    height = height || size
    let W = window.innerWidth
    let H = window.innerHeight
    if (this.parent && this.parent.option) {
      W = getPixelRatio(this.parent.option.width) || window.innerWidth
      H = getPixelRatio(this.parent.option.height) || window.innerHeight
    }

    if (top !== undefined) {
      this.position.y = H / 2 - getPixelRatio(height) / 2 - getPixelRatio(top)
    }
    if (bottom !== undefined) {
      this.position.y = getPixelRatio(height) / 2 - H / 2 + getPixelRatio(bottom)
    }
    if (left !== undefined) {
      this.position.x = getPixelRatio(width) / 2 - W / 2 + getPixelRatio(left)
    }
    if (right !== undefined) {
      this.position.x = W / 2 - getPixelRatio(width) / 2 - getPixelRatio(right)
    }
    if (zIndex !== undefined) {
      this.position.z = zIndex
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