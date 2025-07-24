const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    passwordDigest: { type: String, required: true },
    selectedCharacter: {
      type: String,
      enum: ['kitty', 'star', 'ema'],
      default: 'kitty'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
