import Animation from '@/core/Animation'

export const buildItemCreateAnimation = function () {
  let startValue = 0
  let endValue = 0
  let scaleValue = 0
  let target = null
  const animation = new Animation(['Bounce.easeOut', 'Back.easeOut'], 400, v => {
    target.mesh.position.y = startValue + v[0] * (endValue - startValue)
    target.mesh.scale.y = v[1] * scaleValue
  }, () => {
    window.target = target
    target = null
  })
  return function (mesh) {
    target = mesh
    startValue = target.mesh.position.y + 30
    endValue = target.mesh.position.y
    scaleValue = target.mesh.scale.y
    animation.reset().play()
  }
}()