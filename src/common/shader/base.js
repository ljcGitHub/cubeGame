import THREE from '@/common/libs/Three'
import Game from '@/core/Game'

export default class Shader {
  constructor() {
    this.uniforms = {
      time: {
        value: 1.0
      }
    }
  }
  getShaderMaterial(vertexShader, fragmentShader, option = {}) {
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      ...option
    })
    return this.material
  }
  update() {
    this.uniforms.time.value += Game.fps
  }
}