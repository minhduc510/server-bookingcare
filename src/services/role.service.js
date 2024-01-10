const db = require('~/models')

const getRoleAll = async () => {
  return await db.Role.findAll()
}

const getRoleByName = async (name) => {
  return await db.Role.findOne({
    where: { name }
  })
}

const createRoleForUser = async (user_id, role_id) => {
  return await db.UserRole.create({
    user_id,
    role_id
  })
}

const createBulkRoleForUser = async (data) => {
  return await db.UserRole.bulkCreate(data)
}

const deleteAllRole = async () => {
  return await db.Role.destroy({ where: {} })
}

const deleteAllRoleUser = async () => {
  return await db.UserRole.destroy({ where: {} })
}

const deleteAllRoleOfUser = async (user_id) => {
  return await db.UserRole.destroy({ where: { user_id } })
}

module.exports = {
  getRoleAll,
  getRoleByName,
  createRoleForUser,
  deleteAllRole,
  deleteAllRoleUser,
  createBulkRoleForUser,
  deleteAllRoleOfUser
}
