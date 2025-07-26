console.log('script loaded!')
import { BASE_URL } from '../services/api'

// 🎀 Sounds
const sound = document.getElementById('click-sound')
document.addEventListener('click', (event) => {
  const clickable = event.target.closest(
    'button, input, select, textarea, label, a'
  )
  if (!clickable) return

  if (clickable.tagName.toLowerCase() === 'a') {
    event.preventDefault()
    sound.currentTime = 0
    sound.play()
    const href = clickable.href
    setTimeout(() => {
      window.location.href = href
    }, 200)
  } else {
    sound.currentTime = 0
    sound.play()
  }
})

const typingSound = document.getElementById('typing-sound')

document.addEventListener('input', (event) => {
  const tag = event.target.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea') {
    typingSound.currentTime = 0
    typingSound.play()
  }
})

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none'
  }, 2000)
})

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('characterDropdown')
  const optionsList = dropdown.querySelector('.options-list')
  const selectedOption = dropdown.querySelector('.selected-option')
  const hiddenInput = document.getElementById('characterInput')
  const clickSound = document.getElementById('click-sound')

  const defaultOption = optionsList.querySelector('li[data-value="kitty"]')
  hiddenInput.value = 'kitty'
  selectedOption.innerHTML = defaultOption.innerHTML

  dropdown.addEventListener('click', () => {
    clickSound.currentTime = 0
    clickSound.play()
    optionsList.style.display =
      optionsList.style.display === 'block' ? 'none' : 'block'
  })

  optionsList.querySelectorAll('li').forEach((option) => {
    option.addEventListener('click', (e) => {
      e.stopPropagation()
      selectedOption.innerHTML = option.innerHTML
      hiddenInput.value = option.dataset.value
      optionsList.style.display = 'none'

      clickSound.currentTime = 0
      clickSound.play()
    })
  })

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      optionsList.style.display = 'none'
    }
  })
})

// 🎀 Characters
const characters = {
  kitty: {
    name: 'Kitty',
    base: '../public/images/kitty/base.png',
    moods: {
      happy: '../public/images/kitty/moods/happy.png',
      sad: '../public/images/kitty/moods/sad.png',
      hug: '../public/images/kitty/moods/hug.png',
      coffee: '../public/images/kitty/moods/coffee.png',
      tea: '../public/images/kitty/moods/tea.png',
      cook: '../public/images/kitty/moods/cook.png',
      sleep: '../public/images/kitty/moods/sleep.png',
      watch: '../public/images/kitty/moods/watch.png',
      baby: '../public/images/kitty/moods/baby.png',
      work: '../public/images/kitty/moods/work.png',
      family: '../public/images/kitty/moods/family.png'
    },
    outfits: {
      dress: '../public/images/kitty/outfits/dress.png',
      casual: '../public/images/kitty/outfits/casual.png',
      pjs: '../public/images/kitty/outfits/pjs.png'
    }
  },
  star: {
    name: 'Star',
    base: '../public/images/star/base.png',
    moods: {
      happy: '../public/images/star/moods/happy.png',
      sad: '../public/images/star/moods/sad.png',
      hug: '../public/images/star/moods/hug.png',
      coffee: '../public/images/star/moods/coffee.png',
      tea: '../public/images/star/moods/tea.png',
      cook: '../public/images/star/moods/cook.png',
      sleep: '../public/images/star/moods/sleep.png',
      watch: '../public/images/star/moods/watch.png',
      baby: '../public/images/star/moods/baby.png',
      work: '../public/images/star/moods/work.png',
      family: '../public/images/star/moods/family.png'
    },
    outfits: {
      dress: '../public/images/star/outfits/dress.png',
      casual: '../public/images/star/outfits/casual.png',
      pjs: '../public/images/star/outfits/pjs.png'
    }
  },
  ema: {
    name: 'Ema',
    base: '../public/images/ema/base.png',
    moods: {
      happy: '../public/images/ema/moods/happy.png',
      sad: '../public/images/ema/moods/sad.png',
      hug: '../public/images/ema/moods/hug.png',
      coffee: '../public/images/ema/moods/coffee.png',
      tea: '../public/images/ema/moods/tea.png',
      cook: '../public/images/ema/moods/cook.png',
      sleep: '../public/images/ema/moods/sleep.png',
      watch: '../public/images/ema/moods/watch.png',
      baby: '../public/images/ema/moods/baby.png',
      work: '../public/images/ema/moods/work.png',
      family: '../public/images/ema/moods/family.png'
    },
    outfits: {
      dress: '../public/images/ema/outfits/dress.png',
      casual: '../public/images/ema/outfits/casual.png',
      pjs: '../public/images/ema/outfits/pjs.png'
    }
  }
}
// 🎀 Home Characters Logic
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await fetch(`${BASE_URL}/auth/session`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
      console.error('Failed to fetch user info')
      return
    }

    const user = await res.json()
    const selectedCharacter = user.selectedCharacter || 'kitty'
    const char = characters[selectedCharacter.toLowerCase()]

    console.log('User selected character:', selectedCharacter)
    console.log('Character object:', char)

    const imgElement = document.getElementById('base-image')
    if (imgElement) {
      console.log('Updating image src to:', char.base)
      imgElement.src = char.base
      imgElement.alt = char.name
    } else {
      console.warn('Character image element not found')
    }
  } catch (err) {
    console.error('Error loading character:', err)
  }
})

