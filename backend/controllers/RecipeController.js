const { Recipe } = require('../models')

const GetAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 })
    res.json(recipes)
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching all recipes' })
  }
}

const GetRecipes = async (req, res) => {
  try {
    const userId = req.params.user_id
    const recipes = await Recipe.find({ user: userId }).sort({ createdAt: -1 })
    res.json(recipes)
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching recipes' })
  }
}

const GetRecipeById = async (req, res) => {
  try {
    const recipeId = req.params.recipe_id
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' })
    res.json(recipe)
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching recipe' })
  }
}

const CreateRecipe = async (req, res) => {
  try {
    const user = res.locals.payload
    console.log('User from token payload:', user)

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized: user missing' })
    }

    const recipeData = { ...req.body }

    recipeData.user = user.id || user._id

    if (typeof recipeData.ingredients === 'string') {
      recipeData.ingredients = JSON.parse(recipeData.ingredients)
    }
    if (typeof recipeData.steps === 'string') {
      recipeData.steps = JSON.parse(recipeData.steps)
    }

    if (req.file) {
      recipeData.images = [req.file.filename]
    }

    const newRecipe = new Recipe(recipeData)
    await newRecipe.save()
    res.status(201).json(newRecipe)
  } catch (error) {
    console.error('CreateRecipe error:', error)
    res.status(500).json({ msg: 'Error creating recipe' })
  }
}

const UpdateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.recipe_id
    const updateData = req.body

    if (typeof updateData.ingredients === 'string') {
      updateData.ingredients = JSON.parse(updateData.ingredients)
    }
    if (typeof updateData.steps === 'string') {
      updateData.steps = JSON.parse(updateData.steps)
    }

    if (req.file) {
      updateData.images = [req.file.filename]
    } else if (updateData.existingImage) {
      updateData.images = [updateData.existingImage]
    } else {
      updateData.images = []
    }

    delete updateData.existingImage

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updateData, {
      new: true
    })

    if (!updatedRecipe) return res.status(404).json({ msg: 'Recipe not found' })

    res.json(updatedRecipe)
  } catch (error) {
    console.error('UpdateRecipe error:', error)
    res.status(500).json({ msg: 'Error updating recipe' })
  }
}

const DeleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.recipe_id
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId)
    if (!deletedRecipe) return res.status(404).json({ msg: 'Recipe not found' })

    res.json({ msg: 'Recipe deleted successfully' })
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting recipe' })
  }
}

module.exports = {
  GetAllRecipes,
  GetRecipes,
  GetRecipeById,
  CreateRecipe,
  UpdateRecipe,
  DeleteRecipe
}
