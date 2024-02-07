const express = require('express')
const route = express.Router()

const bookingController = require('~/controllers/booking.controller')
const validate = require('~/middleware/validate')
const authMiddleware = require('~/middleware/authMiddleware')
const bookingSchema = require('~/validations/booking.validation')

route.post(
  '/',
  authMiddleware(),
  validate(bookingSchema.bookingSchema),
  bookingController.createBooking
)

route.get(
  '/doctor',
  authMiddleware(),
  bookingController.getDoctorBooking
)

route.get(
  '/client',
  authMiddleware(),
  bookingController.getClientBooking
)

route.delete(
  '/',
  authMiddleware(),
  bookingController.removePatientBooking
)

route.post(
  '/accept-booking',
  authMiddleware(),
  bookingController.acceptBooking
)

route.post(
  '/deny-booking',
  authMiddleware(),
  bookingController.denyBooking
)

module.exports = route
