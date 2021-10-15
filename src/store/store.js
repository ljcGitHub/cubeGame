import Bus from './bus'

export const state = {
  // 建造方块
  builds: [{
    cln: 'GrassBox',
    ps: { x: 0, y: 0, z: 0 },
    count: 1
  }, {
    cln: 'RockBox',
    ps: { x: 0, y: 0, z: 0 },
    count: 1
  }, {
    cln: 'SoilBox',
    ps: { x: 0, y: 0, z: 0 },
    count: 1
  }],
}

export const mutations = {
  closeDialog() {
    Bus.off('closeBuildDialog')
  }
}
