const db = require('~/models')

const createUser = async (data) => {
  const user = await db.User.create(data)
  return user
}

const getUserByEmail = async (email) => {
  return await db.User.findOne({ where: { email } })
}

const checkExistsEmail = async (email) => {
  return !!(await getUserByEmail(email))
}

const deleteUserById = async (id) => {
  return await db.User.destroy({ where: { id } })
}

const deleteAll = async () => {
  return await db.User.destroy({ where: {} })
}

module.exports = {
  createUser,
  getUserByEmail,
  checkExistsEmail,
  deleteUserById,
  deleteAll
}
