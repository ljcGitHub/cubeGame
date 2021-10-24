import Game from '@/core/Game'
import Object3d from '@/core/Object3d'
import NetWork from '@/core/NetWork'
import { material } from '@/common/material/box'

export const asset = './obj/box.obj?o=grass'

export const getGrassBox = function (parent) {
  return new Promise((resolve, reject) => {
    NetWork.loadObjects(asset).then(_mesh => {
      const mesh = _mesh.clone()
      const obj = new Object3d({ mesh, material })
      resolve(obj)
    })
  })
}