// 由Image对象获取图片的Base64
// img: Image对象， width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
export function getBase64Image (img, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width || img.width
  canvas.height = height || img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const dataURL = canvas.toDataURL()
  return dataURL
}
// 根据网络地址获取图片的Base64
export function getBase64 (img) {
  const image = new Image()
  image.crossOrigin = ''
  image.src = img
  return new Promise((resolve, reject) => {
    image.onload = function () {
      const base64Data = getBase64Image(image)
      resolve(base64Data)
    }
  })
}
