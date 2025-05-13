import express from 'express'
import embyPoster from './routes/embyPoster.js'

const app = express()
app.use('/embyPoster', embyPoster)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3001, () => {
  console.log('Server listening on port 3001')
})
