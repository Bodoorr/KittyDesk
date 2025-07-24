const { Character, User } = require('../models')

const GetCharacterByUser = async (req, res) => {
  try {
    const userId = req.params.user_id || req.user.id

    const character = await Character.findOne({ user: userId })
    if (!character) {
      return res.status(404).json({ msg: 'Character not found' })
    }

    const user = await User.findById(userId).select('selectedCharacter')
    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    res.json({
      character,
      selectedCharacter: user.selectedCharacter || 'kitty'
    })
  } catch (error) {
    res
      .status(500)
      .json({ msg: 'Error fetching character', error: error.message })
  }
}

const UpdateCharacter = async (req, res) => {
  try {
    const userId = req.params.user_id || req.user.id
    const { outfit, mood } = req.body

    let character = await Character.findOne({ user: userId })

    if (!character) {
      character = new Character({ user: userId, outfit, mood })
    } else {
      if (outfit !== undefined) character.outfit = outfit
      if (mood !== undefined) character.mood = mood
    }

    await character.save()

    const user = await User.findById(userId).select('selectedCharacter')

    res.json({
      character,
      selectedCharacter: user?.selectedCharacter || 'kitty'
    })
  } catch (error) {
    res
      .status(500)
      .json({ msg: 'Error updating character', error: error.message })
  }
}

module.exports = {
  GetCharacterByUser,
  UpdateCharacter
}
