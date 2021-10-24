import { getPixelRatio } from '@/core/modules/shared'

export const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

export const getText = function (option) {
  ctx.clearRect(0, 0, 10000, 10000)
  const size = option.fontSize ? getPixelRatio(option.fontSize) : 36
  let w = 0
  const h = size * 1.24
  for (let i = 0; i < option.text.length; i++) {
    if (/^[0-9a-zA-Z]*$/g.test(option.text[i])) {
      w += size * 0.56
    } else {
      w += size
    }
  }
  canvas.width = w
  canvas.height = h
  ctx.shadowColor = option.shadowColor || 'rgba(0, 0, 0, 0.4)'
  ctx.shadowOffsetX = option.shadowOffsetX || 2
  ctx.shadowOffsetY = option.shadowOffsetY || 2
  ctx.shadowBlur = option.shadowBlur || 2
	ctx.textBaseline = option.textBaseline || 'top'
  ctx.textAlign = option.textAlign || 'left'
  ctx.font = `${size}px bold Arial`
  ctx.fillStyle = option.color || '#333333'
  ctx.fillText(option.text, 0, 0)
  return {
    width: w,
    height: h,
    imgUrl: canvas.toDataURL('image/png', 1.0)
  }
}

export const getTextarea = function (option) {
  ctx.clearRect(0, 0, 10000, 10000)
  const width = option.width || 375
  const height = option.height || 375
  const texts = option.text.split('\n')
  const size = option.fontSize ? Ui.getPixelRatio(option.fontSize) : 36
  const lineHeight = option.lineHeight || 0
  const fontSize = size * 1.24
  let w = 0
  let h = size * 0.24
  canvas.width = width
  canvas.height = height
	ctx.textBaseline = 'top'
  ctx.font = `${size}px bold Arial`
  ctx.fillStyle = option.color || '#333333'
  let outWidth = 0
  const draws = []
  for (let i = 0; i < texts.length; i++) {
    const textArr = texts[i]
    for (let j = 0; j < textArr.length; j++) {
      let drawFontSize = size
      if (/^[0-9a-zA-Z]*$/g.test(textArr[j])) {
        drawFontSize= size / 2
      }
      draws.push({
        text: textArr[j],
        w,
        h
      })
      w += drawFontSize
      if (w > outWidth) {
        outWidth = w
      }
    }
    w = 0
    h += fontSize + lineHeight
  }
  canvas.width = outWidth
  canvas.height = h
	ctx.textBaseline = 'top'
  ctx.font = `${size}px Verdana`
  ctx.fillStyle = option.color || '#333333'
  for (let i = 0; i < draws.length; i++) {
    ctx.fillText(draws[i].text, draws[i].w, draws[i].h)
  }
  return {
    width: outWidth,
    height: h,
    imgUrl: canvas.toDataURL('image/png', 1.0)
  }
}

export const getTransparent = function (option = {}) {
  ctx.clearRect(0, 0, 10000, 10000)
  canvas.width = option.width || 375
  canvas.height = option.height || 375
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.0)'
  ctx.fill()
  return canvas.toDataURL('image/png', 1.0)
}

export const getBgTransparent = function (option = {}) {
  ctx.clearRect(0, 0, 10000, 10000)
  canvas.width = option.width || 375
  canvas.height = option.height || 375
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)'
  ctx.fill()
  return canvas.toDataURL('image/png', 1.0)
}

export const Color = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAYAAAAxWXB3AAAAAXNSR0IArs4c6QAAALNJREFUOE9j3Bng/d+Y9yuDsMEBhv/2KgyMn+Yz3Nz1kEE+SZTh26t7DF9MEhhm/fjHsPrJBwbFHZcYmM5fYWB8dolBQUiKwZxbnSGsXIjhz53DDDdv/2B4+uQ3w93n3xiefPzJ8OLrDwZT1Q8MxhX8DAduf2c4ck2Yge2hMENPSgzDjSu3GB7cf8pw9/Ejhvq2Nob1GzYxXL50geH69esMEhISDKNgNARGQ4D2IbB48WJGAGYiRgLaQLa+AAAAAElFTkSuQmCC'
