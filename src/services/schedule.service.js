var { Op } = require('sequelize')

const db = require('~/models')
const handleTime = require('~/utils/handleTime')

const getDayByUserId = async (user_id) => {
  return await db.MedicalExaminationDay.findOne({
    where: { user_id }
  })
}

const getDayByUserTimestamp = async (
  user_id,
  timestamp
) => {
  return await db.MedicalExaminationDay.findOne({
    where: {
      [Op.and]: [{ user_id }, { timestamp }]
    }
  })
}

const getDays = async (user_id) => {
  return await db.MedicalExaminationDay.findAll({
    where: {
      user_id,
      timestamp: {
        [Op.gte]: handleTime.getTimestamp(new Date())
      }
    },
    attributes: ['id', 'content', 'timestamp', 'user_id'],
    include: [
      {
        model: db.MedicalExaminationHour,
        foreignKey: 'medicalexaminationday_id',
        as: 'hour',
        attributes: [
          'id',
          'content',
          'timestampTo',
          'user_id',
          'medicalexaminationday_id'
        ],
        where: {
          user_id,
          timestampTo: {
            [Op.gte]: handleTime.getTimestamp(new Date())
          }
        }
      }
    ]
  })
}

const createDay = async (body) => {
  return await db.MedicalExaminationDay.create(body)
}

const getAllHourUserTimestamp = async (user_id) => {
  return await db.MedicalExaminationHour.findAll({
    where: { user_id },
    attributes: [
      'id',
      'content',
      'timestampFrom',
      'timestampTo'
    ]
  })
}

const createHour = async (body) => {
  return await db.MedicalExaminationHour.create(body)
}

const createBulkHour = async (body) => {
  return await db.MedicalExaminationHour.bulkCreate(body)
}

const getHourByUserTimestamp = async (timestampTo) => {
  return await db.MedicalExaminationHour.findOne({
    where: { timestampTo }
  })
}

const findHourById = async (id) => {
  return await db.MedicalExaminationHour.findOne({
    where: { id }
  })
}

const removeHourById = async (id) => {
  return await db.MedicalExaminationHour.destroy({
    where: { id }
  })
}

const removeScheduleInPastById = async (user_id) => {
  await db.MedicalExaminationDay.destroy({
    where: {
      user_id,
      timestamp: {
        [Op.lte]: handleTime.getTimestamp(new Date())
      }
    }
  })
  return await db.MedicalExaminationHour.destroy({
    where: {
      user_id,
      timestampTo: {
        [Op.lte]: handleTime.getTimestamp(new Date())
      }
    }
  })
}

module.exports = {
  getDayByUserId,
  getDayByUserTimestamp,
  getDays,
  createDay,
  createBulkHour,
  getHourByUserTimestamp,
  getAllHourUserTimestamp,
  removeHourById,
  findHourById,
  createHour,
  removeScheduleInPastById
}
