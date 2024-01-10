const express = require('express')
const route = express.Router()

const ROLE_TYPES = require('~/constants/role')
const validate = require('~/middleware/validate')
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

route.post(
  '/',
  authMiddleware(ROLE_TYPES.ADMIN),
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
  validate(userValidation.userNotRequiredSchema),
  userController.updateUser
)

route.delete(
  '/:userId',
  authMiddleware(ROLE_TYPES.ADMIN),
  userController.deleteUser
)

module.exports = route
