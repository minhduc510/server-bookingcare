const fs = require('fs')

const deleteFile = (linkFile) => {
  fs.unlink(`public/images${linkFile}`, (err) => {
    if (err) throw err
  })
}

module.exports = {
  deleteFile
}
