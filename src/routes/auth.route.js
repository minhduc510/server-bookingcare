const express = require('express')
const route = express.Router()

const authController = require('~/controllers/auth.controller')
const validate = require('~/middleware/validate')
const authMiddleware = require('~/middleware/authMiddleware')
const authSchema = require('~/validations/auth.validation')

route.post(
  '/register',
  validate(authSchema.registerSchema),
  authController.register
)
route.post(
  '/login',
  validate(authSchema.loginSchema),
  authController.login
)
route.get(
  '/refreshToken',
  validate(authSchema.refreshTokenSchema),
  authController.refreshToken
)
route.get(
  '/sendMail-getPassWord',
  validate(authSchema.sendMailGetPassWordSchema),
  authController.sendMailGetPassWord
)
route.get(
  '/token-email',
  authMiddleware(),
  authController.checkTokenEmail
)
route.post(
  '/recover-password/:userId',
  validate(authSchema.recoverPassWordSchema),
  authController.recoverPassWord
)

module.exports = route
