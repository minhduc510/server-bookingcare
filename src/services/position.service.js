const db = require('~/models')

const getPositionAll = async () => {
  return await db.Position.findAll({
    attributes: ['id', 'name']
  })
}

const getPositionById = async (id) => {
  return await db.Position.findOne({
    where: { id }
  })
}

const createPosition = async (body) => {
  return await db.Position.create(body)
}

const updatePositionById = async (id, body) => {
  return await db.Position.update(body, {
    where: { id }
  })
}

const destroyPositionById = async (id) => {
  await db.PositionDoctor.destroy({
    where: { position_id: id }
  })
  return await db.Position.destroy({
    where: { id }
  })
}

const createBulkPositionForUser = async (data) => {
  return await db.PositionDoctor.bulkCreate(data)
}

const deleteBulkPositionForUser = async (user_id) => {
  return await db.PositionDoctor.destroy({
    where: { user_id }
  })
}

module.exports = {
  getPositionAll,
  getPositionById,
  createPosition,
  updatePositionById,
  destroyPositionById,
  createBulkPositionForUser,
  deleteBulkPositionForUser
}
