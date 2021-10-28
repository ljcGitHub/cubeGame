import Ui from '@/core/Ui'
import NetWork from '@/core/NetWork'
import Bus from '@/store/bus'

let buttons = {}

export const createButtons = function (option) {
  const ui = new Ui({
    width: option.width,
    height: option.height,
    left: option.left,
    bottom: option.bottom,
    material: material.clone()
  })
  NetWork.loadTexture(option.imgUrl).then(texture => {
    ui.material.uniforms.u_texture.value = texture
    ui.material.needsUpdate = true
  })
  ui.touchstart = function () {
    ui.material.uniforms.status.value = 0.0
  }
  ui.touchend = function() {
    ui.material.uniforms.status.value = 1.0
  }
  return ui
}

export const showButtonsPopup = function (scene) {
  buttons.b1 = createButtons({
    width: 42,
    height: 42,
    left: 30,
    bottom: 10,
    imgUrl: './texture/button0.png'
  })
  buttons.b2 = createButtons({
    width: 42,
    height: 42,
    left: 72,
    bottom: 10,
    imgUrl: './texture/button1.png'
  })
  buttons.b2.click = function () {
    Bus.emit('showBuild')
  }
  scene.add(buttons.b1)
  scene.add(buttons.b2)
}

export const hideButtonsPopup = function (scene) {
  scene.remove(buttons.b1)
  scene.remove(buttons.b2)
}