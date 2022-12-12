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
import { SOCKET_KEYS } from './types/socket'

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

const users = {}

const socketToRoom = {}
const usersRoom = {}

io.on(SOCKET_KEYS.CONNECTION, (socket) => {
  socket.on(SOCKET_KEYS.USERS, (data) => {
    socket.join(data)
  })

  socket.on(SOCKET_KEYS.CONNECT_CHAT, function (data) {
    users[socket.id] = data
  })

  socket.on(SOCKET_KEYS.SEND_MESSAGE, (data) => {
    socket.to(data.to).emit(SOCKET_KEYS.RECEIVED_MESSAGE, data)
  })

  socket.on(SOCKET_KEYS.CHECK_ACTIVE, (data) => {
    for (const [key, value] of Object.entries(users)) {
      if (value === data.to) {
        socket.emit(SOCKET_KEYS.ACTIVE, true)
        break
      } else {
        socket.emit(SOCKET_KEYS.ACTIVE, false)
      }
    }
  })

  socket.on('join-room', (roomID) => {
    if (usersRoom[roomID]) {
      const length = usersRoom[roomID].length
      if (length === 4) {
        socket.emit('room-full')
        return
      }
      usersRoom[roomID].push(socket.id)
    } else {
      usersRoom[roomID] = [socket.id]
    }
    socketToRoom[socket.id] = roomID
    const usersInThisRoom = usersRoom[roomID].filter((id) => id !== socket.id)

    socket.emit('all-users', usersInThisRoom)
  })

  socket.on('sending-signal', (payload) => {
    io.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, callerID: payload.callerID })
  })

  socket.on('returning-signal', (payload) => {
    io.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: socket.id })
  })

  socket.on(SOCKET_KEYS.SEND_TYPING, (data) => {
    socket.to(data.to).emit(SOCKET_KEYS.IS_TYPING, data)
  })

  socket.on(SOCKET_KEYS.DISCONNECT, () => {
    delete users[socket.id]
    const roomID = socketToRoom[socket.id]
    let room = usersRoom[roomID]
    if (room) {
      room = room.filter((id) => id !== socket.id)
      usersRoom[roomID] = room
    }
  })
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
