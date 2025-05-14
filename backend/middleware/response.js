/**
 * 自定义响应中间件
 *
 * 给 res 对象扩展两个方法：
 * - res.success(data, message): 用于统一成功响应格式
 * - res.error(message, code): 用于统一失败响应格式
 *
 * 使用方式：
 * app.use(response)
 */
const response = (req, res, next) => {
  res.success = (data = null, message = 'success') => {
    res.json({ code: 200, data, message })
  }
  res.error = (message = 'error', code = 500) => {
    res.json({ code, data: null, message })
  }

  next()
}

export default response
