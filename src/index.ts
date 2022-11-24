'use strict'

require('dotenv').config()

import express from 'express'
import morgan from 'morgan'
import userRoutes from './routes/authentication.route'
import postRoutes from './routes/post.route'
import syncRoutes from './routes/sync.route'
import topicDeckRoutes from './routes/topicDeck.route'
import publicRoutes from './routes/public.route'
import privateRoutes from './routes/private.router'
import cardRoutes from './routes/card.route'
import initializeDBConnection from './database'
import bodyParser from 'body-parser'
import { cors } from './utils/cors'
import { Server } from 'socket.io'
import http from 'http'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken'

const DEFAULT_SERVER_PORT = 4000
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : DEFAULT_SERVER_PORT

initializeDBConnection()

const app = express()
app.use(morgan('combined'))

// Check CORS for website
app.use(cors)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  socket.on('users', (data) => {
    socket.join(data)
  })

  socket.on('send_msg', (data) => {
    console.log(data)
    socket.to(data.to).emit('received_msg', data)
  })

  // socket.on('disconnect', () => {
  //   console.log('User disconnected', socket.id)
  // })
})

// Check body response for api
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
// Write api public which don't need jwt in here
app.use(userRoutes)
app.use(publicRoutes)

// Verify access token
app.use((req, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY as string, function (err, decoded) {
          if (err) {
            if (err.name === TokenExpiredError.name) {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            } else {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            }
          }
        })
      }
    }

    // no token found -> this is authentication API
    return next()
  } catch (error) {
    console.error('[Verify JWT] Error: ', error)
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })
    return
  }
})

// Write api private which need jwt in here
app.use(postRoutes)
app.use(syncRoutes)
app.use(topicDeckRoutes)
app.use(cardRoutes)
app.use(privateRoutes)

server.listen(SERVER_PORT)
console.log(`Example app listening on port ${SERVER_PORT}`)
