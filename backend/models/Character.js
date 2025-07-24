const mongoose = require('mongoose')

const CharacterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true , unique: true},
    name: { type: String, default: 'Kitty' },
    mood: { type: String, default: 'happy' },
    outfit: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Character', CharacterSchema)
