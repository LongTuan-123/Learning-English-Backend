require('dotenv').config()

import mongoose from 'mongoose'

const connection = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`
const initializeDBConnection = () => {
  mongoose.connect(connection)

  mongoose.connection.once('open', () => {
    console.log(`Connected to ${process.env.MONGODB_DATABASE} database`)
  })

  mongoose.connection.on('error', console.log)
}

export default initializeDBConnection
