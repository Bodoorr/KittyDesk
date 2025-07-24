const { User, Character } = require('../models')
const middleware = require('../middleware')

const Register = async (req, res) => {
  try {
    const { password, username, confirmPassword, character } = req.body

    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ msg: 'Password and confirm password do not match!' })
    }

    let existingUser = await User.findOne({ username })
    if (existingUser) {
      return res
        .status(400)
        .send({ msg: 'A user with that username has already been registered!' })
    }

    let passwordDigest = await middleware.hashPassword(password)

    if (!['kitty', 'star', 'ema'].includes(character)) {
      return res.status(400).json({ error: 'Invalid character selection' })
    }
    const user = await User.create({
      passwordDigest,
      username,
      selectedCharacter: character
    })

    await Character.create({
      user: user._id,
      name: user.username || 'kitty',
      mood: 'happy',
      outfit: 'default'
    })

    res.redirect('/sign-in.html')
  } catch (error) {
    console.log(error)
    res.status(500).send({
      msg: 'An error has occurred registering the user!'
    })
  }
}

const Login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).send({ status: 'Error', msg: 'Invalid username' })
    }
    let matched = await middleware.comparePassword(
      password,
      user.passwordDigest
    )

    if (!matched) {
      return res.status(401).send({ status: 'Error', msg: 'Invalid password' })
    }

    if (matched) {
      let payload = {
        id: user._id,
        username: user.username
      }
      let token = middleware.createToken(payload)
      return res.status(200).json({ token })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res
      .status(401)
      .send({ status: 'Error', msg: 'An error has occurred logging in!' })
  }
}

const CheckSession = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const user = await User.findById(userId).select(
      'username selectedCharacter'
    )

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('Error in CheckSession:', error)
    res.status(500).send({ status: 'Error', msg: 'Server error' })
  }
}

module.exports = {
  Register,
  Login,
  CheckSession
}
