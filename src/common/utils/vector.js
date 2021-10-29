// 向量的乘积
export const getVector3Dot = function (v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
}

// 向量的长度
export const getVectorLength = function (v) {
  if (v.z === undefined) {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
}

// 向量归一化
export const getVectorNormalize = function (v) {
  const scalar = 1 / getVectorLength(v)
  if (v.z === undefined) {
    return { x: v.x * scalar, y: v.y * scalar }
  }
  return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar }
}
