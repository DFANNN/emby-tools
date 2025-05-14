import express from 'express'
import embyPoster from './routes/embyPoster.js'
import response from './middleware/response.js'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.use(response)
app.use('/emby', embyPoster)

app.listen(3001, () => {
  console.log('Server listening on port 3001')
})
