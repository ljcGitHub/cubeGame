import THREE from '@/common/libs/Three'
import Ui from '@/core/Ui'
import { getPixelRatio } from '@/core/modules/shared'
import { state } from '@/store/store'
import { material } from '@/common/material/tabsButton'
import Animation from '@/core/Animation'
import { createBuild } from '@/components/tab-item/build'

const WrapperWidth = 375
const WrapperHeight = 375
const OPTIONS = ['ts','build','skills','pack']
const ITEMMAP = {
  ts: './texture/ts.png',
  build: './texture/build.png',
  skills: './texture/skills.png',
  pack: './texture/pack.png',
}
const getNow = () => new Date()

export const global = {}

const click = function () {
  const name = this.option.name
  global.tabHeader.forEach(item => {
    item.material.uniforms.select.value = item.option.name === name ? 1.0 : 0.0
  })
  // 关闭裁剪，弹窗一开始就裁剪很难看
  global.clippingPlanes[0]._constant = global.clippingPlanes[0].constant
  global.clippingPlanes[0].constant = 0
  if (state.tabValue !== name) {
    const children = [...global.content.children]
    children.forEach(item => global.content.remove(item))
    state.tabValue = name
    global.close.visible = true
    global.scrollAnimation.reset()
    global.animation.setEasing('Back.easeOut')
    showTabsAnimation()
    createContentItem()
  }
}

// 创建弹窗的内容
const createContentItem = function () {
  if (state.tabValue === 'ts') {

  } else if (state.tabValue === 'build') {
    createBuild(global)
  } else if (state.tabValue === 'skills') {

  } else if (state.tabValue === 'pack') {

  }
}

const touchstart = function () {
  this.material.uniforms.status.value = 0.0
}
const touchend = function () {
  this.material.uniforms.status.value = 1.0
}

// 创建弹窗动画
const createTabsAnimation = function (params) {
  global.sv = 0
  global.ev = 0
  global.animation = new Animation('Back.easeOut', 400, v => {
    global.wrapper.position.y = global.sv + v * (global.ev - global.sv)
  }, () => {
    // 开启裁剪
    if (global.clippingPlanes && global.clippingPlanes[0] && global.clippingPlanes[0]._constant) {
      global.clippingPlanes[0].constant = global.clippingPlanes[0]._constant
    }
    global.clippingPlanes[0].constant = global.clippingPlanes[0]._constant
    global.wrapper.position.y = global.ev
  })
  global.hideY = global.wrapper.position.y
  global.wrapper.updatePosition(undefined, undefined, -100, 0, undefined)
  global.showY = global.wrapper.position.y
  global.wrapper.position.y = global.hideY
}

// 显示弹窗动画
const showTabsAnimation = function (params) {
  global.sv = global.wrapper.position.y
  global.ev = global.showY
  global.animation.reset().play()
  global.content.position.y = 0
  global.clippingPlanes
}
// 关闭弹窗动画
const hideTabsAnimation = function (params) {
  global.sv = global.wrapper.position.y
  global.ev = global.hideY
  global.animation.reset().play()
  global.content.position.y = 0
}

// 创建滚动动画
global.startScroll = 0
global.endScroll = 0
global.scrollAnimation = new Animation('Quint.easeOut', 1200, v => {
  global.content.position.y = global.startScroll + v * (global.endScroll - global.startScroll)
}, () => {
  global.content.position.y = global.endScroll
})

export const createTabs = function (scene, options = OPTIONS) {
  // 外层容器
  global.wrapper = new Ui({
    bottom: -WrapperHeight,  left: 0,
    width: WrapperWidth, height: WrapperHeight,
    imgUrl: './texture/tabs.png',
  })

  // 滚动内容
  global.content = new Ui({ top: 0, left: 0, width: WrapperWidth, height: WrapperHeight, name: 'content' })
  
  // 头部内容
  global.tabHeader = []
  for (let i = 0; i < options.length; i++) {
    const width = 42, height = (width * 44) / 48
    const item = new Ui({
      top: -height, left: 15 + i * (width + 5),
      width: width, height: height,
      imgUrl: ITEMMAP[options[i]],
      material: material.clone(),
      name: options[i]
    })
    item.click = click
    item.touchstart = touchstart
    item.touchend = touchend
    global.tabHeader.push(item)
    global.wrapper.add(item)
  }

  // 关闭按钮
  const _w = 32, _h = (_w * 32) / 40
  global.close = new Ui({
    top: -_h, right: _h,
    width: _w, height: _h,
    imgUrl: './texture/tabClose.png',
    material: material.clone(),
    name: 'close'
  })
  global.close.touchstart = touchstart
  global.close.touchend = touchend
  global.close.material.uniforms.select.value = 1.0
  global.close.click = function () {
    global.scrollAnimation.reset()
    global.animation.setEasing('Quart.easeOut')
    hideTabsAnimation()
    global.tabHeader.forEach(item => {
      item.material.uniforms.select.value = 0.0
    })
    global.close.visible = false
    state.tabValue = ''
  }
  global.close.visible = false

  // 创建动画
  createTabsAnimation()

  // 滚动内容设置
  const dsp = getPixelRatio(WrapperHeight) / 2 - window.innerHeight / 2 + getPixelRatio(WrapperHeight / 2 - 120)
  global.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, -1, 0), dsp)]

  global.wrapper.touchstart = function (e) {
    global.startY = global.content.position.y
    global.moveY = e.pageY
    global.startTime = getNow()
    global.startScroll = global.content.position.y
    global.endScroll = global.content.position.y
    global.scrollAnimation.reset()
  }
  global.wrapper.touchmove = function (e) {
    let deltaY = e.pageY - global.moveY
    const timestamp = getNow()
    global.deltaY = deltaY
    global.moveY = e.pageY
    global.content.position.y -= deltaY
    if (timestamp - global.startTime > 300) {
      global.startTime = timestamp
      global.startY = global.content.position.y
    }
  }
  global.scrollHeight = WrapperHeight
  global.wrapper.touchend = function (e) {
    global.endTime = getNow()
    let duration = global.endTime - global.startTime
    const current = global.content.position.y
    const distance = current - global.startY
    if (duration < 300 && distance !== 0) {
      const speed = Math.abs(distance) / duration
      const newY = speed * global.scrollHeight / 4
      global.startScroll = global.content.position.y
      global.endScroll = global.content.position.y + newY * distance / Math.abs(distance)
      const scrollMaxHeight = getPixelRatio(Math.max(0, global.scrollHeight - WrapperHeight + 100))
      const scrollMinHeight = 0
      if (global.endScroll > scrollMaxHeight) {
        global.endScroll = scrollMaxHeight
      } else if (global.endScroll < scrollMinHeight) {
        global.endScroll = scrollMinHeight
      }
      global.scrollAnimation.reset().play()
    }
  }

  global.wrapper.add(global.close)
  global.wrapper.add(global.content)
  scene.add(global.wrapper)
}

export const deleteTabs = function () {
}