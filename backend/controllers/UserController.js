const { User } = require('../models')

const GetUserProfile = async (req, res) => {
  try {
    const userId = req.params.user_id
    const user = await User.findById(userId).select('-passwordDigest')
    if (!user) return res.status(404).json({ msg: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching user profile' })
  }
}

const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('username')
    res.json(users)
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching users' })
  }
}

module.exports = {
  GetUserProfile,
  GetAllUsers
}
