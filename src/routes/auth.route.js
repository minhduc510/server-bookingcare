const express = require('express')
const passport = require('passport')
const route = express.Router()

const env = require('~/configs/environment')
const validate = require('~/middleware/validate')
const authSchema = require('~/validations/auth.validation')
const authMiddleware = require('~/middleware/authMiddleware')
const authController = require('~/controllers/auth.controller')
const roleLoginMiddleware = require('~/middleware/roleLoginMiddleware')

route.post(
  '/register',
  validate(authSchema.registerSchema),
  authController.register
)

route.post(
  '/login',
  validate(authSchema.loginSchema),
  roleLoginMiddleware(),
  authController.login
)

route.get(
  '/refreshToken',
  validate(authSchema.refreshTokenSchema),
  authController.refreshToken
)

route.get(
  '/auth-role-login/:nameRole',
  authController.authRoleLogin
)

route.get(
  '/sendMail-getPassWord',
  validate(authSchema.sendMailGetPassWordSchema),
  authController.sendMailGetPassWord
)

route.get(
  '/user-social-login/:userId',
  authController.loginUserSocial
)

route.get(
  '/token-email',
  authMiddleware(),
  authController.checkTokenEmail
)

route.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
)

route.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate(
      'google',
      (err, userId, token) => {
        req.userId = userId
        res.token = token
        next()
      }
    )(req, res, next)
  },
  (req, res) => {
    res.cookie('tokenSocial', res.token)
    res.redirect(
      `${env.URL_CLIENT}/login-social-success/google/${req.userId}`
    )
  }
)

route.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
    session: false
  })
)

route.get(
  '/facebook/callback',
  (req, res, next) => {
    passport.authenticate(
      'facebook',
      (err, userId, token) => {
        req.userId = userId
        res.token = token
        next()
      }
    )(req, res, next)
  },
  (req, res) => {
    res.cookie('tokenSocial', res.token)
    res.redirect(
      `${env.URL_CLIENT}/login-social-success/facebook/${req.userId}`
    )
  }
)

route.post(
  '/recover-password/:userId',
  validate(authSchema.recoverPassWordSchema),
  authController.recoverPassWord
)

module.exports = route
