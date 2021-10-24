// 物理盒子
export const physical = {
  type: 'static', // 刚体类型 static静态 / dynamic动态
  trigger: false, // 是否触发器
  width: 20, // 刚体盒子宽度
  height: 20, // 刚体盒子高度
  depth: 20, // 刚体盒子深度
  force: { x: 0, y: 0, z: 0 }, // 受力值
  isOnGround: true, // 是否地面
}

// 获取包围盒
export const creatPhysicalBox = function (position, option) {
  const box = new THREE.Box3()
  const size = { x: option.width / 2, y: option.height / 2, z: option.depth / 2 }
  box.setFromCenterAndSize(position, new THREE.Vector3(size.x, size.y, size.z))
  const helper = new THREE.Box3Helper(box, 0xffffff)
  return helper
}

// 获取盒子的最大和最小边界
export const getBoxBorder = function (position, option) {
  const size = { x: option.width / 2, y: option.height / 2, z: option.depth / 2 }
  return {
    max: {
      x: position.x + size.x,
      y: position.y + size.y,
      z: position.z + size.z
    },
    min: {
      x: position.x - size.x,
      y: position.y - size.y,
      z: position.z - size.z
    }
  }
}

// 相交盒子
export const intersectsBox = function (a, b) {
  let overlapX = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x)
  if (overlapX < 0) return false
  let overlapY = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y)
  if (overlapY < 0) return false
  let overlapZ = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z)
  if (overlapZ < 0) return false
  let minOverlap = Math.min(overlapX, overlapY, overlapZ)
  let axis
  if (minOverlap === overlapX) {
    axis = 'x'
  } else if (minOverlap === overlapY) {
    axis = 'y';
  } else if (minOverlap === overlapZ) {
    axis = 'z'
  }
  return { minOverlap, axis }
}

// 是否需要碰撞响应
export const hasCollisionResponse = function (a) {
  if (a.trigger) return false // 触发器
  if (a.type === 'static') return false // 静态物体
  return true
}

// 碰撞算法
export const aabbBoxCollided = function (a, b) {
  const intersection = intersectsBox(a, b)
  if (intersection) {
    if (hasCollisionResponse(a)) {
      collisionResponse(a, b, intersection)
    }
    if (hasCollisionResponse(b)) {
      collisionResponse(b, a, intersection)
    }
    return true
  }
  return false
}

// 碰撞响应
export const collisionResponse = function (a, b, intersection) {
  switch (intersection.axis) {
    case 'x':
      a.position.x += Math.sign(a.position.x - b.position.x) * intersection.minOverlap
      a.force.x = 0
      break
    case 'y':
      var dir = Math.sign(a.position.y - b.position.y)
      if (dir === 1 && a.velY <= 0) {
        a.isOnGround = true
      }
      a.position.y = dir * intersection.minOverlap
      a.force.y = 0
      break
    case 'z':
      a.position.z += Math.sign(a.position.z - b.position.z) * intersection.minOverlap
      a.force.z = 0
      break
  }
}