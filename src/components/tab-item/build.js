import { state } from '@/store/store'

const Names = {
  box: '地面盒子',
  house: '建筑物',
  npc: 'npc人物',
  object: '物体',
  decoration: '装饰'
}

export const createBuild = function (global) {
  for (const x in state.builds) {
    const list = state.builds[x]
    const name = Names[x]
    for (let i = 0; i < list.length; i++) {
    }
  }
}

export const deleteBuild = function (global) {
  
}