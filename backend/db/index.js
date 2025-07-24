const mongoose = require('mongoose')
const {MONGODB_URI}= require('../config')
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
