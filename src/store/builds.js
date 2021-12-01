import * as Grass from '@/model/box/grassBox'
import * as Soil from '@/model/box/soilBox'

import * as Berries from '@/model/object/berries'

const mock = []
for (let i = 0; i < 20; i++) {
  mock.push({
    code: 'Soil',
    asset: Soil.asset,
    getModel: Soil.getSoilBox,
    count: 2,
  })
}

export const getBuildsCode = function (code) {
  for (const x in builds) {
    for (let i = 0; i < builds[x].length; i++) {
      if (code === builds[x][i].code) {
        return builds[x][i].getModel
      }
    }
  }
}

export const builds = {
  box: [{
    code: 'Grass',
    asset: Grass.asset,
    getModel: Grass.getGrassBox,
    count: 1,
  }, {
    code: 'Soil',
    asset: Soil.asset,
    getModel: Soil.getSoilBox,
    count: 2,
  }
  ,...mock
  ],
  object: [{
    asset: Berries.asset,
    getModel: Berries.getBerries,
    count: 1,
  }
  ,...mock
  ]
}