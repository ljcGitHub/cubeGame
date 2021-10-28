
import THREE from '@/common/libs/Three'

export default class Build extends THREE.Group {
  constructor(option = {}, attribute = {}) {
    super()
    this.buildStatus = true
  }

  setBuildStatus(status) {
    if (this.mesh.material.uniforms.uBuildStatus) {
      this.buildStatus = status
      this.mesh.material.uniforms.uBuildStatus.value = status ? 1 : 0
    }
  }
}