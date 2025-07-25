const multer = require('multer')
// const fs = require('fs')
const path = require('path')
// const { app: electronApp } = require('electron')

// const uploadDir = path.join(electronApp.getPath('userData'), 'uploads')

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true })
// }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'..' ,'uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extension = file.originalname.split('.').pop()
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`)
  }
})

const upload = multer({ storage: storage })

module.exports = upload
