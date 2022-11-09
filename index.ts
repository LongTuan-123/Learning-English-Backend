'use strict'

require('dotenv').config()

import express from 'express'
import morgan from 'morgan'
import initializeDBConnection from './src/database'

const DEFAULT_SERVER_PORT = 4000
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : DEFAULT_SERVER_PORT

initializeDBConnection()

const app = express()
app.use(morgan('combined'))

app.get('/', (req, res) => {
  res.send('Hello1111 World!')
})

app.listen(SERVER_PORT)
console.log(`Example app listening on port ${SERVER_PORT}`)
