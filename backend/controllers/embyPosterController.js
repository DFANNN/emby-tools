import fs from 'node:fs'
import { createCanvas } from 'canvas'

export const generatePoster = async (req, res) => {
  const width = 640
  const height = 360
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // 获取请求中的 text
  const text = '默认文字' // 如果没有提供 text，使用默认文字

  // 背景色
  ctx.fillStyle = '#009688'
  ctx.fillRect(0, 0, width, height)

  // 文字样式
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px sans-serif'
  ctx.fillText(text, 50, 200)

  // 保存为文件
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync('./output.png', buffer)

  // 响应成功
  res.success({ data: 1 })
}
