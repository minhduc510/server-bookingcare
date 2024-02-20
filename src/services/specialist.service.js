const db = require('~/models')

const getAllSpecialist = async () => {
  const specialist = await db.Specialist.findAll({
    attributes: ['id', 'html', 'text', 'name', 'image']
  })
  return specialist
}

const getSpecialist = async (id) => {
  let specialist = await db.Specialist.findOne({
    where: { id },
    attributes: ['id', 'html', 'text', 'name', 'image'],
    include: [
      {
        model: db.DoctorInfo,
        foreignKey: 'specialist_id',
        as: 'doctor',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [
          {
            model: db.User,
            foreignKey: 'user_id',
            as: 'doctor',
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            include: [
              {
                model: db.Position,
                foreignKey: 'user_id',
                as: 'positions',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      }
    ]
  })
  specialist = specialist.get({ plain: true })
  specialist.doctor = specialist.doctor.map((item) => ({
    id: item.doctor.id,
    avatar: item.doctor.avatar,
    fullName: item.doctor.fullName,
    positions: item.doctor.positions.map((position) => ({
      id: position.id,
      name: position.name
    })),
    description: item.description,
    nameClinic: item.nameClinic,
    addressClinic: item.addressClinic,
    html: item.html,
    priceFrom: item.priceFrom,
    priceTo: item.priceTo
  }))
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
