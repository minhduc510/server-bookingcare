const express = require('express')
const route = express.Router()

const authController = require('~/controllers/auth.controller')
const validate = require('~/middleware/validate')
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

module.exports = route
