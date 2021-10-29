import Ui from '@/core/Ui'
import { state } from '@/store/store'
import { material } from '@/common/material/uiMesh'
import { material as selectMaterial } from '@/common/material/select'
import { getText } from '@/common/utils/canvas'
import Game from '@/core/Game'

const Names = {
  box: '地面盒子',
  house: '建筑物',
  npc: 'npc人物',
  object: '物体',
  decoration: '装饰'
}

let select = null

export const click = function () {
  const code = this.option.code
  const content = this.parent
  state.buildSelectCode = code
  select.position.copy(this.position)
}

export const createBuild = function (global) {
  let top = 30
  material.clippingPlanes = global.clippingPlanes
  for (const x in state.builds) {
    const list = state.builds[x]
    const name = Names[x]
    const textImg = getText({ fontSize: 84, text: name, color: '#FFFFFF' })
    const text = new Ui({
      top,
      left: 20,
      width: textImg.width / 4,
      height: textImg.height / 4,
      imgUrl: textImg.imgUrl,
    })
    text.material.clippingPlanes = global.clippingPlanes
    top += textImg.height / 4 + 20
    global.content.add(text)
    const grid = 36
    const marginTop = 20
    const marginLeft = 32
    const num = 5
    let left = marginLeft
    for (let i = 0; i < list.length; i++) {
      const data = list[i]
      const item = new Ui({
        top,
        left,
        size: grid,
        display: '2.5d',
        material, meshUrl: data.asset,
        code: data.code
      })
      left += marginLeft + grid
      if (i % num === num - 1 || i === list.length - 1) {
        top += grid + marginTop
        left = marginLeft
      }
      item.touchstart = global.wrapper.touchstart
      item.touchmove = global.wrapper.touchmove
      item.touchend = global.wrapper.touchend
      item.click = click
      global.content.add(item)
    }
    top += 20
  }
  if (!select) {
    select = new Ui({
      top: 1000,
      left: 1000,
      width: 64,
      height: 64,
      imgUrl: './texture/select.png',
      material: selectMaterial,
      zIndex: 400
    })
    select.material.clippingPlanes = global.clippingPlanes
    select.update = function () {
      select.material.uniforms.u_time.value += Game.fps
    }
    global.content.add(select)
  }
  global.scrollHeight = top
}