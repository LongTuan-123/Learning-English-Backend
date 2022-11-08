require('dotenv').config()

const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect(
      `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )
    console.log('Connection success')
  } catch (err) {
    console.log('Connection fail')
  }
}

module.exports = { connect }
