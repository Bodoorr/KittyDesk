require('dotenv').config()
const { app: electronApp, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')
const http = require('http')
const cors = require('cors')
const logger = require('morgan')
const fs = require('fs')

require('dotenv').config({ path: path.join(__dirname, '.env') })

const connectDB = require('./backend/db/index')

const uploadDir = path.join(electronApp.getPath('userData'), 'uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
// Routers
const AuthRouter = require('./backend/routes/AuthRouter')
const UserRouter = require('./backend/routes/UserRouter')
const CharacterRouter = require('./backend/routes/CharacterRouter')
const RecipeRouter = require('./backend/routes/RecipeRouter')

const PORT = process.env.PORT || 3001

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'src')))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(uploadDir))
app.use('/auth', AuthRouter)
app.use('/users', UserRouter)
app.use('/characters', CharacterRouter)
app.use('/recipes', RecipeRouter)

app.get('/', (req, res) => {
  res.send('Connected!')
})

async function createWindow() {
  await connectDB()

  // Start Express server
  const server = http.createServer(app)
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  // Create Electron window
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets', 'icons', 'app-icon.icns'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile(path.join(__dirname, 'src/sign-in.html'))
}

electronApp.whenReady().then(createWindow)

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') electronApp.quit()
})

electronApp.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
