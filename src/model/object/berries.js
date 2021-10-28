import Game from '@/core/Game'
import Object3d from '@/core/Object3d'
import NetWork from '@/core/NetWork'
import { material } from '@/common/material/box'
import Base from './base'

export const asset = './obj/box.obj?o=berries_berries.001'

export const getBerries = function (parent) {
  return new Promise((resolve, reject) => {
    NetWork.loadObjects(asset).then(_mesh => {
      const mesh = _mesh.clone()
      const obj = new Base({ mesh, material }, {
        width: 18, // 刚体盒子宽度
        height: 20, // 刚体盒子高度
        depth: 18, // 刚体盒子深度
      })
      resolve(obj)
    })
  })
}