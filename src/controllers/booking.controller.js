const { dirname } = require('path')
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')

const appDir = dirname(require.main.filename)
const ApiError = require('~/utils/ApiError')
const env = require('~/configs/environment')
const readHTMLFile = require('~/utils/readHTMLFile')
const formatCurrency = require('~/utils/formatCurrency')
const bookingService = require('~/services/booking.service')

const createBooking = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      status: 0,
      patient_id: req.jwtDecoded.userId
    }
    await bookingService.createBooking(data)
    return res.json({
      error: false,
      message: 'Đặt lịch thành công'
    })
  } catch (error) {
    next(error)
  }
}

const getClientBooking = async (req, res, next) => {
  try {
    const { userId } = req.jwtDecoded
    const bookings = await bookingService.getClientBooking(
      userId
    )
    bookings.forEach(
      (booking) =>
        (booking.doctor.avatar =
          req.protocol +
          '://' +
          req.get('host') +
          booking.doctor.avatar)
    )
    return res.json({
      error: false,
      data: bookings
    })
  } catch (error) {
    next(error)
  }
}

const getDoctorBooking = async (req, res, next) => {
  try {
    const { userId } = req.jwtDecoded
    const { status } = req.query
    const bookings = await bookingService.getDoctorBooking(
      userId,
      status
    )
    bookings.forEach(
      (booking) =>
        (booking.patient.avatar =
          req.protocol +
          '://' +
          req.get('host') +
          booking.patient.avatar)
    )
    return res.json({
      error: false,
      data: bookings
    })
  } catch (error) {
    next(error)
  }
}

const removePatientBooking = async (req, res, next) => {
  try {
    const { listIdBooking } = req.query

    for (const element of listIdBooking) {
      await bookingService.removeBookingOfPatient(element)
    }
    return res.json({
      error: false,
      message: 'Xóa lịch hẹn thành công'
    })
  } catch (error) {
    next(error)
  }
}

const acceptBooking = async (req, res, next) => {
  try {
    const { listIdBooking } = req.body

    for (const id of listIdBooking) {
      const booking = await bookingService.getInfoBooking(
        id
      )

      var transporter = nodemailer.createTransport({
        // config mail server
        service: 'Gmail',
        auth: {
          user: env.EMAIL,
          pass: env.EMAIL_PASS
        }
      })
      readHTMLFile(
        appDir + '/pages/booking-success.handlebars',
        function (err, html) {
          if (err) {
            throw new ApiError(400, err)
          }
          var template = handlebars.compile(html)
          var replacements = {
            reason: booking.reason,
            time: booking.time,
            fullNamePatient: booking.patient.fullName,
            fullNameDoctor: `${booking.doctor.positions.join(
              ','
            )},${booking.doctor.fullName}`,
            nameClinic: booking.doctor.nameClinic,
            addressClinic: booking.doctor.addressClinic,
            price: `${formatCurrency(
              booking.doctor.priceFrom
            )} - ${formatCurrency(booking.doctor.priceTo)}`
          }
          var htmlToSend = template(replacements)
          var mailOptions = {
            from: 'dtranminh20@gmail.com',
            to: booking.patient.email,
            subject: 'Đặt lịch thành công !!!',
            html: htmlToSend
          }
          transporter.sendMail(
            mailOptions,
            function (error) {
              if (error) {
                throw new ApiError(400, error)
              }
            }
          )
        }
      )
    }

    await bookingService.acceptBooking(listIdBooking)
    return res.json({
      error: false,
      message: 'Cập nhật lịch hẹn thành công'
    })
  } catch (error) {
    next(error)
  }
}

const denyBooking = async (req, res, next) => {
  try {
    const { listIdBooking } = req.body

    for (const id of listIdBooking) {
      const booking = await bookingService.getInfoBooking(
        id
      )

      var transporter = nodemailer.createTransport({
        // config mail server
        service: 'Gmail',
        auth: {
          user: env.EMAIL,
          pass: env.EMAIL_PASS
        }
      })
      readHTMLFile(
        appDir + '/pages/booking-deny.handlebars',
        function (err, html) {
          if (err) {
            throw new ApiError(400, err)
          }
          var template = handlebars.compile(html)
          var replacements = {
            reason: booking.reason,
            time: booking.time,
            fullNamePatient: booking.patient.fullName,
            fullNameDoctor: `${booking.doctor.positions.join(
              ','
            )},${booking.doctor.fullName}`,
            nameClinic: booking.doctor.nameClinic,
            addressClinic: booking.doctor.addressClinic,
            price: `${formatCurrency(
              booking.doctor.priceFrom
            )} - ${formatCurrency(booking.doctor.priceTo)}`
          }
          var htmlToSend = template(replacements)
          var mailOptions = {
            from: 'dtranminh20@gmail.com',
            to: booking.patient.email,
            subject: 'Lịch khám bị từ chối',
            html: htmlToSend
          }
          transporter.sendMail(
            mailOptions,
            function (error) {
              if (error) {
                throw new ApiError(400, error)
              }
            }
          )
        }
      )
    }
    await bookingService.denyBooking(listIdBooking)
    return res.json({
      error: false,
      message: 'Cập nhật lịch hẹn thành công'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createBooking,
  acceptBooking,
  denyBooking,
  getClientBooking,
  getDoctorBooking,
  removePatientBooking
}
