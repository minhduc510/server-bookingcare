const express = require('express')
const route = express.Router()

const ROLE_TYPES = require('~/constants/role')
const validate = require('~/middleware/validate')
const fileMiddleware = require('~/middleware/fileMiddleware')
const userValidation = require('~/validations/user.validation')
const authMiddleware = require('~/middleware/authMiddleware')
const userController = require('~/controllers/user.controller')

route.get(
  '/current',
  authMiddleware(),
  userController.userCurrent
)

route.get(
  '/clients',
  authMiddleware(ROLE_TYPES.ADMIN),
  userController.getClients
)

route.get(
  '/doctors',
  authMiddleware(ROLE_TYPES.ADMIN),
  userController.getDoctors
)

route.get(
  '/doctors/:doctorId',
  userController.getDoctorsDetail
)

route.get(
  '/outstanding-doctor',
  userController.getOutstandingDoctor
)

route.post(
  '/',
  authMiddleware(ROLE_TYPES.ADMIN),
  fileMiddleware.uploadSingle,
  validate(userValidation.userSchema),
  userController.createUser
)

route.get(
  '/:userId',
  authMiddleware(),
  userController.getUser
)

route.put(
  '/:userId',
  authMiddleware(),
  fileMiddleware.uploadSingle,
  validate(userValidation.userNotRequiredSchema),
  userController.updateUser
)

route.delete(
  '/:userId',
  authMiddleware(ROLE_TYPES.ADMIN),
  userController.deleteUser
)

route.post(
  '/outstanding-doctor',
  authMiddleware(ROLE_TYPES.ADMIN),
  validate(userValidation.outstandingDoctorSchema),
  userController.setOutstandingDoctor
)

module.exports = route
