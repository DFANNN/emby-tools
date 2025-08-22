import express from 'express'
import axios from 'axios'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { protocol, ip, port, Username, Pw } = req.body
  const url = `${protocol}://${ip}:${port}`
  console.log('url', url + '/Users/AuthenticateByName')

  const { data: response } = await axios.post(
    url + '/Users/AuthenticateByName',
    { Username, Pw },
    {
      headers: {
        'X-Emby-Client': 'emby-tools',
        'X-Emby-Device-Name': 'browser',
        'X-Emby-Device-Id': 'emby-tools-web',
        'X-Emby-Client-Version': '1.0.0'
      }
    }
  )
  console.log('response', response)
  const { User, AccessToken } = response
  const { Id, Name, ServerId, DateCreated, LastLoginDate, LastActivityDate } = User
  const params = { Id, Name, ServerId, DateCreated, LastLoginDate, LastActivityDate }

  return res.success(params, '登录成功')
})

export default router