const welcomeMsg = document.getElementById('welcome-msg')

const token = localStorage.getItem('token')

function getUserIdFromToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1])).id
  } catch {
    console.error('Invalid token')
    return null
  }
}

const userId = getUserIdFromToken(token)

const loginForm = document.getElementById('loginForm')
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed')
        }
        return response.json()
      })
      .then((data) => {
        localStorage.setItem('token', data.token)
        window.location.href = 'index.html'
      })
      .catch((error) => {
        alert(error.message)
        console.error('Login error:', error)
      })
  })
}

// 🎀 Mood Logic
document.addEventListener('DOMContentLoaded', async () => {
  const moodSelect = document.getElementById('mood-status')
  const moodDisplay = document.getElementById('mood-display')
  const characterImage = document.getElementById('base-image-mood')
  const token = localStorage.getItem('token')

  if (!moodSelect || !moodDisplay || !characterImage || !token) return

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.id
    } catch (err) {
      console.error('Invalid token')
      return null
    }
  }

  const userId = getUserIdFromToken(token)
  if (!userId) return

  const moodEmojis = {
    happy: 'Happy',
    sad: 'Sad',
    hug: 'Need a Hug',
    coffee: 'Coffee Time',
    tea: 'Tea Time',
    cook: 'Let Cook',
    sleep: 'Good Night',
    watch: 'Enjoy Your Time',
    baby: 'Baby Setting!',
    work: 'Focus!',
    family: 'Enjoy!'
  }

  const updateMoodDisplay = (moodKey) => {}

  const updateCharacterMoodImage = (characterKey, moodKey) => {
    const character = characters[characterKey.toLowerCase()]
    if (character && character.moods[moodKey]) {
      characterImage.src = character.moods[moodKey]
    } else {
      characterImage.src = character?.base || ''
    }
  }

  try {
    const res = await fetch(`${BASE_URL}/characters/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res.ok) {
      const character = await res.json()

      const currentMood = character.mood || 'happy'
      const selectedCharacter = character.selectedCharacter || 'kitty'

      moodSelect.value = currentMood
      updateMoodDisplay(currentMood)
      updateCharacterMoodImage(selectedCharacter, currentMood)

      console.log('Selected character:', selectedCharacter)
      console.log('Mood:', currentMood)
      console.log(
        'Image path:',
        characters[selectedCharacter]?.moods[currentMood]
      )

      moodSelect.addEventListener('change', async (e) => {
        const mood = e.target.value
        updateMoodDisplay(mood)
        updateCharacterMoodImage(selectedCharacter, mood)

        try {
          const res = await fetch(`${BASE_URL}/characters/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ mood })
          })

          if (!res.ok) throw new Error('Failed to update mood')
          const updated = await res.json()
          console.log('Mood updated in DB:', updated.mood)
        } catch (err) {
          console.error('Error updating mood:', err)
        }
      })
    }
  } catch (err) {
    console.error('Failed to load mood:', err)
  }
})

