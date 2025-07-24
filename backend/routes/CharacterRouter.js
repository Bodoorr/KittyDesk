const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const characterController = require('../controllers/CharacterController')

router.get(
  '/:user_id',
  middleware.stripToken,
  middleware.verifyToken,
  characterController.GetCharacterByUser
)

router.put(
  '/:user_id',
  middleware.stripToken,
  middleware.verifyToken,
  characterController.UpdateCharacter
)

module.exports = router
