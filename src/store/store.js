import Bus from './bus'
import builds from './builds'

export const state = {
  // 建造方块
  builds,
  tabValue: ''
}

export const mutations = {
  closeDialog() {
    Bus.off('closeBuildDialog')
  }
}