// 🎀 Outfit Logic
document.addEventListener('DOMContentLoaded', () => {
  const outfitButtons = document.querySelectorAll('.outfit-button')
  const baseImage = document.getElementById('base-image')
  const token = localStorage.getItem('token')
  const userId = getUserIdFromToken(token)

  const currentOutfit = {
    dress: null,
    casual: null,
    default: null,
    pjs: null
  }

  let selectedCharacter = 'kitty'
  function getUserIdFromToken(token) {
    try {
      return JSON.parse(atob(token.split('.')[1])).id
    } catch {
      console.error('Invalid token')
      return null
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  async function loadCharacter() {
    try {
      const res = await fetch(`${BASE_URL}/characters/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch character')
      const data = await res.json()

      selectedCharacter = data.selectedCharacter || 'kitty'

      if (data.character.outfit) {
        Object.assign(currentOutfit, data.character.outfit)
      }

      updateOutfitUI()
    } catch (err) {
      console.error('Error loading character outfit:', err)
    }
  }

  function updateOutfitUI() {
    let activeOutfit = null
    for (let key in currentOutfit) {
      if (currentOutfit[key]) {
        activeOutfit = key
        break
      }
    }

    if (activeOutfit && characters[selectedCharacter].outfits[activeOutfit]) {
      baseImage.src = characters[selectedCharacter].outfits[activeOutfit]
    } else {
      baseImage.src = characters[selectedCharacter].base
    }

    for (const part in currentOutfit) {
      const display = document.getElementById(part)
      if (display) {
        display.textContent = `${capitalize(part)}: ${
          currentOutfit[part] || 'None'
        }`
      }
    }

    outfitButtons.forEach((btn) => {
      const key = btn.id.replace('-btn', '')
      if (key === activeOutfit) {
        btn.classList.add('selected')
      } else {
        btn.classList.remove('selected')
      }
    })
  }

  async function saveOutfitToServer() {
    try {
      const res = await fetch(`${BASE_URL}/characters/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ outfit: currentOutfit })
      })
      if (!res.ok) throw new Error('Failed to save outfit')
      const data = await res.json()
      console.log('Outfit saved:', data.outfit)
    } catch (err) {
      console.error('Error saving outfit:', err)
    }
  }

  outfitButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const outfitKey = btn.id.replace('-btn', '')

      if (currentOutfit[outfitKey]) {
        currentOutfit[outfitKey] = null
      } else {
        for (let key in currentOutfit) currentOutfit[key] = null
        currentOutfit[outfitKey] = outfitKey
      }

      updateOutfitUI()
      saveOutfitToServer()
    })
  })

  if (token && userId) {
    loadCharacter()
  }
})

// 🎀 Countdown timer
let timerInterval = null
let timeRemaining = 0

const timerDisplay = document.getElementById('timer-display')
const customTimeInput = document.getElementById('custom-time')
const startBtn = document.getElementById('timer-start')
const stopBtn = document.getElementById('timer-stop')
const resetBtn = document.getElementById('timer-reset')

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

function startTimer() {
  if (timerInterval) return

  if (timeRemaining === 0) {
    const minutes = parseInt(customTimeInput.value)
    if (isNaN(minutes) || minutes < 1) {
      alert('Please enter a valid number of minutes.')
      return
    }
    timeRemaining = minutes * 60
    updateTimerDisplay()
  }

  timerInterval = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--
      updateTimerDisplay()
    } else {
      clearInterval(timerInterval)
      timerInterval = null
      alert("Time's up!")
    }
  }, 1000)

  customTimeInput.disabled = true
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
    customTimeInput.disabled = false
  }
}

function resetTimer() {
  stopTimer()
  const minutes = parseInt(customTimeInput.value) || 0
  timeRemaining = minutes * 60
  updateTimerDisplay()
  customTimeInput.disabled = false
}

startBtn.addEventListener('click', startTimer)
stopBtn.addEventListener('click', stopTimer)
resetBtn.addEventListener('click', resetTimer)

updateTimerDisplay()
