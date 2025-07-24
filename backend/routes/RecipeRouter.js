const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const recipeController = require('../controllers/RecipeController')
const upload = require('../middleware/multer')

router.get('/', recipeController.GetAllRecipes)

router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  upload.single('image'),
  recipeController.CreateRecipe
)

router.get('/:user_id', recipeController.GetRecipes)

router.get('/:recipe_id', recipeController.GetRecipeById)

router.put(
  '/:recipe_id',
  middleware.stripToken,
  middleware.verifyToken,
  upload.single('image'),
  recipeController.UpdateRecipe
)

router.delete(
  '/:recipe_id',
  middleware.stripToken,
  middleware.verifyToken,
  recipeController.DeleteRecipe
)

module.exports = router
