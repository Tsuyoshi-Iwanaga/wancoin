import express from 'express'
import https from 'https'
import router from './routes/routes'
import fs from 'fs'

const app = express()
const port = process.env.PORT || 3000
const origin = process.env.ORIGIN || 'http://localhost:8080'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors({
  origin: origin,
  credentials: true,
  optionsSuccessStatus: 200,
}))

app.use('/', router)

app.listen(port)
console.log('express start... : ' + port)