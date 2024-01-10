const multer = require('multer')

const ApiError = require('~/utils/ApiError')
const handleFile = require('~/utils/handleFile')

let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images')
  },
  filename: (req, file, callback) => {
    const extensionFile =
      file.originalname.split('.')[
        file.originalname.split('.').length - 1
      ]
    let math = ['image/png', 'image/jpeg']
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file ${file.originalname} is invalid. Only allowed to upload image jpeg or png.`
      return callback(errorMess, null)
    }
    let filename = `${Date.now()}.${extensionFile}`
    req.filename = filename
    callback(null, filename)
  }
})
let uploadFile = multer({ storage: diskStorage }).single(
  'file'
)

const uploadSingle = (req, res, next) => {
  uploadFile(req, res, (error) => {
    if (error) {
      next(new ApiError(412, error))
    }
    next()
  })
}

const checkFileExist = (req, res, next) => {
  if (!req.file) {
    next(new ApiError(400, 'No file uploaded'))
  }
  next()
}

module.exports = {
  uploadSingle,
  checkFileExist
}
