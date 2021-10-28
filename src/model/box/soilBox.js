import Game from '@/core/Game'
import Object3d from '@/core/Object3d'
import NetWork from '@/core/NetWork'
import Base from './base'

export const asset = './obj/box.obj?o=soil_soil.002'

export const getSoilBox = function (parent) {
  return new Promise((resolve, reject) => {
    NetWork.loadObjects(asset).then(_mesh => {
      const mesh = _mesh.clone()
      const obj = new Base({ mesh }, {
        width: 20, // 刚体盒子宽度
        height: 20, // 刚体盒子高度
        depth: 20, // 刚体盒子深度
      })
      resolve(obj)
    })
  })
}