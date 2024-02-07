const fs = require('fs')

const deleteFile = (linkFile) => {
  if (
    linkFile === 'avatar-default.png' ||
    linkFile === '/avatar-default.png'
  )
    return
  fs.unlink(`public/images${linkFile}`, (err) => {
    if (err) throw err
  })
}

const checkFileExist = (linkFile) => {
  return fs.existsSync(
    `public/images${linkFile}`,
    (err) => {
      return err ? false : true
    }
  )
}

module.exports = {
  deleteFile,
  checkFileExist
}
