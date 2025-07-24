const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    ingredients: [{ type: String }],
    steps: [{ type: String }],  
    images: [{ type: String }]      
  },
  { timestamps: true }
)

module.exports = mongoose.model('Recipe', recipeSchema)
