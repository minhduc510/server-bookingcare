const db = require('~/models')

const getAllSpecialist = async () => {
  const specialist = await db.Specialist.findAll({
    attributes: ['id', 'html', 'text', 'name', 'image']
  })
  return specialist
}

const getSpecialist = async (id) => {
  const specialist = await db.Specialist.findOne({
    where: { id },
    attributes: ['id', 'html', 'text', 'name', 'image']
  })
  return specialist
}

const createSpecialist = async (data) => {
  const specialist = await db.Specialist.create(data)
  return specialist
}

const updateSpecialist = async (id, data) => {
  const specialist = await db.Specialist.findOne({
    where: { id }
  })
  specialist.set(data)
  return await specialist.save()
}

const removeSpecialist = async (id) => {
  const specialist = await db.Specialist.destroy({
    where: { id }
  })
  return specialist
}

module.exports = {
  getAllSpecialist,
  createSpecialist,
  getSpecialist,
  updateSpecialist,
  removeSpecialist
}
