const bcrypt = require('bcrypt')

const comparePassword = async (
  plainPassword,
  encryptedPassword
) => {
  return await bcrypt.compare(
    plainPassword,
    encryptedPassword
  )
}

module.exports = {
  comparePassword
}
