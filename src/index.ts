'use strict'

require('dotenv').config()

import express from 'express'
import morgan from 'morgan'
import userRoutes from './routes/authentication.route'
import initializeDBConnection from './database'
import bodyParser from 'body-parser'
import { cors } from './utils/cors'
import jwt from 'jsonwebtoken'

const DEFAULT_SERVER_PORT = 4000
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : DEFAULT_SERVER_PORT

initializeDBConnection()

const app = express()
app.use(morgan('combined'))

// Check CORS for website
app.use(cors)

// Check body response for api
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.use(userRoutes)

// Example How to check router.

// app.get('/hello', (req, res, next) => {
//   const token = req.headers.authorization

//   if (token) {
//     jwt.verify(token?.split(' ')[1], process.env.JWT_SECRET_KEY ?? '', function (err) {
//       if (err) {
//         res.status(404).json('Sai mẹ r')

//         return
//       }
//     })

//     res.status(200).json('Đúng mẹ rồi')
//   }
// })

app.listen(SERVER_PORT)
console.log(`Example app listening on port ${SERVER_PORT}`)
