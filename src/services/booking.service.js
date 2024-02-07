var { Op } = require('sequelize')

const db = require('~/models')

const createBooking = async (data) => {
  return await db.Booking.create(data)
}

const countBookingOfPatient = async (patient_id) => {
  return await db.Booking.count({ where: { patient_id } })
}

const getClientBooking = async (patient_id) => {
  let bookings = await db.Booking.findAll({
    where: { patient_id },
    include: [
      {
        model: db.User,
        foreignKey: 'doctor_id',
        as: 'doctor_booking',
        attributes: ['fullName', 'avatar'],
        include: [
          {
            model: db.DoctorInfo,
            foreignKey: 'user_id',
            as: 'doctor_info',
            attributes: [
              'nameClinic',
              'addressClinic',
              'priceFrom',
              'priceTo',
              'description'
            ]
          },
          {
            model: db.Position,
            foreignKey: 'user_id',
            as: 'positions',
            attributes: ['id', 'name']
          }
        ]
      },
      {
        model: db.MedicalExaminationDay,
        foreignKey: 'medicalexaminationday_id',
        as: 'day'
      },
      {
        model: db.MedicalExaminationHour,
        foreignKey: 'medicalexaminationhour_id',
        as: 'hour'
      }
    ]
  })
  const data = []
  bookings.map((booking) => {
    booking.get({ plain: true })
    const { fullName, avatar } = booking.doctor_booking
    const {
      nameClinic,
      addressClinic,
      priceFrom,
      priceTo,
      description
    } = booking.doctor_booking.doctor_info
    data.push({
      id: booking.id,
      reason: booking.reason,
      status: booking.status,
      time: `Ngày ${booking.day.content}, ${booking.hour.content}`,
      doctor: {
        fullName,
        avatar,
        nameClinic,
        addressClinic,
        priceFrom,
        priceTo,
        description,
        positions: booking.doctor_booking.positions.map(
          (item) => item.name
        )
      }
    })
  })
  return data
}

const getDoctorBooking = async (doctor_id, status) => {
  const queries = { doctor_id }
  if (typeof status === 'string') {
    queries.status = status
  }
  let bookings = await db.Booking.findAll({
    where: queries,
    include: [
      {
        model: db.User,
        foreignKey: 'patient_id',
        as: 'patient_booking',
        attributes: [
          'fullName',
          'avatar',
          'address',
          'gender',
          'phone',
          'email'
        ]
      },
      {
        model: db.MedicalExaminationDay,
        foreignKey: 'medicalexaminationday_id',
        as: 'day'
      },
      {
        model: db.MedicalExaminationHour,
        foreignKey: 'medicalexaminationhour_id',
        as: 'hour'
      }
    ]
  })
  const data = []
  bookings.map((booking) => {
    booking.get({ plain: true })
    const {
      fullName,
      avatar,
      address,
      phone,
      email,
      gender
    } = booking.patient_booking
    data.push({
      id: booking.id,
      reason: booking.reason,
      status: booking.status,
      time: `Ngày ${booking.day.content}, ${booking.hour.content}`,
      patient: {
        fullName,
        avatar,
        address,
        phone,
        email,
        gender
      }
    })
  })
  return data
}

const getInfoBooking = async (id) => {
  let booking = await db.Booking.findOne({
    where: { id },
    include: [
      {
        model: db.User,
        foreignKey: 'doctor_id',
        as: 'doctor_booking',
        attributes: ['fullName', 'avatar'],
        include: [
          {
            model: db.DoctorInfo,
            foreignKey: 'user_id',
            as: 'doctor_info',
            attributes: [
              'nameClinic',
              'addressClinic',
              'priceFrom',
              'priceTo',
              'description'
            ]
          },
          {
            model: db.Position,
            foreignKey: 'user_id',
            as: 'positions',
            attributes: ['id', 'name']
          }
        ]
      },
      {
        model: db.User,
        foreignKey: 'patient_id',
        as: 'patient_booking',
        attributes: ['fullName', 'email']
      },
      {
        model: db.MedicalExaminationDay,
        foreignKey: 'medicalexaminationday_id',
        as: 'day'
      },
      {
        model: db.MedicalExaminationHour,
        foreignKey: 'medicalexaminationhour_id',
        as: 'hour'
      }
    ]
  })
  booking = booking.get({ plain: true })
  const { fullName } = booking.doctor_booking
  const {
    nameClinic,
    addressClinic,
    priceFrom,
    priceTo,
    description
  } = booking.doctor_booking.doctor_info
  booking = {
    id: booking.id,
    reason: booking.reason,
    status: booking.status,
    time: `Ngày ${booking.day.content}, ${booking.hour.content}`,
    doctor: {
      fullName,
      nameClinic,
      addressClinic,
      priceFrom,
      priceTo,
      description,
      positions: booking.doctor_booking.positions.map(
        (item) => item.name
      )
    },
    patient: {
      fullName: booking.patient_booking.fullName,
      email: booking.patient_booking.email
    }
  }
  return booking
}

const removeBookingOfPatient = async (id) => {
  return await db.Booking.destroy({ where: { id } })
}

const acceptBooking = async (listId) => {
  return await db.Booking.update(
    { status: 1 },
    { where: { id: listId } }
  )
}

const denyBooking = async (listId) => {
  return await db.Booking.update(
    { status: -1 },
    { where: { id: listId } }
  )
}

module.exports = {
  createBooking,
  denyBooking,
  acceptBooking,
  getInfoBooking,
  getClientBooking,
  getDoctorBooking,
  countBookingOfPatient,
  removeBookingOfPatient
}
