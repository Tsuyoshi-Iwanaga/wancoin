import express from 'express'
import https from 'https'
import router from './routes/routes'
import fs from 'fs'

require('dotenv').config()
const path_key: string = process.env.HTTPS_KEY || ''
const path_cert: string = process.env.HTTPS_CERT || ''

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors())

app.use('/', router)

const server = https.createServer({
  key: fs.readFileSync(path_key),
  cert: fs.readFileSync(path_cert)
}, app)

server.listen(port)
console.log('express start... : ' + port)