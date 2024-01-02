const db = require('~/models')

const getRoleByName = async (name) => {
  return await db.Role.findOne({ where: { name } })
}

const createRoleForUser = async (user_id, role_id) => {
  return await db.UserRole.create({
    user_id,
    role_id
  })
}

const deleteAllRole = async () => {
  return await db.Role.destroy({ where: {} })
}

const deleteAllRoleUser = async () => {
  return await db.UserRole.destroy({ where: {} })
}

module.exports = {
  getRoleByName,
  createRoleForUser,
  deleteAllRole,
  deleteAllRoleUser
}
