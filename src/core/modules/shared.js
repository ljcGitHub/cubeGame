import THREE from '@/common/libs/Three'

export const clone = function (obj) {
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (obj[key].constructor === Date) {
          result[key] = new Date(obj[key].getTime())
        } else {
          result[key] = clone(obj[key])
        }
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

export const nullFunc = function () { }

export const hasEvents = function (item) {
  if (item.clipType) return false
  if (item.touchstart) return true
  if (item.touchmove) return true
  if (item.touchend) return true
  if (item.click) return true
}

export const getEventIntersectObjects = function (arrs, events = {}) {
  for (const item of arrs) {
    if (hasEvents(item)) {
      if (item.display === '2.5d') {
        events[item.uuid] = item.mesh
      } else if (item.display === '3d') {
        events[item.uuid] = item.mesh
      } else{
        events[item.uuid] = item
      }
    }
    getEventIntersectObjects(item.children, events)
  }
}

export const getEvents = function (arrs) {
  const object = arrs[0].object
  let target = object
  if (!target.display) {
    target = target.parent
  }
  return [{ ...object, object: target }]
}


export const getPixelRatio = size => size * window.innerWidth / 375

export const getPlaneGeometry = function (option) {
  const size = option.size || 10
  return new THREE.PlaneGeometry(getPixelRatio(option.width || size), getPixelRatio(option.height || size))
}

export const materialClone = function (material, isClone) {
  if (isClone) return material
  const m = material.clone()
  for (const key in material.uniforms) {
    const item = material.uniforms[key]
    if (item.type === 't') {
      m.uniforms[key] = item
    }
  }
  return m
}