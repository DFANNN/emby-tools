// 统一响应格式中间件

export const responseHandler = (req, res, next) => {
  res.success = (data = null, message = '操作成功') => {
    res.json({ code: 200, message: message, data })
  }
  res.error = (message = '操作失败', code = 500) => {
    res.json({ code, message, data: null })
  }

  next()
}
