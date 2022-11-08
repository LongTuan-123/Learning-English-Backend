require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()

const database = require('./src/database')
database.connect()

const DEFAULT_SERVER_PORT = 4000
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : DEFAULT_SERVER_PORT

app.use(morgan('combined'))

app.get('/', (req, res) => {
  res.send('Hello1111 World!')
})

app.listen(SERVER_PORT)
console.log(`Example app listening on port ${SERVER_PORT}`)
