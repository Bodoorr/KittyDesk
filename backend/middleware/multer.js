const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { app: electronApp } = require('electron')

const uploadDir = path.join(electronApp.getPath('userData'), 'uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `image-${Date.now()}-${Math.floor(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

module.exports = multer({ storage })
